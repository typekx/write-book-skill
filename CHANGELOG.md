# Changelog

## 1.0.0 — 12 October 2026

First English release, equivalent to the Polish skill `pisz-ksiazke` 3.2.0.

### Included

- `SKILL.md` with one-word commands in English and Polish, eight safeguards, module routing and the full writing and editing workflow.
- References: commands, sources and continuity, craft and control, book repository, series design, modular work, style analysis, immersion, formulaic prose, series validation, handoff between models, names and collisions, technical check, publishing and layout, style scanner.
- Templates: book profile, unit card, unit report, continuation state, handoff package, and a seven-area project template (rules, characters, world and notes, manuscript, exports, control, series architecture) including content boundaries and check rules.
- Tools: `wb.mjs` (commands `check`, `volume`, `diff`, `style`, `nbsp`, `help` with Polish aliases), `unit-check.mjs` and `style-scan.mjs`, with tests.

### Differences from the Polish version

- Instructions, templates, file names, JSON keys and tool messages are in English.
- The checker understands English and Polish dates (both day–month and month–day order) and has two typography profiles, `"en"` and `"pl"`.
- Built-in patterns and the style scanner cover English and Polish phrasing.
