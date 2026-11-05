# Publishing with Amazon KDP (print on demand)

Read this when the author publishes a book with KDP or asks to be guided step by step. The author does the clicking. You name the next field, check their screenshots and prepare the files. The publish button is the author's decision. The KDP interface changes, so check every step against the screenshot, not from memory.

## Before you start

- **Language support:** check KDP's list of supported languages for each format. Some languages, Polish among them, are accepted only in print (paperback or hardcover), with no eBook.
- **Series:** where the series feature is not available for the book's language, put the series name and volume number in the subtitle. The product page then shows, e.g., "First Light: The Harbour. Volume I".
- **ISBN:**
  - An ISBN of the author's own (from the national ISBN agency) takes precedence over KDP's free number. Each format gets its own number.
  - The publisher name in KDP must match the publisher the number is registered to (the imprint).
  - Register the title as a book, not a collection, and file any announcement the agency requires.
- **Categories and keywords** are the author's decision. Propose options.

## Files: match the settings

| KDP field | Trap | What to do |
|---|---|---|
| Ink and paper | cream and white have different spine widths | Cream is the fiction standard (warmer, easier on the eyes); white suits illustrated books. Printing costs the same. After changing the paper, rebuild the cover. |
| Trim size | the default may be 6 × 9 in | Pick the size of the interior PDF; a different size means both files are rejected. |
| Bleed | bleed only for an interior with images to the edge | Text only: No Bleed. The cover always has bleed. |
| Cover finish | none | Matte suits dark, atmospheric covers; glossy suits bright ones. |

**Cover (one PDF: back, spine, front):**
- Width = 2 × page width + spine + 2 × 0.125 in. Height = page height + 0.25 in.
- Spine = page count × paper factor (white 0.002252 in, cream 0.0025 in per page). Spine text only from 79 pages.
- **Leave the barcode to Amazon.** A custom barcode, even a correct vector taken from the ISBN agency's PDF, was rejected by the KDP previewer with "unable to detect a valid barcode".
  - On the back cover leave an empty zone of 2 × 1.2 in in the bottom right corner, 0.25 in from the trim line, with no text in it.
  - In KDP untick "my cover has a barcode", and Amazon prints the barcode with the ISBN.
- The front image should be 300 DPI at the size with bleed (for 5.5 × 8.5 in about 1690 × 2700 px). Images pasted into a chat may be downscaled. Ask for the original as a file or a ZIP.

## Previewer

- **Error** blocks publishing and must be fixed.
- **Review** is informational. "We've removed non-printable markup" on table-of-contents pages means PDF links were removed. Look at those pages; if the text is complete, the matter is closed.
- The tooltip "All text must be completely inside the guides" appears on mouse-over. It is not an error.
- Look at the cover with guides, the title page, the copyright page, the contents, a chapter opening and the last page. Then Approve.
- After every file replacement KDP asks you to reconfirm the AI answers and approve the preview again.
- If the preview shows the same error after a fix, check on the screenshot whether the new file was actually uploaded (e.g. whether the custom barcode is gone).

## AI disclosure

KDP asks whether content is AI-generated, separately for text, images and translation, with scope and degree of editing. AI-assisted content (editing, proofreading, typesetting a text the author wrote) does not need to be declared. Explain the difference and the options, but do not choose for the author: only they know how the text and the cover were made. The answers are not public. Hiding AI use can cause trouble with the account.

## Prices and royalties

- In EU markets you enter the price **without VAT**; KDP adds VAT (books often have a reduced rate, e.g. 5% in Poland). For a final price of 49.99, enter 49.99 ÷ 1.05 = 47.61.
- Royalty is 60% of the net list price minus printing cost above each market's threshold, and 50% below it. KDP shows the printing cost after the interior is uploaded (e.g. 311 pages, cream, 5.5 × 8.5 in: about 4.48 EUR or 4.73 USD per copy).
- Enter other markets by hand as rounded local prices. Exchange-rate conversion gives odd figures. The euro area has several separate fields.
- **Expanded Distribution** pays 40% and goes to bookshops and libraries. For books in smaller languages it rarely helps, so leave it off by default.
- Territories: with the author's full rights, choose worldwide.

## Proof copy and publishing

- A proof is printed from the current draft. It carries a "Not for Resale" band and no ISBN. You pay printing and shipping. The order link arrives by e-mail within 4 hours, and payment is due within 24 hours.
- **Check the quantity and total on the screenshot** before confirming. The quantity field is easy to leave at 5.
- Recommend Save as Draft until the proof has been seen, but do not push. After publishing, the book goes through review (up to 72 hours) and cannot be changed meanwhile.
- After submitting, record every setting in the project state (trim, paper, finish, prices, cover file, errors solved), so later volumes go through without repeating mistakes.

## Problems outside the files

If the author's PDF viewer reports an error (e.g. a missing system library), check the file first (`pdfinfo`, `qpdf --check`). If the file is valid, point to the cause on the author's machine (e.g. repairing the Visual C++ runtime on Windows). Do not rebuild files without need.
