# Aligning a series to a published volume

Read this when one volume (usually the first) is already published and the others exist as manuscripts that must be reconciled with it: remove contradictions, adopt its conventions and close its open threads. It is the reverse of ordinary editing: the published volume is untouchable, only later volumes change.

## Principles

1. **The published volume is frozen canon.** Do not change a word of it. Its prose beats every register, plan, series bible and the text of later volumes.
2. **Cascade.** Align volumes in order, each in its own module: V2 to V1, then V3 to V1 and the already aligned V2, then V4 to V1–V3, and so on. An aligned volume becomes canon for the next ones; do not reopen it without a reason.
3. **Direction of a fix.** In a contradiction, change the later volume. If two later volumes contradict each other, change the one further down the cascade, unless the earlier one contradicts the published volume.
4. **Whole volume, one reader.** Read every volume from the first line to the last, in portions, with line numbers. Portions are a loading technique, not a division of work between agents ([full-volume editing](full-volume-editing.md)).
5. **Smallest fix.** Change the fact, not the scene. Add a new paragraph only where a contradiction would otherwise remain or where the author ordered a thread to be explained.

## Preparation

1. Read the whole published volume. Write `CANON_V1.md`: dates and weekdays, characters' ages and years of service, addresses, floors and the layout of places, who holds which object and where it is, injuries and their side, forms of address, names of institutions and positions, phrases quoted verbatim, writing conventions (italic messages, date format, quotation marks).
2. In the same file start a **register of open threads** of the published volume: `N1`, `N2`… Each entry is a question the volume leaves to the reader (who, what, why), with its location in the published volume and a short quote.
3. Keep a copy of the original of every volume to be aligned (`V3_original.md`). Corrections always refer to the original, so line numbers do not shift.

## Cycle for one volume

1. Split the volume into portions that fit in one read (e.g. up to 25,000 characters), with source line numbers.
2. Read portion by portion. **After each portion, before loading the next one**, append a note `[kN]` to the changes file: discrepancies with line and comparison source, facts of this volume binding for later ones, things to check. Update the counter in the progress file. The conversation may break off or be compacted at any moment; the file survives, memory does not.
3. Check every discrepancy by searching the prose of all earlier volumes (with non-breaking spaces normalised), not from memory or a summary. Read the scene around the hit; the earlier volume may have described the situation differently than you remember ([continuity scan](continuity-scan.md)).
4. After the last portion collect all corrections in one file of "old → new" pairs, with the original line number in the description; the old fragment occurs in the file exactly once or names an `occurrence`. Apply them in one run to a copy of the original (`node scripts/wb.mjs patch`, dry run first) and check: no unbalanced italic markers, no remnants of the old version (search), word count.
5. Write the alignment log for the volume:
   - changes with tags: **Z** (alignment to earlier volumes), **R** (small internal slip fixed in passing), **N** (new paragraph explaining a thread); each with line, WAS, IS and source;
   - threads of the published volume explained in this volume;
   - threads still open (carried over from the previous log with a status);
   - remarks without a text change (**U**);
   - facts of this volume binding for later volumes.
6. Save the result, update the progress file, and only then start the next volume.

## Register of open threads

The register travels from log to log. In every volume each entry gets a status: explained (where and how), partly, still open. Check a thread explained in a later volume against the published volume sentence by sentence: the explanation must not change what the published volume showed (T); it may add what it left unresolved.

**Resolving a thread the author did not resolve is the author's decision** (safeguard 7). When entries remain open at the last volume, do not write a ready explanation. For each, prepare 2–3 options (each consistent with the published volume, with the place in the last volume where it could go and its consequences) or the option "stays open on purpose". Write the insertion only after the author chooses. Side threads (an episodic character who does not return) are not inconsistencies; record them as remarks.

## Backward correction

When a later volume reveals that an already aligned volume contradicts the published one, correct that volume: add the pair to its corrections file, reapply to the original, append a section "Supplement after module N" to its log and reissue the file. Do not fix the contradiction only in the newer volume if the error sits in the older one.

## Typical discrepancies when aligning

- **The "previously" page and the cast list** at the start of a volume: date range of earlier volumes, characters missing from the volume just aligned, events described differently from the prose.
- **Years of service, ages and years in flashbacks:** "fifteen years at the bank" against six in the published volume; a child's age in a scene from years ago counted from a different birth year.
- **An object at the scene of an event:** an object "on his wrist" or "in her pocket" in a scene although the published volume left it elsewhere (inventory of belongings, deposit, flat).
- **Layout of places:** floor, order of premises in a building, number of stairs, which side of the street.
- **Location of a scene recalled from an earlier volume:** a conversation assigned to a different place or time than in the source scene.
- **Writing conventions:** messages and notes in the form set by the published volume (e.g. italics without quotation marks).
- **Hypothesis and course of events:** an earlier volume gives a character's reconstruction (M), a later one shows what happened (T). This is not a contradiction if the reconstruction was marked as a guess and the course of events fits what the published volume showed.
- **Forms of address** established in an earlier volume.

## Result for the author

After each module: the volume file, the alignment log, the progress file. At the end: a short summary, the list of options for the author's decision, and a note that only the source files (Markdown) were changed and the editions (DOCX, EPUB, PDF) must be rebuilt ([publishing and layout](publishing-and-layout.md)).
