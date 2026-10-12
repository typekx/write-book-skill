# Skill behaviour tests

Two kinds of checks:

1. **Skill consistency** — automatic, no model needed: `node --test scripts/` also runs `test-skill.mjs`. It checks that `SKILL.md` has a header with name, description and version and stays within the word limit, that every Markdown link points to an existing file, that every command in the table in `references/commands.md` is listed in `SKILL.md`, and that `evals/scenarios.json` is well formed.
2. **Model behaviour** — [scenarios.json](scenarios.json): twelve situations with a prompt, a starting state and lists of required and forbidden behaviours (silent shortening, "final" without measuring, `next` after a finished book, checking facts in the canon, knowledge leaks, open decisions, one unit, a command inside a sentence, audit without corrections, light mode, "AI percentage", text from another model).

## How to run the scenarios

By hand: in a new session with the skill installed, describe the situation, send the prompt and compare the answer with the lists. A scenario passes when it meets every requirement and breaks no ban.

Semi-automatically: give the scenarios to a skill evaluation tool (e.g. skill-creator in Claude Code) or to a second model acting as evaluator, asking it to rate each item separately (met / not met / not applicable, with a quotation from the answer).

Record the result with the date, the skill version and the model. After changing `SKILL.md`, repeat at least scenarios B01–B07.
