Read `../prompts/analyst-common.md` first; it gives your role, inputs,
context-safety rules, and the return format. This file adds the dimension.

Dimension: Skill timeline

Build the per-human-turn record of skill and plugin use, then look for gaps.

1. List the human prompts with line numbers and timestamps.
2. Using the skill-invocation and attribution meanings established in the case
   file, list every explicit invocation, active-skill attribution, or read of a
   file named `SKILL.md` or ending in `.agent.md`. Record the line, the skill name, and the human turn it
   happened in.
3. List every non-superpowers plugin, skill, agent type, MCP server, or
   hook used. Use only the evidenced tool, attribution, agent-dispatch, MCP,
   and hook meanings recorded in the case file; identify values associated
   with something other than `superpowers`.
4. For each human turn, compare the request text against the trigger
   descriptions of the superpowers skills installed (read
   `<agent root>/*.agent.md` frontmatter `description` lines for this extension;
   for original skill sessions use the verified source layout. Record the agent or
   skill root and historical/current provenance in the case file). Report as findings:
   - a skill invoked, with the request that preceded it (one finding per
     invocation is fine when there are few; group by skill when many);
   - a turn whose request matches a skill's trigger description with no
     invocation in that turn (state which description matched and quote
     the request);
   - a skill invoked one or more turns after the matching request (late);
   - each non-superpowers plugin/skill/tool used, with where.

Do not say whether a missed or late trigger was wrong. Report the match
and the absence; the reader decides.

In Copilot, selecting a custom agent, reading its definition, and delegating to
a subagent are distinct events. Record only the evidence actually visible in
the export. A matching trigger without a recorded invocation is an observation,
not proof of a defect; agent selection is not automatic skill discovery.
