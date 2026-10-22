# VS Code GitHub Copilot adaptation

These are custom Agents supplied by a VS Code extension, not installed Skills.
Use the tools actually exposed by the current Copilot session. Tool names vary
between VS Code's Local and Copilot harnesses; never invent a tool or assume a
Claude Code, Codex, or Copilot CLI API is present.

## Workflow transitions

Selecting an Agent in the chat Agent dropdown activates its instructions until
the user selects another Agent. An instruction to "use", "invoke", or "load"
another workflow means: read its sibling `<name>.agent.md`, then apply its body
inline in the current conversation. Preserve the user's context and approval
state. Do not send an interactive design or planning conversation to a subagent.
If those files cannot be read, tell the user which Agent to select in the
dropdown. Do not assume `@name` switches the active custom Agent.

The upstream `writing-skills` workflow is named `writing-agents` in this
extension. `code-reviewer` is a subagent-only helper.

`handoffs` buttons are optional Local-harness conveniences. Copilot sessions
must work without them. There is no Skill tool or automatic session-start hook
in this extension. Do not recursively invoke the bootstrap in a bounded worker.

## Available tools

| Upstream action | VS Code Copilot action |
| --- | --- |
| Read / Write / Edit | Available file-reading and file-editing tools |
| Grep / Glob | Available content/file search tools |
| Bash / shell | Integrated terminal or available command tool, using its real schema |
| TodoWrite / task list | Available todo tool; otherwise the plan's Markdown checklist |
| Skill / required workflow | Read and apply the corresponding sibling Agent inline |
| Task / Agent / Subagent | Available subagent/delegation tool for a bounded task |
| WebFetch / WebSearch | Available fetch/search tool; follow workspace network permissions |
| AskUserQuestion | Available question tool or a question in the main chat |
| EnterPlanMode / ExitPlanMode | Keep the plan and approval conversation in the main chat |

Delegate only when the session exposes an appropriate tool. Provide the task,
files, required context, allowed edit scope, verification command, and expected
report. Supply template contents when a worker cannot access the template file.
Check returned work against the diff and evidence. If subagents are unavailable,
use `executing-plans` and disclose that final review was a self-review.

Upstream `model:` entries in dispatch templates express a desired capability,
not literal Copilot tool arguments. Use a supported model selector only if the
actual tool exposes one. Otherwise use the session's configured model and note
the limitation; do not block work to emulate model routing or change user settings.
Do not assume a worker can be resumed: if the available tool cannot resume it,
send a fresh worker the existing report and a bounded correction request.

## Paths and scripts

Resolve installed files relative to the Agent document's actual absolute path,
not the user's working directory. Main Agent documents live in `agents/`, while
supporting files live in `agents/<agent-name>/`. A terminal command must use the
resolved absolute path to a packaged script. No `CLAUDE_PLUGIN_ROOT`, source
checkout, or upstream `skills/` directory is required.

The optional visual companion requires Node.js and Bash. Plan workspace helpers
require Bash, Git, and standard Unix tools. On Windows, use Git Bash, not
PowerShell, to run `.sh` and extensionless Bash helpers; translate absolute paths
to that shell's format and quote paths containing spaces. Execute the command
in the project workspace, with the helper's installed path as its argument.
For a long-running visual server, use the session's supported persistent or
background terminal, read its reported URL, and stop it with its packaged stop
script. Do not pass Claude-only `run_in_background` flags to Copilot tools.

## User instructions and Git

System/developer rules, user requests, and repository instructions take
precedence over these workflows. Check them before Git writes, installing
dependencies, network use, or changing files outside the workspace. A workflow
step that says "commit" is conditional on the user's Git permissions.

When commits are disallowed, keep the work uncommitted. Use the execution
helpers' `WORKTREE` review mode and include tracked changes plus untracked new
files. Record a worktree checkpoint in the ledger rather than claiming a commit
exists. Never stage or commit merely to satisfy a reviewer template.

## Session diagnosis

Copilot does not expose the Claude/Codex transcript layout assumed by some
upstream examples. Use the history/export capability actually available, or a
session file the user explicitly provides. Do not search unrelated private
profile storage or invent telemetry. Record absent evidence as unknown.
