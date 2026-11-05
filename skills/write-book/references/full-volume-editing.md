# Editing a finished volume: themed passes over the whole text

Read this when a volume or book already exists and the author orders an audit, an edit, a style pass or preparation for publication. [Modular work](modular-work.md) is about writing; this module is about editing a finished text.

## Core rule: the whole text, one theme

Do not split the text into parts, line ranges or "chunks for separate agents". Each pass (or agent) reads the **whole volume** from the first line to the last and deals with **one theme** (dialogue, narrator, tics, facts, language, continuity). Continuity errors link distant places, and a reader of one range sees only one end of them. Splitting into ranges gives random coverage and a false sense of control. Reading 300–700 lines at a time is a reading technique, not a division of work.

Run passes **one after another on one file**, never in parallel on the same file. Each pass sees the text corrected by the previous ones and does not undo their fixes without a reason (a contradiction, an error). Only read-only reviews (scans, ratings) may run in parallel, because they do not change the file.

If the author has explicitly forbidden splitting the text, that rule is absolute. If they have not said anything, choose the whole text anyway.

## Order of passes

Go from matters that change facts to matters that only change how the text sounds. A later fix should not cancel an earlier one.

| Pass | Theme | Notes |
|---|---|---|
| P0 | formalities: cast list, notes, titles, proper names, brands | the author's decisions stay with the author |
| P1 | facts, logic, chronology, real-world detail, character knowledge | first, because everything else rests on facts |
| P2 | dialogue: speeches, aphorisms in characters' mouths, distinct voices | |
| P3 | narrator's voice: thesis punchlines, recaps, lectures, explanations | |
| P4 | syntactic mannerisms and tics: "Not…", "as if", one-sentence paragraphs, repeated gestures | count the replacements too |
| P5 | copy-edit: grammar, punctuation, repetitions, seams after merges, how notes and messages are set | |
| P6 | continuity scan after all changes ([continuity scan](continuity-scan.md)) | always last |

Only after P6 build the publication files ([publishing and layout](publishing-and-layout.md)).

## The fix loop

For each defect:
1. Propose the smallest effective fix as an "old fragment → new fragment" pair.
2. Apply it with the tool (`node scripts/wb.mjs patch file.md pairs.json`: a dry run first, then `--write --backup before.md`).
3. **Read the changed paragraph together with its neighbours:** rhythm, pronouns, order of information, new repetitions, whether a line still answers the previous one.
4. If it got worse, fix it again. Only then move to the next defect.

Later fixes refer to the already-corrected text.

Technical rules:

- The old fragment occurs in the file **exactly once** (or the pair names its occurrence number). A normal space also matches a non-breaking one.
- Apply replacements in batches (10–20 pairs, saved to `pNN.json`) so an interruption does not lose work.
- **Take a snapshot before every pass** (`V_before_P3.md`). Without it there is no way back.
- After automatic replacements look for artifacts: double spaces, a comma before a full stop, straight quotes, a duplicated quotation, a broken character (e.g. ©), an empty dash. The tool reports them, but search the file anyway.
- **After removing narrator interjections, check the dialogue layout.** Two consecutive lines of the same character in separate paragraphs suggest a change of speaker. Merge them or add a reaction. This is the most common side effect of passes P2 and P3.
- Before deleting or heavily rewriting a striking sentence, search its core (four or more words) in the other volumes. Phrases quoted verbatim in later volumes stay unchanged. Keep a list of them in the book profile.
- The entry state for the next volume (who has which object, who knows what, who is alive and where) is fixed. Changing it requires the author's decision.

## Log and state

After each batch add entries to the pass log ([template](../assets/PASS_LOG.md)) in the form `[cat] chapter | WAS | IS | reason`. At the end collect them into one **change log** for the author, together with the publication report. The instructions for a pass agent are in the [pass brief template](../assets/PASS_BRIEF.md).

Save the work state **after each pass and every 20–30 minutes of long work**: which pass, file version, word count, agent identifiers, open decisions, next step. After a break (session limit, environment restart) resume from the state file, `progress.md` and the log, not from zero. Files on disk survive; the conversation does not. Before resuming, check whether the fixes from the last batch are already in the file, so you do not apply them twice.

## What to check after each pass

1. Technical check (`wb.mjs check`) without errors; a search for artifacts.
2. Word count before and after. Stylistic cuts may exceed the 3% threshold only when the author ordered cutting. Record the balance and the reason. Explain any growth after plot changes in the report.
3. Reading of a dozen or so randomly chosen changed places in context.
4. Indicators that fit the theme, before and after (e.g. paragraphs starting with "Not", speeches over 100 words, aphorisms in dialogue).
5. A pass report: changes per category, indicators, **rejected objections with reasons**, matters for the author, matters for later passes.

## When to stop

Editing has no end, so it needs a stopping rule. Stop when:
- two consecutive independent continuity-scan rounds find no hard conflicts;
- further reviews produce only cosmetic changes (taste, rhythm);
- what remains are the author's decisions or questions for a specialist.

Do not promise a particular rating. Independent reviewers differ by about ±5 points on a 0–100 scale, so a few points between two ratings is noise. Do not chase a number (e.g. "at least 90"). Give an honest range, point to what actually raises quality (certainty of findings, repetitions, voices), and leave the decisions to the author.

## Limits

- For opinions and analyses from outside use [feedback verification](feedback-verification.md): the quotation must exist in the text and the context must match.
- Legal, financial and technical detail in fiction: fix obvious errors, and mark disputed points "for a specialist to verify". Do not settle them in a confident tone.
- Changes made by a tool or an agent are still proposals until the author accepts them. Build publication versions only when asked.
