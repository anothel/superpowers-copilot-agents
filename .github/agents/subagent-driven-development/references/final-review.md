# Final Review and Finish

Part of subagent-driven-development agent. Every task in the plan is
complete.

The final whole-branch review gets a package too: run
`bash "<AGENTS_DIR>/subagent-driven-development/scripts/review-package" PLAN_FILE MERGE_BASE HEAD` (MERGE_BASE = the commit the
branch started from, e.g. `git merge-base main HEAD`) and include the
printed path in the final review dispatch, so the final reviewer reads
one file instead of re-deriving the branch diff with git commands. Dispatch
with a model chosen only if the tool supports it (prefer the most capable
available model; see [subagent-driven-development.agent.md](../../subagent-driven-development.agent.md)'s Model Selection), using
requesting-code-review agent's
[code-reviewer.md](../../requesting-code-review/code-reviewer.md). Point it at
the ledger's deferred-minor and parked lines so it can triage which must be
fixed before merge.

If the final whole-branch review returns findings, dispatch ONE fix subagent
with the complete findings list — not one fixer per finding.
Per-finding fixers each rebuild context and re-run suites; a real
session's final-review fix wave cost more than all its tasks combined.
Then run exactly one scoped re-review of the fix wave
(`bash "<AGENTS_DIR>/subagent-driven-development/scripts/review-package" PLAN_FILE FIX_BASE HEAD` over the fix range,
[re-review-prompt.md](../re-review-prompt.md)).
Adjudicate any residual findings as in the fix loop's breaker
(references/fix-loop.md): park with rulings, or rule on the load-bearing
ones and ledger what you decided. Only the four things that stop a running
plan (top of [subagent-driven-development.agent.md](../../subagent-driven-development.agent.md)) stop you here. There is no second fix wave —
residual load-bearing findings surface to your human partner when
finishing-a-development-branch presents the options.

### Finish

Before you delete anything, collect every ledger line containing `Ruling:` —
preflight rulings, parked findings, breaker adjudications, all of them — into
your final message under "Rulings I made", in the order you made them, each
with what it costs if wrong. The list is exhaustive: if the ledger holds a
ruling, the list holds it. That list is the only place the decisions you
took on your human partner's behalf reach them — they read it and rework
whatever you got wrong. A ruling that dies with the workspace was a decision
made in secret.

When the final whole-branch review is clean and all changes are committed,
remove only this plan's verified workspace path if cleanup is permitted —
git history is then the record. Keep the workspace and ledger when work is
uncommitted, so recovery does not depend on nonexistent commits. Sibling
directories belong to other plans; leave them alone.

Use finishing-a-development-branch agent.
