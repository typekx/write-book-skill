# Technical check of a unit

Shortest form: `node scripts/wb.mjs check file.md`, `volume files…`, `diff old.md new.md`, `nbsp file.md output.md` (Polish aliases: sprawdz, tom, porownaj, spacje). Project rules are then found automatically. The full form follows.

The optional script `scripts/unit-check.mjs` needs Node.js 20 or newer and no libraries. It reads unit files and prints JSON. It never changes an input file. It complements the [style scanner](style-scanner.md): the scanner looks for repetition and candidate mannerisms, the check enforces project rules.

```sh
node scripts/unit-check.mjs /path/chapter.md
node scripts/unit-check.mjs -r /project/01_Project_Rules/check_rules.json /path/chapter.md
node scripts/unit-check.mjs -c /path/chapter_v1.md /path/chapter_v2.md
node scripts/unit-check.mjs -n /path/chapter_nbsp.md /path/chapter.md
node scripts/unit-check.mjs -r check_rules.json volume/00_prologue.md volume/01_chapter_1.md volume/02_chapter_2.md
node --test scripts/
```

Options: `-r` (`--rules`), `-c` (`--compare`), `-n` (`--nbsp`). Exit code 1 means a usage error or check errors, so the script can be used in automation.

## Always checked

- **Day of the week** in every date written like "Tuesday, 3 March 2026", "Tuesday, March 3rd, 2026" or the Polish "wtorek, 3 marca 2026" (also outside the date line), and dates that do not exist. Leap years are handled.
- **Work leftovers:** template variables (`${...}`, `{{...}}`), markers `[TK]`, `[TODO]`, `[TBD]`, `[NF]`, `[CHECK]`, HTML comments, "TODO" notes.
- **Invisible and replacement characters:** zero-width space, soft hyphen, BOM inside the text, direction marks, U+FFFD.
- **No prose:** a file with headings only is an error.
- **Word count:** runs of characters between whitespace, a non-breaking space counts as whitespace; "words" includes headings and dates, "proseWords" leaves them out. The project's counter may differ; say in the report which one was used.

## Checked according to project rules

Write the rules in JSON; a model is in [check_rules.example.json](../assets/project-template/01_Project_Rules/check_rules.example.json). The values in the model are examples; every project sets its own.

| Key | Meaning |
|---|---|
| `typography` | `"en"`: straight double and single quotes, three dots, hyphens used as dashes, low opening quotes. `"pl"`: straight quotes, English opening quote, em dash, three dots, spaced hyphen. Without the key, obvious problems (three dots, spaced hyphen) are only warnings. |
| `digitsOnlyInItalics` | Digits allowed only in italics (date lines, quoted documents). Headings are skipped. |
| `noSquareBrackets` | Any square bracket in prose is an error. |
| `minWords`, `maxWords` | Limits for all units. |
| `wordsByUnitType` | Limits by unit type from the heading, e.g. `"Interlude": {"min": 1200, "max": 1500}`. The type is the first word of the last heading. |
| `maxWordDropPct` | Threshold for a drop in length with `--compare` (3 by default). |
| `limits` | A list of counters with `max`. Each has `phrase` (literal, case-insensitive; a trailing `*` allows endings: `"exact*"`), `pattern` (a regular expression with flags `giu`; write word boundaries as `(?<![\\p{L}])`, not `\\b`) or `builtin`. Optional `narrationOnly: true` skips dialogue lines. |
| `bannedNames` | Retired or forbidden names; found with word endings. |
| `maxVolume` (inside `limits`) | Limit for the whole range when checking several files, e.g. a graphic word at most once per volume. |
| `minVolumeWords` | Minimum words for the whole range (e.g. a volume no shorter than the previous one). |

Built-in patterns (English and Polish in one pattern):

| Name | What it counts | False alarms |
|---|---|---|
| `antithesis` | "not X, but Y" in one sentence; Polish "nie X, tylko/lecz Y" | ordinary negation followed by "but" |
| `it-was-not` | pairs "It wasn't X. It was Y." and disguises such as "This wasn't luck. This was…"; Polish "To nie było X. To było Y." | "It wasn't raining. It was late." |
| `colon-reveal` | a colon after a lowercase letter in narration, dialogue lines excluded | a colon before a list, a quoted document |
| `triple-anaphora` | "no…, no…, no…", "without…, without…, without…", "never…, never…, never…" and Polish equivalents | quotations and deliberate refrains |

A counter hit is a candidate. Leave a false alarm and describe it in the report; rewrite a real hit, then run the check again to catch a replacement that has become a new tic.

## Checking a range

Giving several files checks each unit separately and the range as a whole: total words, counter totals with `maxVolume` limits, the `minVolumeWords` minimum, files with identical content and repeated unit headings (e.g. two copies of the same chapter, or a working file of the whole added next to its units). Give the units in the order of the volume list. Do not include a file of the whole together with its units.

## Comparing versions

`--compare previous.md` sets word counts, headings and scene separators side by side. A drop in length above the threshold and a heading that existed in the previous version but is now missing are errors. Use it after every edit, proofread, merge and when accepting a "final version" from another environment. Typical case: a file described as "complete, proofread" contains summaries of scenes instead of prose.

## Non-breaking spaces

`--nbsp output.md` writes a copy with a non-breaking space after single-letter words (a, i, o, u, w, z), as required in Polish and some other languages. The output file must not exist; the input is never overwritten. For English this is not needed. Layout typography is better left to the typesetting tool if the project has one.

## Limitations

The script does not know the canon and does not check characters' knowledge, point of view, forms of address or chronology between scenes. It does not judge style and does not detect "AI". Unix `wc -w` treats a non-breaking space as part of a word and undercounts; for comparisons with the project counter use this script or the project's counter. Dates in other formats than those listed above are not checked. A result without errors only means the checked rules are met.
