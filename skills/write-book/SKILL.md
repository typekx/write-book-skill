---
name: write-book
description: "Design books and multi-volume series, analyse and preserve the author's style, write and edit prose unit by unit with checks of canon, character knowledge, immersion and formulaic mannerisms. Also use for series bibles, chapter cards, handing work over to another model, proper names, research, manuscript audits and project organisation. Understands one-word commands in English and Polish (write/pisz, next/dalej, audit/audyt, check/sprawdź…). A plain file export does not need the whole process."
metadata:
  version: "1.0.0"
---

# Write a book

Work on the current manuscript, within the scope the author ordered. Fit the craft to the book: the conventions, narration, length and typography of one project are not universal requirements of this skill. Write in the language of the book; these instructions are in English but apply to any language.

Aiming for maximum consistency means controlled dependencies and stated limitations, not a promise of perfection. A finished draft, a finished audit, a finished edit and a finished edition are separate states.

## Commands

The first word of a message may be a command (English or Polish, Polish diacritics optional), optionally followed by a scope: `write ch5`, `audit part II`. Inside an ordinary sentence the same word is not a command. A command never widens the scope. Details and examples: [commands](references/commands.md).

| EN / PL | Action |
|---|---|
| `help` / `pomoc` | list of commands |
| `status` / `stan` | state, next step, open decisions |
| `sources` / `źródła` | map of files and choice of current versions |
| `series` / `seria` | series architecture |
| `plan` / `plan` | plan of a book or volume, no prose |
| `cards` / `karty` | unit cards, no prose |
| `write` / `pisz` | one named unit with checks, report and state update |
| `next` / `dalej` | the next unit according to the state |
| `fix` / `popraw` | corrections according to notes |
| `edit` / `redaguj` | line editing without plot changes |
| `proof` / `korekta` | spelling, punctuation, typography |
| `style` / `styl` | style profile or analysis of mannerisms |
| `immersion` / `immersja` | immersion analysis |
| `check` / `sprawdź` | technical check |
| `audit` / `audyt` | canon and continuity audit, no corrections |
| `diff` / `porównaj` | comparison of two versions |
| `impact` / `wpływ` | consequences of changing a fact |
| `names` / `nazwy` | name catalogue and collisions |
| `decisions` / `decyzje` | the author's open decisions |
| `handoff` / `przekaż` | package for another model |
| `export` / `wydanie` | typesetting and edition files |
| `setup` / `projekt` | book repository template |

## Safeguards

These rules protect against the typical failures of long projects written with the help of models. They always apply, whatever the project profile.

1. **Never shorten the manuscript silently.** Editing, proofreading or a "final version" must not turn scenes into summaries. Whenever an existing unit changes, compare its word count and list of headings with the previous version. A drop above the project threshold (3% by default) without ordered cuts is an error to fix, not a result. Do not rewrite a whole volume in one reply; work unit by unit.
2. **Never claim completion without measuring.** "Complete", "final", "ready to publish" may be written only after counting the units and words and checking that the file contains prose, not an empty template, a variable such as `${...}` or a summary.
3. **Check every fact about the past in the canonical prose, by searching, before writing the sentence.** Conversation memory, summaries and plans are not sources. The most common mistakes: forms of address, where an object is, who brought a document, times, the day of the week, ages, what a character knows at that moment.
4. **The reader's knowledge is not the character's knowledge.** A detail from a prologue, an interlude or another point of view must not enter a character's thoughts without a scene in which they learn it.
5. **First drafts usually come out too short.** If the project has a minimum length, plan the unit at about 110% of the target and add the missing beats from the card, not padding.
6. **A removed tic comes back in disguise.** A banned construction has variants, and a replacement word becomes a new tic. After editing, count the replacements as well.
7. **An author's decision has one source.** When two versions of a ruling exist, the one the author named applies; the rest is archive. Do not settle an open plot decision yourself: stop before the dependent scene and offer 2–3 options with their consequences.
8. **Prose is clean.** No comments, work markers such as [TK] or [NF], working brackets, hidden characters or metadata. Reports and state are separate files.

## Choose the modules for the task

| Task | Instructions |
|---|---|
| Series from the start, a new volume, a changed ending | [Series design](references/series-design.md) |
| Writing a volume unit by unit, cards, acceptance, part loop | [Modular work](references/modular-work.md) |
| Recognising and preserving a voice | [Style analysis](references/style-analysis.md) |
| Checking the reader's immersion in a scene | [Immersion](references/immersion.md) |
| Enumerations, antitheses, tics, mechanical punchlines | [Editing formulaic prose](references/formulaic-prose.md) |
| Dependencies between volumes and the impact of corrections | [Series validation](references/series-validation.md) |
| Many versions, taking over a project, character state | [Sources and continuity](references/sources-and-continuity.md) |
| Proper names, renaming across a series, collisions with real entities | [Names and collisions](references/names-and-collisions.md) |
| Working in another model or application (project, workspace, another chat) | [Handoff between models](references/model-handoff.md) |
| Counters, dates, typography, comparing versions | [Technical check](references/technical-check.md) |
| One-word commands and their scope | [Commands](references/commands.md) |
| Typesetting, cover, edition | [Publishing and layout](references/publishing-and-layout.md) |

Read the modules the task needs; a small correction does not require rereading the whole library.

## Establish the task and the starting point

Identify the mode: planning a new book, writing a unit, a correction, an edit, an audit or preparing a handoff. A request for analysis does not order new prose. Correcting the current chapter does not mean moving on to the next.

Read the project instructions, the book profile, the current state and the source map. With many versions or a handoff package use [source selection](references/sources-and-continuity.md). Names such as FINAL, COMPLETE, START, a higher version number or a copy date are not enough to choose a text; also check the length and whether the file contains full prose.

If the manuscript is finished, "next" does not restart it or order another volume. Find out whether the author wants editing, expansion or a new book. A missing key part of the canon means it has to be obtained, not replaced with an invented past.

For a new project, establish only what is needed to start: the kind of book, the audience, the promise to the reader, point of view, language, content boundaries and the ordered scope. You may propose labelled assumptions where the author left freedom. The [book profile](assets/BOOK_PROFILE.md) is a template, not a mandatory form before a sample.

Record the **source hierarchy** in the profile: which prose is canon (volume, version), what supplements it (registers, style guide) and what only plans (bible, cards). The higher source wins. If a card contradicts the canon, write according to the canon and describe the discrepancy in the report.

When setting up or tidying a book workshop, read [repository organisation](references/book-repository.md). A [project template](assets/project-template/README.md) is available. Use it when the author asks for project organisation; keep the existing structure for ordinary writing or corrections.

## Planning and writing

If the author orders a series from the start, establish the architecture of all volumes before the main writing: the promise, the direction of the ending, the true history of events, arcs, invariants and reveal dependencies. Plan the nearest volume in detail and the distant ones enough to control seeds and resolutions. Do not block an ordered sample by requiring the whole plan. In an existing series, reconstruct the written state before proposing the future. Compare any plan written from conversation memory with the prose before accepting it.

Use the [series architecture](assets/project-template/07_Series_Architecture/SERIES_ARCHITECTURE.md), the [volume card](assets/project-template/07_Series_Architecture/VOLUME_CARD.md) and [seeds and reveals](assets/project-template/07_Series_Architecture/SEEDS_AND_REVEALS.md). Each volume has its own resolution and a change that justifies the next; do not reset relationships and consequences between volumes.

Before writing or substantial editing, build a [style profile](assets/project-template/01_Project_Rules/STYLE_PROFILE.md) from the author's passages. Separate the constant voice, the variants for characters and scenes, and accidental mannerisms. After changes, compare new passages with the model; do not level all scenes and characters to one rhythm.

When planning, derive the conflict and stakes from the characters' goals. Build a chain of decisions and consequences, then [unit cards](assets/UNIT_CARD.md): point of view, date with weekday, place, goal, obstacle, change, reveal, evidence, knowledge on entry and exit, scenes, length and hook. Separate a setup from its later payoff. An entry in the plan does not establish a fact in the prose.

Before continuing, read the previous unit with its report, the current unit's card and the source scenes needed for the facts you use. Reconstruct the entry state: characters' knowledge, dates, places, documents, objects, injuries, relationships and forms of address. Do not reread the whole library automatically for every small correction; choose dependencies to fit the change and state the scope of reading.

Write one unit and stop after delivering it, unless the current request or the agreed scope clearly covers more. A prologue, an interlude and an epilogue are separate units. Carry out a wider order to the end of its scope unit by unit, with separate files, checks and state updates. The module cycle, acceptance statuses and the part correction loop are described in [modular work](references/modular-work.md).

While writing and editing use [craft and control](references/craft-and-control.md). Keep the voice of the book and the consequences of earlier actions. In non-fiction separate sourced claims from interpretation; do not fictionalise events, quotations or biographies without clear labelling and the right commission.

## Editing and auditing

Judge immersion by orientation, causality, agency, access to information and emotional continuity. Do not equate it with constant action or a catalogue of sensations. Use the [style and immersion audit](assets/project-template/06_Control/STYLE_AND_IMMERSION_AUDIT.md).

Reduce needless "firstly/secondly", serial antitheses and triads, abstract punchlines and explaining the same thought several times. Judge function and accumulation, not the phrase alone. If the author set limits per chapter, enforce them with a counter and by reading. Do not apply prose norms to reports.

Apply the smallest effective correction within the ordered scope, then check that information, voice, length and the links between actions are preserved. Do not replace reflection with random gestures, verbosity with slogans, or repetition with wholesale synonym rotation. These features do not prove AI authorship; never give an "AI percentage" or promises about detectors.

The optional tools run through one command, `node scripts/wb.mjs <check|volume|diff|style|nbsp>` (Polish: sprawdz, tom, porownaj, styl, spacje). The [style scanner](scripts/style-scan.mjs) points to phrases and repeated wording; the [unit check](scripts/unit-check.mjs) checks weekdays, typography, work leftovers, project limits, retired names and drops in length against the previous version. Read the [scanner notes](references/style-scanner.md) and [technical check](references/technical-check.md) first. The tools never change the manuscript; decisions require reading.

Match the intervention to the order: proofreading, line editing, rebuilding a scene or structural analysis are different scopes. Do not change the plot during proofreading. In the author's finished text, plot corrections are proposals in the report unless the author ordered them. If the author authorised corrections, make them; do not replace an ordered edit with a list of advice.

When a fact changes, find the dependencies in later scenes and earlier volumes. A new decision by the author may change the canon; record its consequences and the scope of required updates. Do not resolve a contradiction by silently changing the past. Renaming covers all volumes, plans, registers, notes and exports ([names and collisions](references/names-and-collisions.md)).

An audit presents concrete places, the source of comparison, the effect of the error and a proposed correction. Separate confirmed errors from hypotheses and questions. At the end of a module or volume, check the whole range and its connection to earlier text. If possible, ask someone who did not write the text for an extra review (a separate agent or session); if not, state this limitation. Significant unresolved contradictions stop the writing of dependent scenes; they do not block independent work.

## Saving and handing over

Keep the existing project layout. In a new project you may use `outputs/` for texts and reports and `work/` for intermediate material. Clean prose, the report and the state are separate files. When correcting an original, create a working copy unless the author told you to edit the existing file.

After a written or substantially changed unit:

1. Save clean prose without workshop comments or placeholders.
2. Write a separate [nine-point report](assets/UNIT_REPORT.md). A small correction may have a short change note instead of a full report, unless the project requires otherwise.
3. Run the technical minimum (length, dates, typography, limits and, for a correction, a comparison with the previous version) and read the whole new unit. Do not present a tool as proof of consistency or literary quality.
4. Update the [continuation state](assets/CONTINUATION_STATE.md) with facts actually written: characters' knowledge, props, forms of address, series counters. If the text departed from the card, correct the card so that the plan describes what was written. Update seeds and the [change impact register](assets/project-template/06_Control/VALIDATION_AND_CHANGE_IMPACT.md).
5. Give the location of the text and report, the check results, the acceptance status (by default "awaiting the author's acceptance") and the limitations. Stop at the end of the ordered scope.

When the text changes in one format, note that the other editions need updating. A correct Markdown file does not confirm the layout of PDF, DOCX or EPUB. If the task includes an export, check the result with the available tools; otherwise mark the export as not done.

Determine the order of units from an explicit volume list that includes interludes and the epilogue, not from file dates or name sorting. Record the source version of every export.

When another model or application is to continue the writing, prepare a [handoff package](assets/HANDOFF_PACKAGE.md) following the [instructions](references/model-handoff.md): the state after the last unit, standing instructions, files in order of importance, ready prompts and lessons from the work so far. Treat text coming back from another environment as a draft that needs a full check.

Creating text and a local package does not authorise publishing, sending or placing the manuscript in a public repository. Such an operation needs a separate instruction from the author.
