const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

const root = path.resolve(__dirname, '..');

function request(url, { cookie, upgrade = false, origin } = {}) {
  return new Promise((resolve, reject) => {
    const headers = cookie ? { Cookie: cookie } : {};
    if (origin) headers.Origin = origin;
    if (upgrade) Object.assign(headers, {
      Connection: 'Upgrade', Upgrade: 'websocket',
      'Sec-WebSocket-Version': '13', 'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
    });
    const req = http.get(url, { headers }, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('upgrade', (res, socket) => {
      socket.destroy();
      resolve({ status: res.statusCode, headers: res.headers });
    });
    req.setTimeout(3000, () => req.destroy(new Error('Request timed out')));
    req.on('error', reject);
  });
}

test('packaged visual server authenticates HTTP and WebSocket sessions', { timeout: 15000 }, async () => {
  const stateRoot = path.join(root, '.superpowers');
  fs.mkdirSync(stateRoot, { recursive: true });
  const fixture = fs.mkdtempSync(path.join(stateRoot, 'visual-test-'));
  const child = spawn(process.execPath, [path.join(root, '.github/agents/brainstorming/scripts/server.cjs')], {
    env: {
      ...process.env, BRAINSTORM_DIR: fixture, BRAINSTORM_HOST: '127.0.0.1',
      BRAINSTORM_PORT: '', BRAINSTORM_PORT_FILE: '', BRAINSTORM_TOKEN: '',
      BRAINSTORM_TOKEN_FILE: '', BRAINSTORM_OPEN: '', BRAINSTORM_OWNER_PID: '',
      SUPERPOWERS_DISABLE_TELEMETRY: '1',
    },
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stderr = '';
  child.stderr.on('data', data => { stderr += data; });
  try {
    const info = await new Promise((resolve, reject) => {
      let output = '';
      const timer = setTimeout(() => reject(new Error(`Server startup timed out: ${stderr}`)), 5000);
      const finish = (error, value) => {
        clearTimeout(timer);
        error ? reject(error) : resolve(value);
      };
      child.on('error', error => finish(error));
      child.on('exit', code => finish(new Error(`Server exited ${code}: ${stderr}`)));
      child.stdout.on('data', data => {
        output += data;
        const line = output.split('\n').find(line => line.includes('"server-started"'));
        if (line) finish(null, JSON.parse(line));
      });
    });
    const base = `http://127.0.0.1:${info.port}`;
    const key = new URL(info.url).searchParams.get('key');
    assert(key && key.length >= 32);
    assert.equal((await request(base)).status, 403);
    assert.equal((await request(`${base}/?key=wrong`)).status, 403);
    await assert.rejects(request(base, { upgrade: true }), { code: 'ECONNRESET' });
    const bootstrap = await request(`${base}/?key=${key}`);
    assert.equal(bootstrap.status, 200);
    const cookie = bootstrap.headers['set-cookie'][0].split(';')[0];
    assert.match(bootstrap.headers['set-cookie'][0], /HttpOnly; SameSite=Strict/);
    assert.equal(bootstrap.headers['referrer-policy'], 'no-referrer');
    fs.writeFileSync(path.join(info.screen_dir, 'auth-check.html'), '<h1>copilot-port-check</h1>');
    const screen = await request(base, { cookie });
    assert.equal(screen.status, 200);
    assert.match(screen.body, /copilot-port-check/);
    assert(screen.body.includes(`Superpowers v${require('../package.json').version}`), 'Version must resolve from extension manifest');
    assert.equal((await request(`${base}/?key=wrong`, { cookie })).status, 403);
    assert.equal((await request(`${base}/?key=${key}`, { upgrade: true })).status, 101);
    await assert.rejects(request(`${base}/?key=${key}`, { upgrade: true, origin: 'https://untrusted.example' }), { code: 'ECONNRESET' });
    console.log('HTTP auth, session cookie, key rejection, WebSocket auth, and extension version verified.');
  } finally {
    if (child.exitCode === null && child.signalCode === null && child.pid) {
      const exited = once(child, 'exit');
      child.kill();
      await exited;
    }
    assert(fixture.startsWith(stateRoot + path.sep));
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
