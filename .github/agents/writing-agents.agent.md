---
name: writing-agents
description: "Use when creating new agents, editing existing agents, or verifying agents work before deployment"
handoffs:
  - label: "브레인스토밍 (Brainstorm)"
    agent: brainstorming
    prompt: "Brainstorm a design for the agent described above."
    send: false
---

# Writing Agents

## VS Code Copilot

Use the [Copilot tool mapping](using-superpowers/references/copilot-tools.md).
Read a linked sibling `.agent.md` and apply its workflow in the main conversation.
Delegate bounded analysis only when a subagent tool is exposed; otherwise work inline.
Use the selected model when model controls are unavailable.

## Overview

**Writing agents IS Test-Driven Development applied to process documentation.**

**Copilot agents are `.agent.md` files.** Put project agents in `.github/agents/` and personal agents in `~/.copilot/agents/`. This extension packages agent definitions and their supporting resources; follow its existing manifest when adding one.

You write test cases (pressure scenarios with subagents), watch them fail (baseline behavior), write the workflow (documentation), watch tests pass (agents comply), and refactor (close loopholes).

**Core principle:** If you didn't watch an agent fail without the workflow, you don't know if the workflow teaches the right thing.

**REQUIRED BACKGROUND:** You MUST understand [test-driven-development](test-driven-development.agent.md) before using this workflow. That workflow defines the fundamental RED-GREEN-REFACTOR cycle. This workflow adapts TDD to documentation.

**Reference:** [Anthropic authoring guidance](writing-agents/references/anthropic-best-practices.md) supplies general documentation principles. Its Skill discovery, YAML schema, runtime paths, and model examples describe Anthropic. Use [Agent discovery](writing-agents/references/discovery.md) for this extension's Copilot format.

## What is an Agent?

A **custom agent** is a selectable `.agent.md` definition containing a reusable workflow, techniques, patterns, and tool guidance for VS Code Copilot.

**Agents are:** Reusable techniques, patterns, tools, reference guides

**Agents are NOT:** Narratives about how you solved a problem once

## TDD Mapping for Agents

| TDD Concept | Agent Creation |
|-------------|----------------|
| **Test case** | Pressure scenario with subagent |
| **Production code** | Agent definition (`agent-name.agent.md`) |
| **Test fails (RED)** | Agent violates rule without workflow (baseline) |
| **Test passes (GREEN)** | Agent complies with workflow present |
| **Refactor** | Close loopholes while maintaining compliance |
| **Write test first** | Run baseline scenario BEFORE writing workflow |
| **Watch it fail** | Document exact rationalizations agent uses |
| **Minimal code** | Write workflow addressing those specific violations |
| **Watch it pass** | Verify agent now complies |
| **Refactor cycle** | Find new rationalizations → plug → re-verify |

The entire workflow creation process follows RED-GREEN-REFACTOR.

## When to Create an Agent

**Create when:**
- Technique wasn't intuitively obvious to you
- You'd reference this again across projects
- Pattern applies broadly (not project-specific)
- Others would benefit

**Don't create for:**
- One-off solutions
- Standard practices well-documented elsewhere
- Project-specific conventions (put in your instructions file)
- Mechanical constraints (if it's enforceable with regex/validation, automate it—save documentation for judgment calls)

## Agent Types

### Technique
Concrete method with steps to follow (condition-based-waiting, root-cause-tracing)

### Pattern
Way of thinking about problems (flatten-with-flags, test-invariants)

### Reference
API docs, syntax guides, tool documentation (office docs)

## Directory Structure


```text
.github/agents/
  agent-name.agent.md      # Main definition
  agent-name/             # Optional supporting resources
    references/guide.md
    scripts/tool.js
```

**Flat namespace** - selectable `.agent.md` files share the agent directory. Users select a custom agent; other agents can delegate when the host exposes that capability. A trigger description does not automatically activate an agent.

**Separate files for:**
1. **Heavy reference** (100+ lines) - API docs, comprehensive syntax
2. **Reusable tools** - Scripts, utilities, templates

**Keep inline:**
- Principles and concepts
- Code patterns (< 50 lines)
- Everything else

## Writing `.agent.md`

An agent's `description` says only when to use it: triggering conditions and
symptoms, starting with "Use when...". Keep the process in the body; a description
that summarizes it can become a shortcut that replaces reading the instructions.

When you write or change a workflow's frontmatter, name or description, or
need to cut its size, read [Agent discovery](writing-agents/references/discovery.md):
the `.agent.md` template, description and keyword guidance, naming, token
budgets, and cross-referencing other workflows.

## Flowcharts

When you add or change a flowchart in a workflow, read
[Flowcharts](writing-agents/references/flowcharts.md) first: when a flowchart
earns its place, the graphviz conventions, and how to render one.

## Code Examples

**One excellent example beats many mediocre ones**

Choose most relevant language:
- Testing techniques → TypeScript/JavaScript
- System debugging → Shell/Python
- Data processing → Python

**Good example:**
- Complete and runnable
- Well-commented explaining WHY
- From real scenario
- Shows pattern clearly
- Ready to adapt (not generic template)

**Don't:**
- Implement in 5+ languages
- Create fill-in-the-blank templates
- Write contrived examples

You're good at porting - one great example is enough.

## File Organization

### Self-Contained Agent

`.github/agents/my-agent.agent.md` contains the whole workflow.

### Agent with Supporting Resources

`.github/agents/my-agent.agent.md` links to resources under
`.github/agents/my-agent/`. Resolve paths relative to the file containing
the link, not the workspace working directory. Supporting prompts and references
are not additional selectable agents.

Invoke bundled scripts through their interpreter in the prose (`bash scripts/tool.sh`, `node scripts/tool.js`), never by bare path: some harness plugin packagers strip executable bits, and a bare `scripts/tool.sh` fails there with `Permission denied`.

## The Iron Law (Same as TDD)

```
NO AGENT WITHOUT A FAILING TEST FIRST
```

This applies to NEW workflows AND EDITS to existing workflows.

Write workflow before testing? Delete it. Start over.
Edit workflow without testing? Same violation.

**No exceptions:**
- Not for "simple additions"
- Not for "just adding a section"
- Not for "documentation updates"
- Don't keep untested changes as "reference"
- Don't "adapt" while running tests
- Delete means delete

**REQUIRED BACKGROUND:** The [test-driven-development](test-driven-development.agent.md) workflow explains why this matters. Same principles apply to documentation.

## Testing All Agent Types

Different workflow types need different test approaches:

### Discipline-Enforcing Agents (rules/requirements)

**Examples:** TDD, verification-before-completion, designing-before-coding

**Test with:**
- Academic questions: Do they understand the rules?
- Pressure scenarios: Do they comply under stress?
- Multiple pressures combined: time + sunk cost + exhaustion
- Identify rationalizations and add explicit counters

**Success criteria:** Agent follows rule under maximum pressure

### Technique Agents (how-to guides)

**Examples:** condition-based-waiting, root-cause-tracing, defensive-programming

**Test with:**
- Application scenarios: Can they apply the technique correctly?
- Variation scenarios: Do they handle edge cases?
- Missing information tests: Do instructions have gaps?

**Success criteria:** Agent successfully applies technique to new scenario

### Pattern Agents (mental models)

**Examples:** reducing-complexity, information-hiding concepts

**Test with:**
- Recognition scenarios: Do they recognize when pattern applies?
- Application scenarios: Can they use the mental model?
- Counter-examples: Do they know when NOT to apply?

**Success criteria:** Agent correctly identifies when/how to apply pattern

### Reference Agents (documentation/APIs)

**Examples:** API documentation, command references, library guides

**Test with:**
- Retrieval scenarios: Can they find the right information?
- Application scenarios: Can they use what they found correctly?
- Gap testing: Are common use cases covered?

**Success criteria:** Agent finds and correctly applies reference information

## Common Rationalizations for Skipping Testing

| Excuse | Reality |
|--------|---------|
| "Agent is obviously clear" | Clear to you ≠ clear to other agents. Test it. |
| "It's just a reference" | References can have gaps, unclear sections. Test retrieval. |
| "Testing is overkill" | Untested workflows have issues. Always. 15 min testing saves hours. |
| "I'll test if problems emerge" | Problems = agents can't use workflow. Test BEFORE deploying. |
| "Too tedious to test" | Testing is less tedious than debugging bad workflow in production. |
| "I'm confident it's good" | Overconfidence guarantees issues. Test anyway. |
| "Academic review is enough" | Reading ≠ using. Test application scenarios. |
| "No time to test" | Deploying untested workflow wastes more time fixing it later. |

**All of these mean: Test before deploying. No exceptions.**

## Match the Form to the Failure

Before writing guidance, classify the baseline failure. The form that bulletproofs one failure type measurably backfires on another.

| Baseline failure | Right form | Wrong form |
|---|---|---|
| Skips/violates a rule under pressure (knows better, does it anyway) | Prohibition + rationalization table + red flags (see writing-agents/references/bulletproofing.md) | Soft guidance ("prefer...", "consider...") |
| Complies, but output has the wrong shape (bloated prompt, buried verdict, restated spec) | Positive recipe or contract: state what the output IS — its parts, in order | Prohibition list ("don't restate", "never narrate") |
| Omits a required element from something they already produce | Structural: REQUIRED field or slot in the template they fill in | Prose reminders near the template |
| Behavior should depend on a condition | Conditional keyed to an observable predicate ("if the brief exists, reference it") | Unconditional rule + exemption clauses |

**Why prohibitions backfire on shaping problems:** under a competing incentive ("make the prompt self-contained"), agents negotiate with "don't X". In head-to-head wording tests on dispatch-prompt guidance, the prohibition arm produced clearly more of the unwanted content than the recipe arm (fully separated distributions), and trended worse than even the no-guidance control — micro-test your own case rather than assuming, but never reach for the prohibition by default. A recipe leaves nothing to negotiate: the output matches the stated shape or it doesn't.

**Rules for whichever form you pick:**
- **No nuance clauses.** "Don't X unless it matters" reopens the negotiation — appending a single nuance clause to a winning recipe degraded it from consistent to noisy in the same wording tests. Express a real exception as its own conditional on an observable predicate.
- **Exemption clauses don't scope.** "This limit doesn't apply to code blocks" still suppresses code blocks. If part of the output must be exempt, restructure so the rule can't reach it.

## Bulletproofing Against Rationalization

When the baseline failure is a discipline failure, read
[writing-agents/references/bulletproofing.md](writing-agents/references/bulletproofing.md) before you write
the guidance: closing loopholes, the spirit-vs-letter line, the
rationalization table, and the red-flags list.

## RED-GREEN-REFACTOR for Agents

Follow the TDD cycle:

### RED: Write Failing Test (Baseline)

Run pressure scenario with subagent WITHOUT the workflow. Document exact behavior:
- What choices did they make?
- What rationalizations did they use (verbatim)?
- Which pressures triggered violations?

This is "watch the test fail" - you must see what agents naturally do before writing the workflow.

### GREEN: Write Minimal Agent

Write workflow that addresses those specific rationalizations. Don't add extra content for hypothetical cases.

Run same scenarios WITH workflow. Agent should now comply.

### REFACTOR: Close Loopholes

Agent found new rationalization? Add explicit counter. Re-test until bulletproof.

### Micro-Test Wording Before Full Scenarios

Full pressure-scenario runs are the final gate, but they are slow and expensive per iteration. Verify the wording itself first with micro-tests:

1. **One fresh-context sample per call** — a raw API call, or a single-shot subagent if you don't have API access. System prompt = the realistic context the guidance will live in (the full workflow or prompt template, not the guidance in isolation); user message = a task that tempts the failure.
2. **Always include a no-guidance control.** If the control doesn't exhibit the failure, there is nothing to fix — stop, don't author the guidance.
3. **5+ reps per variant.** Single samples lie.
4. **Manually read every flagged match.** Score programmatically if you like, but template echoes and quoted counter-examples masquerade as hits; automated counts alone overstate both failure and success.
5. **Variance is a metric.** When guidance lands, reps converge on the same shape. Five different interpretations across five reps means the wording isn't binding — tighten the form before adding words.

Micro-tests verify wording; they do not replace pressure scenarios for discipline workflows.

**Testing methodology:** See [Testing agents with subagents](writing-agents/references/testing-agents-with-subagents.md) for the complete testing methodology:
- How to write pressure scenarios
- Pressure types (time, sunk cost, authority, exhaustion)
- Plugging holes systematically
- Meta-testing techniques

## Anti-Patterns

### ❌ Narrative Example
"In session 2025-10-03, we found empty projectDir caused..."
**Why bad:** Too specific, not reusable

### ❌ Multi-Language Dilution
example-js.js, example-py.py, example-go.go
**Why bad:** Mediocre quality, maintenance burden

### ❌ Code in Flowcharts
```dot
step1 [label="import fs"];
step2 [label="read file"];
```
**Why bad:** Can't copy-paste, hard to read

### ❌ Generic Labels
helper1, helper2, step3, pattern4
**Why bad:** Labels should have semantic meaning

## STOP: Before Moving to Next Agent

**After writing ANY workflow, you MUST STOP and complete the deployment process.**

**Do NOT:**
- Create multiple workflows in batch without testing each
- Move to next workflow before current one is verified
- Skip testing because "batching is more efficient"

**The deployment checklist below is MANDATORY for EACH workflow.**

Deploying untested workflows = deploying untested code. It's a violation of quality standards.

## Agent Creation Checklist (TDD Adapted)

**IMPORTANT: Create a todo for EACH checklist item below.**

**RED Phase - Write Failing Test:**
- [ ] Create pressure scenarios (3+ combined pressures for discipline workflows)
- [ ] Run scenarios WITHOUT workflow - document baseline behavior verbatim
- [ ] Identify patterns in rationalizations/failures

**GREEN Phase - Write Minimal Agent:**
- [ ] Name uses only letters, numbers, hyphens (no parentheses/special chars)
- [ ] YAML frontmatter with a useful `name` and trigger-focused `description`; follow the Copilot format in [Agent discovery](writing-agents/references/discovery.md)
- [ ] Description starts with "Use when..." and includes specific triggers/symptoms
- [ ] Description written in third person
- [ ] Keywords throughout for search (errors, symptoms, tools)
- [ ] Clear overview with core principle
- [ ] Address specific baseline failures identified in RED
- [ ] Guidance form matches the failure type (see Match the Form to the Failure)
- [ ] For behavior-shaping guidance: wording micro-tested against a no-guidance control (5+ reps, every flagged match read manually) — N/A for pure reference workflows
- [ ] Code inline OR link to separate file
- [ ] One excellent example (not multi-language)
- [ ] Run scenarios WITH workflow - verify agents now comply

**REFACTOR Phase - Close Loopholes:**
- [ ] Identify NEW rationalizations from testing
- [ ] Add explicit counters (if discipline workflow)
- [ ] Build rationalization table from all test iterations
- [ ] Create red flags list
- [ ] Re-test until bulletproof

**Quality Checks:**
- [ ] Small flowchart only if decision non-obvious
- [ ] Quick reference table
- [ ] Common mistakes section
- [ ] No narrative storytelling
- [ ] Supporting files only for tools or heavy reference

**Deployment:**
- [ ] Add the `.agent.md` and resources to the extension using its existing packaging manifest
- [ ] Run the project checks and inspect the packaged agent/resource paths
- [ ] In VS Code Copilot, select the agent and run the pressure scenarios; report checks that could not run
- [ ] Leave staging, commits, pushes, publication, and external contributions to the user unless explicitly requested

## Discovery Workflow

How future agents find your workflow:

1. **Encounters problem** ("tests are flaky")
2. **Searches workflows** (greps descriptions, browses categories)
3. **Selects or delegates to Agent** (description matches)
4. **Scans overview** (is this relevant?)
5. **Reads patterns** (quick reference table)
6. **Loads example** (only when implementing)

**Optimize for this flow** - put searchable terms early and often.
