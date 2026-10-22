const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { listFiles, PackageManager } = require('@vscode/vsce');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const agentDir = path.join(root, '.github/agents');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    assert(!entry.isSymbolicLink(), `Unexpected symlink: ${file}`);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

async function main() {
  const files = walk(agentDir);
  const roots = fs.readdirSync(agentDir).filter(file => file.endsWith('.agent.md')).sort();
  const contributed = manifest.contributes.chatAgents.map(entry => {
    const file = path.resolve(root, entry.path);
    assert.equal(path.dirname(file), agentDir, `Agent outside agent directory: ${entry.path}`);
    return path.basename(file);
  }).sort();
  assert.deepEqual(contributed, roots, 'Every Agent must be contributed exactly once');
  assert.equal(roots.length, 16, 'Expected 15 workflows and one review helper');
  assert(!manifest.main && !manifest.activationEvents, 'Agent registration must not require activation');
  assert(!manifest.contributes.chatSkills, 'This extension distributes Agents');
  const names = new Set(roots.map(file => file.replace('.agent.md', '')));
  let visible = 0;
  let links = 0;

  for (const name of roots) {
    const text = fs.readFileSync(path.join(agentDir, name), 'utf8');
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    assert(match, `Missing frontmatter: ${name}`);
    const data = yaml.load(match[1]);
    assert.equal(data.name, name.replace('.agent.md', ''), `Wrong Agent name: ${name}`);
    assert.equal(typeof data.description, 'string', `Missing description: ${name}`);
    assert(data.description.trim(), `Empty description: ${name}`);
    assert.notEqual(data.model, 'inherit', `Unsupported model placeholder: ${name}`);
    assert(!text.includes('${CLAUDE_PLUGIN_ROOT}'), `Unresolved plugin path: ${name}`);
    if (data['user-invocable'] !== false) visible++;
    for (const handoff of data.handoffs || []) {
      assert(names.has(handoff.agent), `Unknown handoff ${handoff.agent} in ${name}`);
      assert.equal(handoff.send, false, `Handoffs must wait for user selection: ${name}`);
    }
  }
  assert.equal(visible, 15, 'Only the review helper should be hidden');

  for (const file of files.filter(file => file.endsWith('.md'))) {
    const text = fs.readFileSync(file, 'utf8').replace(/^```[^\n]*\n[\s\S]*?^```[^\n]*$/gm, '');
    for (const match of text.matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/g)) {
      const target = match[1];
      if (/^(?:[a-z]+:|#|\/|~)|[<>{}]/i.test(target)) continue;
      const relative = decodeURIComponent(target.split('#')[0]);
      if (!relative) continue;
      const resolved = path.resolve(path.dirname(file), relative);
      assert(resolved.startsWith(agentDir + path.sep), `Link leaves packaged Agents: ${file}: ${target}`);
      assert(fs.existsSync(resolved), `Broken resource link: ${path.relative(root, file)} -> ${target}`);
      links++;
    }
  }

  const packaged = new Set((await listFiles({ cwd: root, packageManager: PackageManager.None }))
    .map(file => file.replaceAll('\\', '/')));
  for (const file of files) {
    const relative = path.relative(root, file).replaceAll('\\', '/');
    assert(packaged.has(relative), `Resource omitted from VSIX: ${relative}`);
  }
  assert(![...packaged].some(file => /^(?:dist|src|node_modules|scripts|docs|\.superpowers)\//.test(file)), 'Development files included');
  assert(!packaged.has('DEVELOPMENT.md'), 'User development notes must stay local');
  console.log(`OK: ${roots.length} Agents (${visible} visible), ${files.length} packaged resources, ${links} local links.`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
