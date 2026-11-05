# Pass brief (instructions for an agent)

Copy to `pass/BRIEF.md` and fill in the bracketed fields. The agent receives this brief and the theme of the pass.

**Volume file (the only one, edited):** [path]. **Pass folder:** `pass/<id>/`.

## Core rule

The text must NOT be split into parts or line ranges. You read the WHOLE book, from the first line to the last, and analyse it only for YOUR THEME: [theme]. Passes run one after another, so you see the text corrected by earlier passes and do not undo their fixes without a reason.

## Procedure

1. Read the whole volume in order (300–700 lines at a time: a reading technique). Collect occurrences of the theme and fix as you read.
2. For each defect:
   1. Propose a fix.
   2. Apply it: `node scripts/wb.mjs patch <file> <pairs.json> --write --backup <snapshot>` (the old fragment exactly once).
   3. Read the changed paragraph with its neighbours: rhythm, pronouns, order of information, new repetitions, whether a line still answers the previous one, dialogue layout after merges.
   4. If it got worse, fix it again.

   Only then move to the next defect.
3. Before deleting or heavily changing a striking sentence, check that its core (four or more words) is not quoted in other volumes: [list of protected phrases].
4. Save pairs in batches (10–20) to `pNN.json`, and write "reached …" in `progress.md`. To resume, read `progress.md` and the log, and do not repeat fixes.
5. Update the log ([template](PASS_LOG.md)) after each batch.

## Hard limits

- Do not change headings, scene order, facts, dates, amounts, names or who knows what, unless you are fixing an error. Do not add new threads (at most 1–2 sentences to patch a hole).
- Entry state for the next volume: [list].
- The author's conventions: [quotation marks, dialogue dashes, hard spaces, scene break, how notes and text messages are set].
- The best sections (prologue, interludes, epilogue): fix only errors of fact, language and seams, not style.
- Word balance: neutral or negative, unless the brief says otherwise.

## Final checks

1. `node scripts/wb.mjs check <file>`: 0 errors.
2. A search for artifacts: double spaces, a comma before a full stop, straight quotes, arrows, work leftovers.
3. Re-reading of about 15 randomly chosen changes in context.
4. Indicators before and after that fit the theme.
5. A report in `pass/<id>/report.md`: changes per category, indicators, rejected objections with reasons, matters for the author and for other passes.

Answer briefly: number of changes, word balance, indicators, matters for later passes.
