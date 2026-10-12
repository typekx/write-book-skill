---
name: write-book
description: "Design books and multi-volume series, analyse and preserve the author's style, write and edit prose unit by unit with checks of canon, character knowledge, immersion and formulaic mannerisms. Also use for series bibles, chapter cards, handing work over to another model, proper names, research, manuscript audits and project organisation. Understands one-word commands in English and Polish (write/pisz, next/dalej, audit/audyt, check/sprawdź…). Has a light mode for short stories and short forms."
metadata:
  version: "1.1.0"
---

# Write a book

Work on the current manuscript, within the scope the author ordered. Conventions, narration, length and typography belong to the project, not to this skill. Write in the language of the book. A finished draft, audit, edit and edition are separate states; consistency means controlled dependencies and stated limits, not a promise of perfection.

## Commands

The first word of a message may be a command (English or Polish, Polish diacritics optional) with an optional scope: `write ch5`, `audit part II`. Inside a sentence the word is not a command; a command never widens the scope. List: `help/pomoc`, `status/stan`, `sources/źródła`, `series/seria`, `plan`, `cards/karty`, `write/pisz`, `next/dalej`, `fix/popraw`, `edit/redaguj`, `proof/korekta`, `style/styl`, `immersion/immersja`, `check/sprawdź`, `audit/audyt`, `diff/porównaj`, `impact/wpływ`, `names/nazwy`, `decisions/decyzje`, `handoff/przekaż`, `export/wydanie`, `setup/projekt`, `light/lekki`, `full/pełny`. Meaning and scope of each: [commands](references/commands.md).

## Safeguards

They always apply, in light mode too.

1. **Never shorten the manuscript silently.** When an existing unit changes, compare word count and headings with the previous version; a drop above the threshold (3% by default) without ordered cuts is an error. Do not rewrite a whole volume in one reply.
2. **Never claim completion without measuring.** "Final" only after counting units and words and checking that the file holds prose, not a template or a summary.
3. **Check facts about the past in the canonical prose, by searching, before writing the sentence.** Conversation memory, summaries and plans are not sources.
4. **The reader's knowledge is not the character's knowledge** without a scene in which the character learns it.
5. **Plan length with a margin** (about 110% of the target); fill gaps with beats, not padding.
6. **A removed tic returns in disguise;** after editing, count the replacements too.
7. **An author's decision has one source.** Do not settle an open plot decision yourself: stop before the dependent scene and offer 2–3 options with consequences.
8. **Prose is clean:** no comments, markers, hidden characters or metadata; reports and state are separate files.

## Working mode: light or full

Choose the mode for the project and record it in the profile.

- **Light** (`light`): short story, short form, standalone book without a series, sample, quick edit. No series architecture, registers or volume cards; a short unit card, a three-point report, state optional. Details: [light mode](references/light-mode.md).
- **Full** (`full`): a novel written in modules, a series, handing work between models, many versions. The whole process below.

By default: light for texts up to about 20,000 words and single editing jobs, full for series and projects with an existing continuation state. Switch to full when further volumes, a handoff or serious contradictions appear.

## Modules

| Task | Instructions |
|---|---|
| Series, a new volume, a changed ending | [Series design](references/series-design.md) |
| Modular writing, cards, acceptance, part loop | [Modular work](references/modular-work.md) |
| The author's voice | [Style analysis](references/style-analysis.md) |
| The reader's immersion | [Immersion](references/immersion.md) |
| Enumerations, antitheses, tics, punchlines | [Editing formulaic prose](references/formulaic-prose.md) |
| Cross-volume dependencies, impact of corrections | [Series validation](references/series-validation.md) |
| Many versions, taking over a project, character state | [Sources and continuity](references/sources-and-continuity.md) |
| Scene, point of view, content boundaries, unit check | [Craft and control](references/craft-and-control.md) |
| Proper names and collisions | [Names and collisions](references/names-and-collisions.md) |
| Work in another model or application | [Handoff between models](references/model-handoff.md) |
| Counters, dates, typography, comparing versions | [Technical check](references/technical-check.md) |
| Book folder organisation | [Book repository](references/book-repository.md) |
| Typesetting, cover, edition | [Publishing and layout](references/publishing-and-layout.md) |

Read only the modules the task needs.

## Start

Identify the task: planning, writing a unit, a correction, an edit, an audit, a handoff. Analysis does not order prose; correcting the current chapter does not mean moving to the next. If the manuscript is finished, `next` does not restart it or order another volume; ask for the goal.

Read the project instructions, the [profile](assets/BOOK_PROFILE.md), the state and the source map. With many versions, choose the text according to [sources and continuity](references/sources-and-continuity.md); a FINAL name or a date is not enough, check length and content. Record the source hierarchy: the canon (prose) beats registers, and registers beat the plan; a card that contradicts the canon goes into the report. Never replace missing canon with an invented past.

New project: establish only the kind of book, audience, promise, point of view, language, content boundaries and scope; propose the rest as labelled assumptions.

## Writing

Before writing or substantial editing, rely on a [style profile](assets/project-template/01_Project_Rules/STYLE_PROFILE.md) built from the author's passages; do not level all scenes to one rhythm. Derive conflict and stakes from the characters' goals. In full mode write [unit cards](assets/UNIT_CARD.md); for a series, design the whole first ([series design](references/series-design.md)), but do not block an ordered sample with it.

Before continuing, read the previous unit, its report, the card and the source scenes for the facts you use; reconstruct knowledge, dates, places, objects, injuries, relationships and forms of address. Write one unit and stop unless more was ordered; a prologue, an interlude and an epilogue are separate units. In non-fiction separate sources from interpretation and do not fictionalise without labelling.

## Editing and auditing

Judge the function and accumulation of a device, not the phrase alone; enforce the author's limits with a counter and by reading. Apply the smallest effective correction, then check that information, voice and length are preserved. Proofreading does not change the plot; plot corrections in the author's text are proposals unless ordered. These features do not prove AI authorship: no "AI percentage".

When a fact changes, find the dependencies in later scenes and earlier volumes; do not silently change the past. An audit gives the place, the source of comparison, the effect and the correction, separating errors from hypotheses. If you can, ask someone who did not write the text for an extra review; if not, record this limitation. An unresolved contradiction blocks only dependent scenes.

Tools (Node.js 20+, read-only): `node scripts/wb.mjs check|volume|diff|style|nbsp` ([technical check](references/technical-check.md)). A tool's result does not replace reading.

## After every unit

1. Clean prose in its own file.
2. [Report](assets/UNIT_REPORT.md): nine points in full mode, three in light mode.
3. Technical check and reading the whole; for a correction, comparison with the previous version.
4. Update the [state](assets/CONTINUATION_STATE.md) with facts actually written; correct the card so it describes the written text.
5. File locations, check results, status "awaiting the author's acceptance", limitations. Stop at the end of the scope.

Assemble units according to the volume list, not file names. A change in one format makes the other editions out of date. When handing work to another model, prepare a [package](assets/HANDOFF_PACKAGE.md) following the [instructions](references/model-handoff.md), and check returning text as your own draft. Creating text does not authorise publishing or sending it.
