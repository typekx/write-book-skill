# Write a Book — a complete workshop for books and series

An agent skill for planning, writing, continuing, editing and checking books, from a single novel to a multi-volume series. It turns an AI assistant into a disciplined writing partner: it works one unit at a time, checks every fact about the past against the manuscript, keeps track of who knows what, protects the author's voice, and never quietly shortens or "finalises" a text without measuring it.

The skill is general. It contains no content from any particular book; every rule, template and tool is meant for any genre and any language. The instructions are in English, the commands work in English and Polish, and the tools understand English and Polish dates and typography.

## Contents

- [What it does](#what-it-does)
- [Who it is for](#who-it-is-for)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Commands](#commands)
- [Safeguards](#safeguards)
- [Typical workflows](#typical-workflows)
- [Modules](#modules)
- [Templates](#templates)
- [Tools](#tools)
- [Repository layout](#repository-layout)
- [Limitations](#limitations)
- [Licence and history](#licence-and-history)

## What it does

| Area | Result |
|---|---|
| Series from scratch | Architecture of all volumes, arcs, the ending, local resolutions, seeds and dependencies, before volume one is written. |
| Author's style | A profile based on the author's passages, voice variants for narrator and characters, drift control after editing. |
| Modular writing | Unit cards, a fixed cycle per chapter (input package → scene plan → text → checks → report → author's acceptance), a correction loop after every part, length planned with a margin. |
| Continuity | Characters' and the reader's knowledge, chronology, documents and props, relationships, forms of address, series counters, and the impact of changes across volumes. |
| Immersion | Analysis of orientation, agency, causality, tension, subtext and consequences. |
| Formulaic prose | Reducing redundant thoughts, enumerations, mechanical antitheses, artificial punchlines and replacement tics while keeping deliberate devices. |
| Handoff | A package for continuing the work in another model or application: standing instructions, files in order of importance, ready prompts, and how to check text that comes back. |
| Names | A name catalogue, collision tests against real companies and places, renaming across a whole series. |
| Publishing | Assembly order, export checks, cover and edition data as a checklist. |
| Tools | A technical checker (weekdays, typography, work leftovers, project limits, retired names, silent shortening) and a style scanner, both read-only. |

## Who it is for

- Authors writing a novel or a series with an AI assistant and wanting the assistant to follow rules instead of improvising.
- Authors moving work between models or applications who need the next model to pick up exactly where the previous one stopped.
- Editors auditing a long manuscript for continuity, knowledge leaks and formulaic prose.
- Non-fiction authors who need claims, sources and interpretation kept apart.

## Installation

The installable skill is the folder `skills/write-book`, not the repository root.

**Claude Code.** Copy the folder to your personal skills directory or to a project:

```sh
# personal, available in every project
cp -r skills/write-book ~/.claude/skills/

# or only for one book project
cp -r skills/write-book /path/to/your-book/.claude/skills/
```

The skill is picked up automatically when a task matches its description; you can also call it explicitly with `/write-book` or by mentioning it.

**Codex.** Copy the folder to `$CODEX_HOME/skills` (by default `~/.codex/skills`) and call it as `$write-book`. The `agents/openai.yaml` file provides the display name and default prompt.

**Other environments.** Where skills are not supported, give the model `SKILL.md` and the reference files it links to as working instructions. The name of the skill alone does not transfer these files to another application.

The instructions and templates need nothing else. The optional tools need Node.js 20 or newer and no libraries.

## Quick start

```text
write-book setup                 → create a project folder from the template
write-book series                → design the architecture of a series (no prose)
write-book plan                  → plan the first volume (no prose)
write-book cards part I          → unit cards for part I (no prose)
write-book write ch1             → write chapter 1, check it, report, update the state
write-book next                  → the next unit according to the state
write-book audit part I          → continuity audit of part I, no corrections
write-book handoff volume II     → package for continuing in another model
```

For an existing manuscript start with `sources` (which file is current), then `status`, then the work you need.

## Commands

The first word of a message may be a command, in English or Polish (Polish diacritics optional), optionally followed by a scope. Inside an ordinary sentence the word is not a command, and a command never widens the scope. Full sentences keep working.

| EN | PL | Action |
|---|---|---|
| `help` | `pomoc` | list of commands |
| `status` | `stan` | current state, next step, open decisions |
| `sources` | `źródła` | map of files and choice of current versions |
| `series` | `seria` | series architecture |
| `plan` | `plan` | plan of a book or volume, no prose |
| `cards` | `karty` | unit cards, no prose |
| `write` | `pisz` | one named unit with checks, report and state update |
| `next` | `dalej` | the next unit according to the state |
| `fix` | `popraw` | corrections according to notes |
| `edit` | `redaguj` | line editing without plot changes |
| `proof` | `korekta` | spelling, punctuation, typography |
| `style` | `styl` | style profile or analysis of mannerisms |
| `immersion` | `immersja` | immersion analysis |
| `check` | `sprawdź` | technical check |
| `audit` | `audyt` | canon and continuity audit, no corrections |
| `diff` | `porównaj` | comparison of two versions |
| `impact` | `wpływ` | consequences of changing a fact |
| `names` | `nazwy` | name catalogue and collisions |
| `decisions` | `decyzje` | the author's open decisions |
| `handoff` | `przekaż` | package for another model |
| `export` | `wydanie` | typesetting and edition files |
| `setup` | `projekt` | book repository template |

Details: [commands](skills/write-book/references/commands.md).

## Safeguards

Eight rules apply to every project, whatever its profile:

1. **Never shorten the manuscript silently.** Every change to an existing unit is compared with the previous version by word count and headings; a drop above the threshold (3% by default) without ordered cuts is an error.
2. **Never claim completion without measuring.** "Final" or "complete" only after counting units and words and confirming the file holds prose, not a template variable or a summary.
3. **Check facts about the past in the canonical prose, by searching, before writing the sentence.** Conversation memory, summaries and plans are not sources.
4. **The reader's knowledge is not the character's knowledge.** Details from a prologue, an interlude or another point of view need a scene before a character can use them.
5. **First drafts usually come out too short.** With a minimum length, plan at about 110% and add beats from the card, not padding.
6. **A removed tic comes back in disguise.** Count replacements after editing as well.
7. **An author's decision has one source.** Open plot decisions are not settled by the assistant; it stops before the dependent scene and offers options.
8. **Prose is clean.** No comments, work markers, hidden characters or metadata; reports and state are separate files.

## Typical workflows

**New series:** the author's decisions → architecture of the whole series → style profile and check rules → volume cards and seeds → unit cards for the nearest volume → unit with checks and report → author's acceptance → part correction loop → volume audit, state after the volume and update of future dependencies.

**Existing manuscript:** choose the current manuscript → reconstruct the facts actually written → style profile → work within the ordered scope → change impact check. A request for analysis is never treated as permission to write new scenes.

**Handing over to another model:** `handoff` builds a package with standing instructions to paste into the other workspace, files in order of importance, ready prompts (review without prose, cards, unit, self-check without scripts, end of module) and lessons from the work so far. Text that comes back is treated as a draft and fully checked.

**After every unit:** clean prose in its own file, a nine-point report, the technical minimum, an updated continuation state (knowledge, props, forms of address, counters), the card corrected to match the text, and a stop at the end of the ordered scope.

## Modules

`SKILL.md` routes each task to the modules it needs:

| Module | Use it for |
|---|---|
| [Series design](skills/write-book/references/series-design.md) | Series architecture, volume cards, identifiers, decision register, state after a volume |
| [Modular work](skills/write-book/references/modular-work.md) | The module cycle, acceptance statuses, length, part correction loop, tracker |
| [Style analysis](skills/write-book/references/style-analysis.md) | Building a style profile and preserving the voice across volumes and models |
| [Immersion](skills/write-book/references/immersion.md) | Two-pass reading and the order of corrections |
| [Editing formulaic prose](skills/write-book/references/formulaic-prose.md) | A catalogue of 21 patterns, disguises, replacement tics, project limits |
| [Series validation](skills/write-book/references/series-validation.md) | Five levels of checks, classes of continuity errors, independent review, change impact |
| [Sources and continuity](skills/write-book/references/sources-and-continuity.md) | Choosing the current text, version traps, character and object state |
| [Craft and control](skills/write-book/references/craft-and-control.md) | Scene and voice, point of view, hooks, content boundaries, unit checklist |
| [Names and collisions](skills/write-book/references/names-and-collisions.md) | Name catalogue, collision test, renaming across a series |
| [Handoff between models](skills/write-book/references/model-handoff.md) | Package contents, standing instructions, ready prompts, taking text back |
| [Technical check](skills/write-book/references/technical-check.md) | The checker's rules, built-in patterns, volume mode, comparisons |
| [Style scanner](skills/write-book/references/style-scanner.md) | What the scanner measures and how to read it |
| [Book repository](skills/write-book/references/book-repository.md) | Folder roles, cards, research, versioning, optional automated export |
| [Publishing and layout](skills/write-book/references/publishing-and-layout.md) | Assembly, export checks, cover, edition data |
| [Commands](skills/write-book/references/commands.md) | One-word commands and their scope |

## Templates

Top-level templates in `assets/`:

- [Book profile](skills/write-book/assets/BOOK_PROFILE.md) — project facts, source hierarchy, execution rules.
- [Unit card](skills/write-book/assets/UNIT_CARD.md) — the plan of one chapter: POV, date, goal, obstacle, change, knowledge in and out, scenes, hook.
- [Unit report](skills/write-book/assets/UNIT_REPORT.md) — the nine-point report delivered with every unit.
- [Continuation state](skills/write-book/assets/CONTINUATION_STATE.md) — what the next writer must know: knowledge table, props, forms of address, counters, lessons.
- [Handoff package](skills/write-book/assets/HANDOFF_PACKAGE.md) — instructions for another model or application.

The [project template](skills/write-book/assets/project-template/README.md) is a folder to copy into a separate book project. It has seven areas:

| Folder | Contents |
|---|---|
| `01_Project_Rules/` | source map, length and structure, formatting, style profile, content boundaries, check rules |
| `02_Characters/` | character index, card template, relationships and forms of address |
| `03_World_and_Notes/` | timeline, locations, documents and props, research log, name catalogue |
| `04_Manuscript/` | volumes, units and the explicit order list |
| `05_Exports/` | export register linking each file to its sources |
| `06_Control/` | state, decision register, audits, change impact |
| `07_Series_Architecture/` | series architecture, volume cards, seeds and reveals |

Character cards keep what was written apart from what is planned. A plan never counts as a written fact.

## Tools

Optional, read-only, Node.js 20+, no dependencies. From the `skills/write-book` folder:

```sh
node scripts/wb.mjs check chapter.md          # technical check of one unit
node scripts/wb.mjs volume volume/*.md        # all units + totals and volume limits
node scripts/wb.mjs diff old.md new.md        # silent shortening, missing headings
node scripts/wb.mjs style chapter.md          # mannerisms and repeated phrases
node scripts/wb.mjs nbsp chapter.md out.md    # copy with non-breaking spaces (Polish typography)
node scripts/wb.mjs help
node --test scripts/                          # run the test suite
```

Polish command names work too (`sprawdz`, `tom`, `porownaj`, `styl`, `spacje`, `pomoc`). Output is JSON with line numbers; the exit code is 1 when errors are found, so the tools fit into automation. Input files are never modified.

**What the checker finds:** wrong weekdays in dates (English "Tuesday, 3 March 2026" / "Tuesday, March 3rd, 2026" and Polish formats, leap years included), non-existent dates, work leftovers (`[TK]`, `[TODO]`, `${…}`, HTML comments), invisible characters, typography by profile (`"en"` or `"pl"`), digits outside italics, square brackets, phrase limits per unit and per volume, retired names, minimum and maximum length by unit type, duplicate files and headings in a volume, and drops in length compared with an earlier version.

Project rules live in a JSON file, found automatically as `check_rules.json` in the project:

```json
{
  "typography": "en",
  "wordsByUnitType": { "Chapter": { "min": 2500 }, "Interlude": { "min": 1000, "max": 1500 } },
  "maxWordDropPct": 3,
  "limits": [
    { "phrase": "somehow*", "max": 2 },
    { "builtin": "it-was-not", "max": 0 },
    { "builtin": "antithesis", "max": 1 },
    { "phrase": "blood", "maxVolume": 3 }
  ],
  "bannedNames": ["OldCompanyName"]
}
```

Built-in patterns: `antithesis` ("not X, but Y"), `it-was-not` ("It wasn't X. It was Y." and its disguises), `colon-reveal` ("He knew one thing: …"), `triple-anaphora` ("no…, no…, no…"). Each also covers the Polish equivalents. Every hit is a candidate to read, not an automatic error in the literary sense. See [technical check](skills/write-book/references/technical-check.md).

## Repository layout

```text
skills/write-book/
├── SKILL.md
├── agents/openai.yaml
├── references/
│   ├── commands.md
│   ├── sources-and-continuity.md
│   ├── craft-and-control.md
│   ├── book-repository.md
│   ├── series-design.md
│   ├── modular-work.md
│   ├── style-analysis.md
│   ├── immersion.md
│   ├── formulaic-prose.md
│   ├── series-validation.md
│   ├── model-handoff.md
│   ├── names-and-collisions.md
│   ├── technical-check.md
│   ├── publishing-and-layout.md
│   └── style-scanner.md
├── scripts/
│   ├── wb.mjs                  # one command for the tools
│   ├── unit-check.mjs
│   ├── style-scan.mjs
│   ├── test-wb.mjs
│   ├── test-unit-check.mjs
│   └── test-style-scan.mjs
└── assets/
    ├── BOOK_PROFILE.md
    ├── UNIT_CARD.md
    ├── UNIT_REPORT.md
    ├── CONTINUATION_STATE.md
    ├── HANDOFF_PACKAGE.md
    └── project-template/       # optional workshop for a new book
```

## Limitations

- The skill does not guarantee perfect continuity or literary quality. Checks report what they covered and what they did not.
- The tools do not know the canon. They do not check characters' knowledge, point of view or chronology between scenes; that needs reading.
- The tools do not detect "AI writing" and the skill never promises results against detectors. Formulaic features also occur in human writing.
- Style, length and narration parameters belong to each project; the skill does not impose one author's rules on every book.
- Creating text or a local package does not authorise publishing, sending or uploading a manuscript; that needs a separate instruction from the author.
- No runnable export workflow is included; automated exports are described as an optional extension.

## Licence and history

No licence is declared yet; the choice belongs to the repository owner. Including this package in a repository grants no licence to any author's books. Changes are listed in [CHANGELOG.md](CHANGELOG.md). A Polish-language version of the skill (`pisz-ksiazke`) is maintained separately.
