# Superpowers Copilot Agents

Superpowers workflow skills converted to VS Code Copilot agents.

## What it does

Install this extension and get 14 specialized Copilot agents automatically:

- `@brainstorming` — Design before implementation
- `@writing-plans` — Create detailed implementation plans
- `@executing-plans` — Execute plans with review checkpoints
- `@subagent-driven-development` — Fresh subagent per task + two-stage review
- `@test-driven-development` — Red-Green-Refactor TDD workflow
- `@systematic-debugging` — Root cause investigation before fixes
- `@requesting-code-review` — Dispatch code reviewer
- `@receiving-code-review` — Handle review feedback properly
- `@finishing-a-development-branch` — Merge, PR, or cleanup options
- `@dispatching-parallel-agents` — Parallel independent tasks
- `@using-git-worktrees` — Isolated workspaces
- `@using-superpowers` — Agent discovery and routing
- `@verification-before-completion` — Evidence before claims
- `@writing-skills` — Create new skills with TDD

## How it works

On activation, the extension copies agent files to `~/.superpowers-copilot/agents/` and registers the path in VS Code's `chat.agentFilesLocations` setting. That's it.

## Credits

Based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent.
