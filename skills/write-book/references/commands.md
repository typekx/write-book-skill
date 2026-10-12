# Commands

One-word commands speed up common requests. The author may write in English or Polish, with or without Polish diacritics ("check" = "sprawdź" = "sprawdz"). A full sentence still works; a command is a shortcut, not the only form.

## Recognising a command

- A command is the first word of a message from the table, alone or with an argument: `write`, `write ch5`, `audit part II`, `$write-book next`.
- The same word inside an ordinary sentence is not a command ("I have a plan for the weekend").
- The argument gives the scope: a unit (`ch5`, `chapter 5`, `interlude II`, `epilogue`), a part, a volume or a file. Without an argument, the scope comes from the continuation state.
- A command never widens the scope: `write` is one unit, `edit` does not change the plot, `audit` does not correct the text without consent.
- If a command needs data that is missing (e.g. `diff` without a second version), ask briefly or say what must be provided.

## Table

| EN | PL | Action | Stops after |
|---|---|---|---|
| `help` | `pomoc` | list of commands with a one-line description | — |
| `status` | `stan` | current state: version, last unit, next step, open decisions | no file changes |
| `sources` | `źródła` | map of files, choice of versions, withdrawn copies ([sources](sources-and-continuity.md)) | no prose |
| `series` | `seria` | series architecture, volume cards, seeds ([series](series-design.md)) | no prose |
| `plan` | `plan` | plan of a book or volume: conflict, structure, unit list | no prose |
| `cards` | `karty` | unit cards for the named range ([card](../assets/UNIT_CARD.md)) | no prose |
| `write` | `pisz` | write the named unit: text, check, report, state ([modules](modular-work.md)) | one unit |
| `next` | `dalej` | like `write`, for the next unit in the state; after a finished book asks for the goal | one unit |
| `fix` | `popraw` | corrections to the named unit according to the author's notes or a report | scope of the notes |
| `edit` | `redaguj` | line editing and mannerisms, no plot changes; length comparison | the named range |
| `proof` | `korekta` | spelling, punctuation and typography | the named range |
| `style` | `styl` | style profile or analysis of mannerisms and tics ([style](style-analysis.md)) | report |
| `immersion` | `immersja` | immersion analysis ([immersion](immersion.md)) | report |
| `check` | `sprawdź` | technical check with the tool and by reading ([check](technical-check.md)) | report |
| `audit` | `audyt` | canon and continuity audit of the range ([validation](series-validation.md)) | report, no corrections |
| `diff` | `porównaj` | comparison of two versions: length, headings, changed facts | report |
| `impact` | `wpływ` | consequences of changing a fact across scenes and volumes | report and list of changes |
| `names` | `nazwy` | name catalogue, collision test, renaming ([names](names-and-collisions.md)) | report; replacement after consent |
| `decisions` | `decyzje` | list of open decisions with options and recommendations | no text changes |
| `handoff` | `przekaż` | handoff package for another model ([handoff](model-handoff.md)) | package |
| `export` | `wydanie` | typesetting and edition files ([publishing](publishing-and-layout.md)) | files and report |
| `setup` | `projekt` | book repository template ([repository](book-repository.md)) | folder structure |

## Examples

```text
status
next
write ch5
pisz rozdział 5
cards part I
audit part II
check chapter 12
diff v15 v16
edit ch3
names Green Mill
handoff volume IV
```

## Terminal tools

The same words work in the script `scripts/wb.mjs` (Node.js 20+):

```sh
node scripts/wb.mjs check chapter.md
node scripts/wb.mjs volume volume/*.md
node scripts/wb.mjs diff old.md new.md
node scripts/wb.mjs style chapter.md
node scripts/wb.mjs nbsp chapter.md output.md
node scripts/wb.mjs help
```

Polish equivalents: `sprawdz`, `tom`, `porownaj`, `styl`, `spacje`, `pomoc`. The rules file is given with `-r`; without it, the script looks for `check_rules.json` in the file's folder and up to four levels above (also in `01_Project_Rules/`). The report always says which rules were used. With `volume`, pass the units in the order of the volume list; shell globs sort by name.
