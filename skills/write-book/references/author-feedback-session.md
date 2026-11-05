# Author feedback session (page by page)

Read this when the author is reading a typeset volume and gives notes on successive PDF pages, or when they hand in their own corrected version of the text for checking.

## Collecting notes

1. **A note is addressed by the PDF page the author reads and a paragraph on that page.**
   - Paragraph 1 is the first paragraph that *starts* on that page. Skip the tail carried over from the previous page.
   - When in doubt, show both candidates.
   - Get the page text with `pdftotext -layout -f N -l N file.pdf -`. In the source, search after normalising non-breaking spaces.
2. **Quote the fragment from the Markdown source,** not from the PDF, because hyphenation and hard spaces in the PDF make matching harder.
3. **When the author asks for an assessment:** check sense and correctness, and give 2–3 variants with a recommendation. **When they give the final wording:** record it 1:1, but point out a language error if there is one, and offer the choice.
4. **Check the consequences in the volume and the series:**
   - repetitions nearby;
   - who is speaking;
   - references (removing an object from one scene can orphan a comparison several chapters later);
   - verbatim echoes between volumes.
5. **Do not claim something is not a motif before searching for it** in all volumes. Admit a mistake about it plainly.
6. **Record each decision at once:**
   - an "old → new" pair in the pairs file (`wb patch`; an entry may carry `occurrence`);
   - a row in the notes register with the next number.

   Run a dry run and report the note number and the result.
7. **Do not apply changes to the text until the author closes the session** (e.g. "end of feedback"). The bulk application then covers:
   - `patch --write --backup`;
   - `check`;
   - reading the changed paragraphs in context;
   - the change log;
   - building the publication files, if the author asks for it.
8. **Save the state every dozen notes and when the author asks:** number of notes, last page, files, conventions, the closing plan. The session may break off or move to another model ([handoff](model-handoff.md)).

Notes for later volumes given in passing go to a separate file for that volume. Apply them when you edit it.

## A corrected version from the author

When the author hands in a file they corrected themselves:

1. Compare it with the latest version (`wb diff`) and prepare a "was → is" list for review.
2. Check each change as outside feedback ([feedback verification](feedback-verification.md)): correctness, the author's typography, consequences in the volume and the series.
3. Give your objections as proposals. The author's file is the new source; keep the old one as a backup.
4. If your own earlier fix broke an echo or a motif, it goes back to the author's wording. Record this in the log of the volume concerned.
