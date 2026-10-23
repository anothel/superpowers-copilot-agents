# Changelog

## 7.0.2

- Add an extension icon for the Marketplace and VS Code extension details.
- No changes to Agent workflows or runtime behavior.

## 7.0.1

- Port Superpowers v7.0.1 workflows and runtime resources to Copilot custom Agents.
- Add `diagnosing-superpowers`; retain the `writing-agents` authoring adaptation.
- Refresh brainstorming, inline execution, task-scoped reviews, planning and test guidance.
- Include current authenticated visual companion and new execution/review helpers.
- Adapt workflow transitions, tools, model selection and transcript access to VS Code Copilot.
- Register Agents through `contributes.chatAgents` and remove home-folder deletion/copying.
- Validate Agent metadata, resource links and packaged files before producing a VSIX.

**Migration:** Remove the old `~/.superpowers-copilot/agents` entry from
`chat.agentFilesLocations` to avoid stale Local-harness entries. Existing files
and user settings are left untouched.
