# Changelog

## 3.7.1 — 11 November 2026

Review of the whole skill: three tool bugs and documentation inconsistencies. No change to the skill's behaviour. Same as Polish `pisz-ksiazke` 3.7.1.

### Fixed

- `wb style` and `wb check`: a prose file starting with a lone scene break `---` was treated as frontmatter, and all prose up to the next `---` dropped out of the analysis (ticks were not counted, `proseWords` was too low). Frontmatter is now only a block with a YAML key and a closing line; an unterminated block no longer swallows the prose.
- `wb diff` (and `unit-check --compare`): two different files differing only in name case were rejected as "the same file" on case-sensitive file systems. File identity is now checked by inode.
- `wb`: an unknown option (e.g. `--foo`) gave a misleading file-count error; it now says "Unknown option".

### Changed

- `SKILL.md`: the "Style scanner" module is in the module table (it was reachable only through the technical check).
- README: the scenario count is 23 everywhere.
- `test-skill.mjs`: every file in `references/` must be named in `SKILL.md` and in the README; regression tests for the three fixes.

## 3.7.0 — 11 November 2026

Lessons from aligning four manuscript volumes to the already published first volume of a series (a cascade of modules, about 330,000 words read). The skill contains no content or data from any particular book.

### Added

- `references/series-alignment.md`: the published volume as frozen canon, the cascade (each aligned volume becomes canon for the next), `CANON_V1.md`, reading each whole volume in portions with a note and saved progress after every portion, one corrections file against a copy of the original, a log with Z/R/N/U tags, a register of the published volume's open threads carried between logs, backward correction of an already aligned volume, typical discrepancies when aligning.
- Command `align/dopasuj`.
- `references/continuity-scan.md`: an object in a scene although it was elsewhere; the "previously" page and cast list; years of service and ages in flashbacks; building layout.
- Scenario B23 (aligning to a published volume).

### Changed

- `SKILL.md`: safeguard 7 covers explaining open threads of a published volume (options for the author instead of a ready insertion); module table.
- `references/full-volume-editing.md`: state is also saved after each loaded portion of a long volume, and more often if the author says so.

## 3.6.0 — 5 November 2026

From this release the English and Polish skills share version numbers: English 3.6.0 = Polish `pisz-ksiazke` 3.6.0 (this release was briefly tagged 1.2.0). Earlier English releases 1.0.0 and 1.1.0 correspond to Polish 3.2.0 and 3.3.0.

Brings the English skill level with the Polish `pisz-ksiazke` 3.6.0. Lessons from editing and publishing a five-volume series; the skill contains no content from any particular book.

### Added

- `references/full-volume-editing.md`: editing a finished volume with themed passes over the whole text (P0–P6), the fix loop, snapshots, logs, resuming after a break, stopping rules and honest ratings.
- `references/continuity-scan.md`: category registers K1–K6, verifier, control rounds, typical contradictions found in practice.
- `references/feedback-verification.md`: outside feedback as a hypothesis, T/M/? certainty marks, legal, financial and technical detail.
- `references/author-feedback-session.md`: page-by-page notes on the PDF, notes register, bulk application, the author's own corrected version.
- `references/kdp-publishing.md`: Amazon KDP step by step (language support, series in the subtitle, ISBN and imprint, trim and paper, empty barcode zone, previewer, AI disclosure, net prices and royalties, proof).
- `scripts/patch.mjs` and `wb.mjs patch|zamien`: atomic old → new replacements with dry run, required backup, occurrence numbers and artifact detection; `wb.mjs ticks|tiki` and `density|gestosc`.
- `assets/PASS_LOG.md`, `assets/PASS_BRIEF.md`; resume section in `CONTINUATION_STATE.md`.
- Commands `pass`, `scan`, `verify`; scenarios B13–B22; tests in `test-patch.mjs`.

### Changed

- `SKILL.md`: safeguards 6 and 9–13, module table, tool list.
- `publishing-and-layout.md`: copyright page (statutory exceptions, TDM reservation, TDMRep), build process, measured hyphenation, runts, widows and orphans, spine, series rebuilds, publication package, home-print imposition.
- `formulaic-prose.md`: thinning tics in a volume and a series. `model-handoff.md`: volume description for other models. `technical-check.md`: `patch`, `ticks`, `density`.

## 1.1.0 — 12 October 2026

### Added

- Light mode (`light`/`lekki`) for short stories, short forms, standalone books and quick edits: short card, three-point report, no series registers (`references/light-mode.md`); `full`/`pełny` restores the full process.
- `evals/scenarios.json`: 12 behaviour scenarios with required and forbidden reactions, and instructions for running them.
- `scripts/test-skill.mjs`: automatic consistency check of the skill (header, `SKILL.md` word limit, links, command coverage, scenario format).
- PolyForm Noncommercial 1.0.0 licence and commercial licence terms (`COMMERCIAL.md`).

### Changed

- `SKILL.md` shortened from about 2,000 to about 1,200 words: the command table became a list; details stay in the modules.

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
