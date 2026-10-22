# Superpowers Copilot Agents

Superpowers workflow skills converted to VS Code Copilot agents.

## What it does

Based on [Superpowers v7.0.1](https://github.com/obra/superpowers/releases/tag/v7.0.1)
(`2ce8aa15d05bd57213e6f746f953aafb7ded7a8b`). Install the extension to add 15
custom Agents to VS Code's chat Agent dropdown:

- `brainstorming` — Inspect context, discuss options, and agree on a task-sized design
- `writing-plans` — Turn an approved design into checkable implementation tasks
- `executing-plans` — Execute inline with a progress ledger and final review
- `subagent-driven-development` — Fresh implementer per task, task review, and final review
- `test-driven-development` — Red-Green-Refactor and tests that catch broken behavior
- `systematic-debugging` — Investigate root cause before proposing fixes
- `requesting-code-review` — Prepare a scoped code review
- `receiving-code-review` — Evaluate and address review feedback
- `finishing-a-development-branch` — Verify work and choose how to integrate it
- `dispatching-parallel-agents` — Delegate independent tasks when tools support it
- `using-git-worktrees` — Prepare isolated workspaces
- `using-superpowers` — Discover and route to the right workflow
- `verification-before-completion` — Gather evidence before completion claims
- `writing-agents` — Create and improve Copilot custom Agents using behavioral checks
- `diagnosing-superpowers` — Diagnose sessions using available transcripts and evidence

A `code-reviewer` helper is available for delegation and hidden from the dropdown.

## Usage

1. Install the extension and open GitHub Copilot chat in VS Code.
2. Select `using-superpowers` in the **Agent dropdown**, or select a specific workflow.
3. Describe the task. The Agent reads related workflow instructions as needed while
   keeping design questions and approval in the same conversation.

Installing the extension makes the Agents available; it does not force every chat
to run Superpowers. Custom Agents are selected in the dropdown, not invoked as
`@` chat participants. Where supported, bounded implementation and review tasks
use subagents. Without delegation tools, execution stays inline. Model selection
uses the model configured in the session unless the available tools support an override.

Optional scripts require Node.js, Bash, Git, and standard Unix tools; rendering
Agent flowcharts also requires Graphviz. On Windows, use Git Bash for these helpers. All Agent files
and support resources are bundled; no upstream checkout or Skill installation is needed.

Project instructions and user permissions take precedence over workflow defaults,
including permissions for Git writes, dependency installation, and verification.

## How it works

The extension declares its `.agent.md` files through VS Code's
[`contributes.chatAgents`](https://code.visualstudio.com/api/references/contribution-points#contributeschatagents).
VS Code loads them directly from the extension. There is no activation script,
home-directory copying, or global settings update. Supporting prompts and helper
scripts remain beside their Agent files. Optional `handoffs` metadata is retained
for the Local harness; Copilot workflows also work by reading sibling Agent instructions.

### Upgrading from v5

The old extension copied files into `~/.superpowers-copilot/agents` and added that
path to `chat.agentFilesLocations`. v7 leaves those files untouched. To avoid
duplicate or stale entries in Local sessions, remove **only that path's entry**
from the setting after installing v7. Keep any custom files in the old folder.
Copilot sessions use the extension contributions directly.

## Development

```sh
npm ci
npm run check
npm test
npm run package
```

The check validates Agent frontmatter, routing targets, local resource links,
and VSIX resource inclusion. The test checks the visual server's HTTP/WebSocket
authentication on loopback, with temporary state inside the workspace.
Packaging runs the Agent check again automatically and produces
`superpowers-copilot-agents-7.0.1.vsix`. No TypeScript compilation is required.
Install the VSIX with **Extensions: Install from VSIX...**, reload VS Code, then
check the Agent dropdown. Publishing remains a separate maintainer action.

Future upstream updates must refresh both the main Agent instructions and their
support files. Adapt Skill calls, relative paths, tools, model assumptions, and
session access to Copilot; preserve the `writing-agents` name and Agent format.

## Credits

Based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent, under
the MIT license. This extension adapts its workflows to VS Code GitHub Copilot Agents.
