# Continuity scan of a whole volume

Read this before final publication, after larger plot or style changes, and always after the editing passes ([full-volume editing](full-volume-editing.md)). The scan finds contradictions that arise **at the seams** of fixes and between distant scenes.

## Why this method

Earlier analyses failed for four reasons:
- they split the text into ranges, so each reader saw only one end of a contradiction;
- they had no single source of truth, so agents compared "from memory";
- they did not check the deliberately changed places, so each round of fixes added new contradictions;
- they mixed errors with taste, so false objections created noise.

The method below removes these problems.

## Category registers

Each agent reads the **whole volume** and builds a register for one category, with rows `fact | every place (line, quotation) | consistent?`. A conflict is an item to fix.

| Code | Category | What to record |
|---|---|---|
| K1 | Time | every date, weekday, hour, interval ("three days later"), age, length of service, year of an event; check the calendar of headings with a script, not by eye |
| K2 | Objects and documents | every copy, original, storage medium, key, sheet, folder: how many, who has it, where it lies, when it moves |
| K3 | People, places, numbers | names, roles, relationships, addresses, routes, distances, company names, amounts, prices, percentages, counts; conversions (currencies, redenomination) |
| K4 | Character knowledge | who learns what, when and from where; whether someone knows something before its source, or forgets what they know |
| K5 | Real-world detail | every legal, tax, banking, procedural or technical claim, with an assessment and a source |
| K6 | Regression | every fragment changed since the version before the rework (a version diff): seams and contradictions with unchanged text |

Build the registers **from scratch** (without looking at earlier results) and independently. After editing passes read everything again, because each fix may have changed something.

## Cycle

1. Registers K1–K6 (in parallel, read-only).
2. **Verifier** (a separate agent): for each reported conflict it decides whether it is real and whether it collides with other volumes, and it tests the fix pair on a copy of the file. False alarms are dropped here, not in the text.
3. Fixes: the smallest effective ones, as pairs ([full-volume editing](full-volume-editing.md#the-fix-loop)). Also fix the places where another category reported the same conflict, so it is not fixed halfway.
4. **A fresh control round** from scratch on the corrected text. Repeat until two consecutive rounds find no hard conflicts. In practice the count falls quickly, e.g. 11 → 4 → 1.

## Tell apart

- **a hard contradiction** (two facts exclude each other);
- **a character's hypothesis** (the character assumes, the text does not settle it);
- **a deliberate mystery** (the author has not revealed the answer yet);
- **a stylistic judgement** (taste).

Only the first is an error to fix without asking. Treat the second as a matter of certainty ([feedback verification](feedback-verification.md)). The third stays. The fourth goes to the style pass.

## Typical sources of contradiction found in practice

- **Dates and intervals:** the weekday does not match the date; "three weeks ago" does not match the date of the scene.
- **Objects:** the number of copies of a document or media changes between scenes; an object is in two places at once.
- **Knowledge:** a character knows something before anyone told them, or "forgets" a fact from an earlier scene.
- **Names of units:** the same unit or role has two names (division/department); the name of a register from one field slips into another.
- **Hypothesis as fact:** a character's note presents a hypothesis as an established fact ("the scheme ran for 24 years", when only the last transfer is known).
- **Ambiguous years:** a number of years refers ambiguously to a year (e.g. "five years later" after a date thirty years back).
- **Same words, different sets:** two different sets of documents are described in "the same" words.
- **Duplicated gestures:** the same gesture prop appears with different characters (turning a mug, rubbing a thumb across the palm).
- **Time deixis on the day of the scene:** in a Friday scene, "on Friday" about an event a week earlier, "since Friday" on that same Friday, or "yesterday" after a night that has not yet passed in the text. Recalculate every "on Monday", "yesterday" and "for a week" against the date in the heading.
- **Roundings that drift apart:** "a year and a half" in one paragraph and "almost two years" in the next about the same event, or "nine years" of payments when the years in the text give eight. Count from the date in the prose, not from impression.
- **Chains of hours:** a call at 8:21 and a text at 8:45 "twenty-four minutes after the attack"; an appointment "from ten" when the boat leaves at eight. List the hours of one day in order and check the gaps.
- **Presence in a place:** a character "has sat on the bench since 11:30", but at 12:00 someone sees the bench without them; a character is in two distant cities on the same day with no journey described.
- **Order within a scene:** "when she came back, she asked…" placed before her leaving is described; knowledge from a conversation that happens two days later in the text.
- **Physics and real things:** gear changes with the hand that cannot reach the lever in that car; an hour hand "passing twelve" on its way from five to nine; equipment a character cannot use with the described injury.
- **Roles and titles across volumes:** "board member" in one volume and "board's proxy" in a document from another. Decide by the document quoted in the prose of the earlier volume.
- **Names of courts, offices and units** in different versions, and declension of foreign names in inflected languages.

**Before you fix a "contradiction with an earlier volume", find the scene in that volume's prose.** Memory and summaries mislead. In one case the "first interrogation in February" turned out to be the second; the first, in December, was in the same room, so the "fix" would have introduced an error. Search for the place or prop in all volumes and read the date headings around the hits.

## Source of truth

Before the scan, gather in one place a table of facts (dates, amounts, who has which object, who knows what) derived from the prose, and a list of phrases quoted verbatim in other volumes. The registers are not canon: when they conflict with the prose the author has approved, the prose wins.
