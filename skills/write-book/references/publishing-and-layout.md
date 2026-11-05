# Publishing and layout

Read when the task includes assembling a volume, production files, the cover or edition data. An export is not an instruction to publish or send.

## A manuscript ready for layout

- One source file per volume, assembled from units according to the list. The length of the whole equals the sum of the units; check it after assembly.
- Fixed markers recognised by layout scripts: part, chapter, interlude, prologue, epilogue, date line, scene separator, centred text, closing note. Record them in the project's style guide and keep them from the first page of the next volume; then layout follows the same path.
- Front and back matter (legal notice, author's note, acknowledgements, dedication) are the author's decisions. Mark drafts of these texts as awaiting acceptance.
- A fictitiousness notice covers names that may resemble real ones; complete it after the collision test ([names and collisions](names-and-collisions.md)).

## Order of work before print

1. The author accepts the text and the open textual decisions.
2. A last check of names.
3. Proofreading (no plot changes; compare length before and after).
4. Trial layout, page count.
5. Proofreading after layout: italics, non-breaking spaces where the language needs them, widows and orphans, running heads, table of contents.
6. Cover recalculated for the actual page count.
7. Final layout and a register of which source version each file came from.

## Files and how to check them

| File | What to check |
|---|---|
| DOCX | heading styles, document language, special characters, italics, scene separators, page numbering |
| Print PDF | trim size and margins required by the printer or platform, embedded fonts, page count |
| E-book PDF | linked table of contents, file size |
| EPUB | validator (e.g. EPUBCheck) without errors, navigation, cover, landmarks |
| Cover | print resolution of at least 300 DPI at full size with bleed, spine from the actual page count and paper, barcode area left empty (the platform prints it; KDP may reject a custom barcode, see [KDP publishing](kdp-publishing.md)), e-book front in the required proportions |

A tool's output does not replace looking at the pages. When the text changes after layout, note which files must be rebuilt.

## Edition data

An ISBN for each format, publisher or imprint, price, distribution channel, metadata (title, author, language). Mark missing data as production blockers instead of filling in example values.

## Copyright page

The wording is the author's decision: show options, do not insert it silently.

- **Do not promise more than the law.** A reservation cannot exclude statutory exceptions (fair use, fair dealing, permitted use, quotation), so add "except as permitted by law".
- **Text and data mining (TDM, AI training).** In the EU (Directive 2019/790, art. 4) commercial TDM is allowed unless the rightsholder expressly reserves it "in an appropriate manner". In print, a sentence on the copyright page is enough. In an e-book add a machine-readable reservation too: W3C TDMRep metadata in the OPF (`tdm:reservation` = 1, optionally `tdm:policy`). National transpositions differ (e.g. Poland: art. 26³ of the copyright act).
- Options:
  - short ("No part may be reproduced without the author's written permission, except as permitted by law");
  - full (reproduction, storage in retrieval systems, distribution in any form without prior written permission, except as permitted by law);
  - full with the TDM reservation.

  For wide distribution recommend a lawyer's review.
- **A layout that worked:** "© year Author", "First edition, country year", the reservation requiring written permission with a sentence that it does not limit permitted use, including quotation, a citation pattern ("Author, *Series. Volume N: Title*, year"), the TDM reservation, "Permissions: address", ISBNs. The author supplies the contact address; never take one from their account without consent.
- **After changing the copyright page, look at it in the PDF.** Longer text with a large top margin pushes the last line onto the next page and adds pages to the whole book (+2 in practice). Reduce the margin or the type size until it fits on one page, and only then recalculate the spine.

## Building the files: when and how

- **Work on the source file (Markdown), not on PDF, EPUB or DOCX.** Build the publication files only after the last editing pass or on the author's explicit request; do not rebuild after every fix.
- All files are built from **the same source version**. Replace old copies of the edition with the new ones, so that two versions do not circulate. Record the source version in the report.
- A scripted process: one build script (source → HTML/PDF, EPUB, DOCX) with one metadata file; scene breaks and part and chapter headings are markers the script recognises. After each build check page count, embedded fonts, EPUB validation (EPUBCheck), the table of contents, and look at a few pages (title, contents, chapter opening, last page).
- **Measure hyphenation, do not guess.** Automatic hyphenation with default limits on a narrow justified column (e.g. 5.5 × 8.5 in) gives a dozen per cent of lines ending in a hyphen, with runs of consecutive hyphens. Count them in the finished PDF (`pdftotext -layout`, lines ending in a letter and a hyphen) and tune the limits.
  - Strict limits: hyphenate only words from about 11 letters, with at least 5 letters on each side, and a hyphenation zone of about 12% (WeasyPrint: `hyphenate-limit-chars: 11 5 5`, `hyphenate-limit-zone: 12%`). In practice this cut the rate from 16% to about 3% with no change in page count.
  - Moderate limits (9/4/4, zone 6%) give about 7–8%.
  - Banning hyphenation entirely lengthens the book and loosens lines.

  The choice is the author's.
- **Runts** are a last line holding one short word or a fragment of a hyphenated word. Fix them in the layout script:
  - bind the last word of a paragraph (up to about 9 characters) to the previous one with a non-breaking space, and disable hyphenation for it (`hyphens: manual` on the last word). In practice 150–175 runts per volume fell to 1–3;
  - two cases this rule misses: a paragraph ending in italics (the "last word" pattern must skip closing `</em>` tags) and a dialogue dash before the last word, which needs non-breaking spaces on both sides;
  - the runt counter also raises false alarms, because one-word paragraphs are not runts, so look at each alarm.
- **Widows and orphans** (a single line of a paragraph at the top or bottom of a page) are blocked with `orphans: 2; widows: 2`. In EPUB do not force hyphenation (`hyphens: manual`, ragged right). Check a sample of breaks for correct syllabification.
- **Page count changes the spine.** After every change in length recalculate the cover: full width = 2 × page width + spine + bleeds. The spine depends on paper and page count; confirm it in the platform's calculator after uploading. KDP, black-and-white: white paper about 0.002252 in per page, cream about 0.0025 in; bleed 0.125 in on each side.
- **Rebuilding a series.** When a fix touches several volumes (e.g. levelling tics), rebuild all affected volumes in one run of the same script and replace whole packages at once.
- Before publishing, read the book once in its final form (paper, e-reader): layout and rhythm errors show up only there.

## Publication package

The full set after publication:
- print file, EPUB, DOCX and Markdown source;
- a **change log** (cumulative, [template](../assets/PASS_LOG.md));
- a **publication report**: files, print parameters, checks, history of ratings, the author's decisions, matters for a specialist, what was replaced;
- a **volume description for other models** ([handoff](model-handoff.md)).

After each later fix, update the description and the log or mark them as outdated.

## A home-print version (laser printer)

When the author wants to print the book at home, prepare a separate file with **imposition on double-sided sheets**. Do not change the main layout. For signatures of one sheet each (an A4 or Letter sheet folded in half gives four consecutive half-size pages):

| Sheet | PDF page 1 (front): left / right half | PDF page 2 (back): left / right half |
|---|---|---|
| 1 | 2 / 3 | 4 / 1 |
| k | 4k−2 / 4k−1 | 4k / 4k−3 |

When the sheet is flipped on the short edge, page 1 lies behind 2 and page 4 behind 3. After folding, the order is 1, 2, 3, 4. Mirrored margins (a larger inner margin) fit this layout, because odd pages are on the right.

- Pad the page count with blanks to a multiple of four.
- Print double-sided, flipping on the **short edge** (landscape), at 100% scale without "fit to page". Pages are reduced to half a sheet (about 97% for 5.5 × 8.5 in on A4).
- Fold the sheets and stack them in print order, first on top. Then staple or glue the spine. A single staple through the middle will not work, because each signature is one sheet.
- Check the imposition on the first two sheets (preview) before printing everything. Any PDF library works (e.g. `pypdf`): for each signature, two pages per sheet, each with two source pages side by side.
