# Auxiliary style scanner

The optional script needs Node.js 20 or newer and no extra libraries. The literary instructions and templates also work without Node.js. The tool reads the given UTF-8 files and prints JSON; it never corrects the manuscript and makes no network connections.

Shortest form: `node scripts/wb.mjs style chapter.md` (or `styl`). Full form, from the skill folder:

```sh
node scripts/style-scan.mjs /path/chapter.md
node scripts/style-scan.mjs /path/chapter_1.md /path/chapter_2.md
node --test scripts/test-style-scan.mjs
```

Project-specific rules (tic limits, typography, weekdays, retired names, comparison with the previous version) are checked by a separate script described in [technical check](technical-check.md).

You can save the report to a file in the control folder with any available tool. Do not redirect the output into the input file. Do not pass a whole volume together with its separate units; that artificially multiplies repetitions. The same physical file given twice is rejected.

## What it actually measures

- Word count: tokens of Unicode letters and digits, possibly with an apostrophe or hyphen inside. This is not the project's publishing counter.
- Paragraphs: non-empty blocks separated by an empty or skipped line; the median number of tokens is given.
- Explicit phrases: six categories (enumeration, explaining, antithesis, foreshadowing, qualifier, gesture) in English and Polish, with the line and a short context; variants are found only where the rule lists them.
- Repeated phrases: literal five-word windows within a paragraph, across the given corpus, at least three occurrences. Case is ignored, Unicode is normalised. Overlapping windows are counted separately.

The initial YAML block, `#` headings, tables starting with `|`, separators and fenced code blocks are skipped. Dates, dialogue, quotations and lists stay in the analysis. This is not a full Markdown parser. Text with footnotes, front matter or a table of contents may distort the result; choose the right input range.

The report shows at most 40 phrases with six locations each, but counts all occurrences and the number of phrases meeting the threshold. Phrases split by a line break may escape the categories; five-word phrases cross an ordinary line break but not an empty paragraph.

## How to use the result

Compare similar ranges of text and similar types of scene. Open the places shown, determine the function of the device and check accumulation. Read separately for semantic repetition of thoughts: a paraphrase need not repeat a single five-word sequence.

No hits does not confirm good style. Many hits may come from deliberate rhetoric, a quotation or a motif. The tool does not measure immersion, does not judge authorship and does not detect "AI". Do not run it on a bible or plan as a substitute for reading the prose.
