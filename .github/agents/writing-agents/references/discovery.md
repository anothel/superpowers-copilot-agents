# Writing Agent Definitions for Discovery

Part of [writing-agents](../../writing-agents.agent.md). Name, describe, and
size a VS Code GitHub Copilot custom agent so users and delegating agents can
choose it and read its instructions.

## Agent File Structure

Use `agent-name.agent.md` in `.github/agents/` for a project agent, or
`~/.copilot/agents/` for a personal agent. Extension agents are registered and
packaged through the extension's existing manifest. Keep supporting resources
under a matching `agent-name/` folder and resolve links from the containing file.

```markdown
---
name: agent-name
description: Use when [specific triggering conditions and symptoms]
---

# Agent Name

## Overview
What this workflow teaches; core principle in one or two sentences.

## When to Use
Symptoms and use cases; limits of applicability.

## Core Pattern
Before/after example or a short decision process.

## Quick Reference
Table or bullets for scanning common operations.

## Implementation
Inline simple patterns; link to heavy reference or reusable tools.

## Common Mistakes
What goes wrong and how to correct it.
```

`name` supplies the displayed name; choose a stable file stem and name with
letters, numbers, and hyphens. `description` explains when to select the agent.
These are authoring conventions, not the Agent Skills YAML schema.

Optional fields depend on the host: `tools` restricts available tools, and
`model` selects a supported model. Omit `model` to use Copilot's selected model;
do not copy `model: inherit` from another harness. Use only tools exposed in the
current environment. `handoffs` can describe a transition in hosts that support
them; provide a readable workflow transition for hosts without those buttons.

Selecting a custom agent and reading an agent definition inline are distinct
operations. Descriptions help selection and delegation; they do not install a
Skill tool or automatically activate the agent for every matching request.

## Agent Discovery

### 1. Rich Description Field

Make the description answer: "Should this agent be selected for this task?"
Start with "Use when..." and describe concrete conditions, symptoms, or context.
Keep it short, preferably under 500 characters.

**Description = when to use, not a summary of the workflow.** A description that
summarizes review stages can become a shortcut: an agent follows the summary
instead of reading the full instructions. Keep the process in the body.

```yaml
# BAD: process summary creates a shortcut
description: Use when executing plans - dispatches subagent per task with code review between tasks

# BAD: vague or first-person
description: I can help with async tests

# GOOD: triggering conditions only
description: Use when executing implementation plans with independent tasks in the current session

# GOOD: observable symptoms
description: Use when tests have race conditions, timing dependencies, or pass/fail inconsistently
```

Describe the problem rather than language-specific symptoms unless the workflow
is itself technology-specific. Use third person and concrete conditions.

### 2. Keyword Coverage

Use words users and agents search for: error text (`ENOTEMPTY`, `Hook timed out`),
symptoms (`flaky`, `hanging`, `pollution`), synonyms (`timeout`, `hang`, `freeze`),
and actual commands, libraries, and file types. Do not repeat keywords at the
expense of readable guidance.

### 3. Descriptive Naming

Name the action or insight. `creating-agents`, `condition-based-waiting`, and
`root-cause-tracing` are more useful than `agent-creation`, `async-test-helpers`,
or `debugging-techniques`. Gerunds work well for processes.

### 4. Token Efficiency

Every loaded instruction competes with history and working context. Aim for
under 150 words for a startup routing section, under 200 for frequently loaded
guidance, and under 500 for other main definitions where feasible. These are
writing targets, not Copilot file-format limits.

- Move flag lists to tool `--help` instead of repeating them.
- Link to sibling workflow definitions rather than copying their steps.
- Keep one excellent example and eliminate redundant restatements.
- Split heavy reference and reusable scripts from the main definition.

Measure the main file after editing; review each section that loads on selection.

### 5. Cross-Referencing Other Agents

Use an explicit requirement and a relative link. From a root agent definition:

```markdown
**REQUIRED BACKGROUND:** Read [test-driven-development](test-driven-development.agent.md).
**REQUIRED:** Read [systematic-debugging](systematic-debugging.agent.md) and apply it in this conversation.
```

From a supporting reference under `agent-name/references/`, the sibling link is
`../../test-driven-development.agent.md`. Read only the needed reference when
its condition applies. Use the current host's real delegation tool for bounded
tasks when available; otherwise apply the linked workflow inline. Do not invent
a Skill invocation or a model-selection API.
