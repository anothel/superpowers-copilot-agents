# Discover the session history

Resolve the session your human partner named using the tools and information
available in this environment. Your knowledge can suggest where to look; verify
the result against the actual history.

Use the harness's exposed session tools, configured storage, local help,
documentation, or bounded filesystem inspection. Measure files before reading
their content and follow context-safety.md. Inspect archives or indexes when the
environment points to them. A supplied usable path does not need another search.

Confirm identity using the available session id, working directory, timestamps,
and matching conversation content. Recency alone is not confirmation. Distinguish
the requested session from its children and unrelated candidates. Ask for a
missing identifying fact when the available evidence cannot distinguish them.

For each filesystem source, obtain its full absolute path from the environment,
with home-directory shorthand and variables expanded. Use that same path in the
case record and in the discovery answer you give your human partner.

Establish the record meanings needed for the requested investigation from
observed records or documentation. Distinguish human messages from injected
messages, tool results, and a parent agent's dispatch. Match tool calls to their
results. Establish usage-counter semantics before calculating totals. Do not
infer a format from another harness or turn a missing field into a zero.

Record the exact sources, relevant field meanings, supporting record locations,
associated sessions, rejected plausible candidates, and unresolved information
in the case file. Subsequent readers use that record rather than repeating
discovery. If history is missing, inaccessible, or ambiguous, state the specific
limitation and ask for the missing path, export, or identifying detail.

## VS Code GitHub Copilot

Use a transcript/export file supplied by the user, or history explicitly exposed
by the host UI or a supported tool. Never assume Claude Code, Codex, Copilot CLI,
or another runtime's session-store path or JSON schema belongs to VS Code
Copilot. Do not sweep unrelated application storage looking for a guessed file.
If only UI history is available, state that limitation and ask for an export
when filesystem evidence is needed. Preserve the original export and record
its provenance; any derived line-numbered text is a separate source.

Absent token counters, model ids, tool details, or subagent records are unknown,
not zero. Explain which requested conclusions the available export cannot support.
