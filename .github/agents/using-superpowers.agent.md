---
name: using-superpowers
description: Use when starting a conversation or choosing the Superpowers Agent workflow for a request
handoffs:
  - label: "브레인스토밍 (Brainstorm)"
    agent: brainstorming
    prompt: "Explore the user's goal and design a solution using the existing conversation."
    send: false
  - label: "디버깅 (Debug)"
    agent: systematic-debugging
    prompt: "Investigate the reported issue before proposing a fix."
    send: false
  - label: "에이전트 작성 (Write Agent)"
    agent: writing-agents
    prompt: "Create or update a Copilot custom Agent for the user's request."
    send: false
  - label: "세션 진단 (Diagnose Session)"
    agent: diagnosing-superpowers
    prompt: "Diagnose the reported Superpowers session using available session evidence."
    send: false
---

<SUBAGENT-STOP>
If you were dispatched as a subagent for a specific bounded task, perform that
task. Do not rerun bootstrap discovery or redirect the user to brainstorming.
</SUBAGENT-STOP>

# Using Superpowers Agents

Read [VS Code Copilot tools and workflow transitions](using-superpowers/references/copilot-tools.md)
before applying a workflow. This extension converts the Superpowers v7.0.1
procedures into custom Agents. Selecting this Agent starts discovery; installing
the extension alone does not activate its instructions in every conversation.

## The rule

**Read relevant or requested Agent instructions before responding or acting**,
including clarifying questions, exploring code, and entering planning. If even
a 1% chance exists that a workflow applies, read it. If it turns out not to fit,
continue without imposing it. Before planning a feature, apply brainstorming
unless a design has already been approved in this conversation.

Announce "Using [Agent] to [purpose]" once, then follow its body. Track its
checklist with the available todo tool or a Markdown plan. Carry existing
decisions and approvals forward; switching workflow does not restart discovery.

## Workflow priority and routing

Process workflows determine the approach before implementation workflows.

| User intent | Read and apply |
| --- | --- |
| A new feature, behavior change, or design question | [brainstorming](brainstorming.agent.md) |
| A bug, failure, or unexpected behavior | [systematic-debugging](systematic-debugging.agent.md) |
| An approved design needs an implementation plan | [writing-plans](writing-plans.agent.md) |
| Execute a plan with task-by-task independent review | [subagent-driven-development](subagent-driven-development.agent.md) |
| Execute inline, or no subagent tool is available | [executing-plans](executing-plans.agent.md) |
| Write production behavior or fix a bug | [test-driven-development](test-driven-development.agent.md) |
| Request a review | [requesting-code-review](requesting-code-review.agent.md) |
| Evaluate review feedback | [receiving-code-review](receiving-code-review.agent.md) |
| Two or more independent investigations | [dispatching-parallel-agents](dispatching-parallel-agents.agent.md) |
| Prepare an isolated workspace | [using-git-worktrees](using-git-worktrees.agent.md) |
| Finish implemented work | [finishing-a-development-branch](finishing-a-development-branch.agent.md) |
| Claim a change is complete or passing | [verification-before-completion](verification-before-completion.agent.md) |
| Create or update a custom Agent | [writing-agents](writing-agents.agent.md) |
| Explain a slow, repeated, or unsuccessful Superpowers session | [diagnosing-superpowers](diagnosing-superpowers.agent.md) |

Read the selected sibling file and apply it inline in this conversation. Keep
interactive design and approval in the main chat. Delegate bounded tasks only
when the actual available tools support that. If the file is unavailable, name
the Agent for the user to select in the dropdown.

## Red flags

| Thought | Required action |
| --- | --- |
| "Just a simple question" | Check whether a workflow actually applies. |
| "Need to explore first" | Read applicable process instructions first. |
| "I remember this workflow" | Read the installed version. |
| "This does not count as work" | Actions, questions, and code inspection still require the workflow check. |
| "The Agent is overkill" | Apply its task-sizing guidance and the user's constraints. |
| "One quick change first" | Establish the approach before editing. |
| "Already approved" | Preserve the approval and continue from the agreed stage. |

## User instructions

User requests and repository instructions take precedence over workflow defaults,
subject to system and developer instructions. Do not use an Agent to bypass
permissions or invent access to tools. Explicit instructions such as "no Git
commits" or "do not run tests" override the corresponding default workflow steps.
