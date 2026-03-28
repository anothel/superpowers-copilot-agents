import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

const AGENTS_SOURCE_DIR = ".github/agents";
const SETTING_KEY = "chat.agentFilesLocations";
const GLOBAL_AGENTS_DIR = "~/.superpowers-copilot/agents";

function getTargetDir(): string {
  const homeDir = process.env["HOME"] || process.env["USERPROFILE"] || "";
  return path.join(homeDir, ".superpowers-copilot", "agents");
}

function copyDirRecursive(src: string, dest: string): number {
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }

  return count;
}

function cleanTargetDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".js") || entry.name.endsWith(".dot")) {
      fs.rmSync(fullPath, { force: true });
    }
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const sourceDir = path.join(context.extensionPath, AGENTS_SOURCE_DIR);
  const targetDir = getTargetDir();

  try {
    // 1. Clean old files
    cleanTargetDir(targetDir);

    // 2. Copy all agent files + supporting files recursively
    const totalFiles = copyDirRecursive(sourceDir, targetDir);
    const agentCount = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".agent.md")).length;

    // 3. Register path in VS Code settings
    registerAgentsPath();

    vscode.window.showInformationMessage(
      `Superpowers Copilot Agents: ${agentCount} agents activated (${totalFiles} files total).`
    );
  } catch (err) {
    vscode.window.showErrorMessage(`Superpowers Copilot Agents: Failed to register agents — ${err}`);
  }
}

async function registerAgentsPath(): Promise<void> {
  const config = vscode.workspace.getConfiguration();
  const current = config.get<Record<string, boolean>>(SETTING_KEY) || {};

  if (!current[GLOBAL_AGENTS_DIR]) {
    await config.update(SETTING_KEY, { ...current, [GLOBAL_AGENTS_DIR]: true }, vscode.ConfigurationTarget.Global);
  }
}

export function deactivate(): void {}
