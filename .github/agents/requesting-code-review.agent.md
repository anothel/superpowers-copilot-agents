---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements
handoffs:
  - label: "리뷰 피드백 처리 (Handle Review Feedback)"
    agent: receiving-code-review
    prompt: "Process the code review results above."
    send: false
---

## GitHub Copilot execution

Read [Copilot tools and workflow rules](using-superpowers/references/copilot-tools.md) before acting. User and project instructions take precedence, including Git permissions. Read sibling `<name>.agent.md` files and apply their workflows inline in this session; do not invoke a Skill tool or delegate interactive planning. Use only an actually available subagent tool for bounded implementation or review. Model preferences below are advisory: select a model only when supported, otherwise use the available model without stalling.

`<AGENTS_DIR>` means the absolute directory containing this Agent file, not the project being edited. Resolve helper paths from it and run helpers from the target repository working directory. Bash helpers need Bash (Git Bash on Windows), Git, and standard Unix tools; if unavailable, perform the documented steps with the available shell.

## Git permissions

Follow the user's Git policy before any commit, merge, push, reset, branch deletion, or worktree removal. A plan step or subagent template does not grant permission. When staging or commits are prohibited, leave changes in the working tree, record the baseline and changed paths, and pass `WORKTREE` as the final revision to the review-package helper. It captures tracked changes and new files without staging or committing. Separate pre-existing user changes from this task's scope. Such packages are cumulative from BASE: scope each review with its task brief and keep the previous package for a fix comparison; never invent a commit range or claim a task-only diff if it cannot be isolated. Keep the plan workspace and ledger while uncommitted changes remain.

# Requesting Code Review

Dispatch a code reviewer subagent to catch issues before they cascade. The reviewer gets precisely crafted context for evaluation — never your session's history.

**Core principle:** Review early, review often.

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**1. Choose the actual review input:**

First inspect `git status --short` and identify the scope the user requested. Use the baseline recorded before implementation, rather than guessing `HEAD~1`; a task may span several commits or have no commits.

- **A package was provided:** hand its path to the reviewer.
- **Uncommitted work is in scope:** set `HEAD_SHA=WORKTREE` and use the recorded baseline (`HEAD` if reviewing only current uncommitted changes). Review `git diff BASE_SHA --` plus every in-scope file from `git ls-files --others --exclude-standard`. This includes staged, unstaged, and new files. A standalone review does not require a plan or helper script. If a plan is available, the review-package helper also accepts `WORKTREE`.
- **Committed work only:** pass the recorded base and head commits and review their full range. Use a verified merge base for a branch review.

Do not stage or commit to create a review range. Carry the changed-path scope and any pre-existing user changes into the reviewer prompt.

**2. Dispatch code reviewer subagent:**

Use the available subagent tool with the `code-reviewer` agent when supported, filling the template at [code-reviewer.md](requesting-code-review/code-reviewer.md)

If no subagent tool is available, perform the review inline and label it a self-review; do not claim an independent reviewer ran.

**Placeholders:**
- `{DESCRIPTION}` - Brief summary of what you built
- `{PLAN_OR_REQUIREMENTS}` - What it should do
- `{BASE_SHA}` - Starting commit
- `{HEAD_SHA}` - Ending commit or `WORKTREE`
- `{REVIEW_PACKAGE}` - Existing diff-package path, when supplied

**3. Act on feedback:**
- Fix Critical issues immediately
- Fix Important issues before proceeding
- Note Minor issues for later
- Push back if reviewer is wrong (with reasoning)

## Example

```
[Just completed Task 2: Add verification function]

You: Let me request code review before proceeding.

BASE_SHA=[baseline recorded before Task 2]
HEAD_SHA=WORKTREE  # Task 2 is still uncommitted

[Dispatch code reviewer subagent]
  DESCRIPTION: Added verifyIndex() and repairIndex() with 4 issue types
  PLAN_OR_REQUIREMENTS: Task 2 from docs/superpowers/plans/deployment-plan.md
  BASE_SHA: a7981ec
  HEAD_SHA: WORKTREE

[Subagent returns]:
  Strengths: Clean architecture, real tests
  Issues:
    Important: Missing progress indicators
    Minor: Magic number (100) for reporting interval
  Assessment: Ready to proceed

You: [Fix progress indicators]
[Continue to Task 3]
```

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll just review the diff myself instead of dispatching a reviewer" | You're the coordinator — reviewing the diff inline burns the context window you need to keep driving the work. Dispatch a reviewer subagent: the diff and the evaluation live in its context, and only the findings come back to you. |
| "The reviewer needs my whole session history to understand the change" | Hand it precisely crafted context, never your session's history. That keeps the reviewer on the work product, not your thought process. |

## Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues
- Argue with valid technical feedback

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification

See template at: [code-reviewer.md](requesting-code-review/code-reviewer.md)
