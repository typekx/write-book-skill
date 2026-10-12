import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeTexts } from './style-scan.mjs';

test('skips Markdown scaffolding and keeps line numbers', () => {
  const text = '---\ntitle: Firstly\n---\n# Secondly\n| Thirdly |\n```text\nSomehow\n```\nFirstly he opened the door.';
  const r = analyzeTexts([{ path: 'a.md', text }]);
  assert.equal(r.files[0].hits.length, 1);
  assert.equal(r.files[0].hits[0].line, 9);
});

test('quotations and dialogue remain candidates', () => {
  const r = analyzeTexts([{ path: 'a.md', text: '“Firstly, check the window.”\n\n> Secondly, check the door.' }]);
  assert.equal(r.files[0].categories.enumeration, 2);
});

test('handles English and Polish phrases, case and word boundaries', () => {
  const r = analyzeTexts([{ path: 'a.md', text: 'HE CLENCHED HIS JAW. Somehow she knew. Somehowness is not a word. Jakby coś usłyszała. Jakbyśmy to znali.' }]);
  assert.equal(r.files[0].categories.gesture, 1);
  assert.equal(r.files[0].categories.qualifier, 2);
});

test('finds a phrase across a line break and across files', () => {
  const r = analyzeTexts([
    { path: 'a.md', text: 'He closed the door\nquietly.\n\nHe closed the door quietly.' },
    { path: 'b.md', text: 'He closed the door quietly.' },
  ]);
  const p = r.repeatedPhrases.find(p => p.phrase === 'he closed the door quietly');
  assert.equal(p.occurrences, 3);
  assert.deepEqual(p.examples.map(e => e.file), ['a.md', 'a.md', 'b.md']);
});

test('does not join a phrase across a paragraph boundary', () => {
  const r = analyzeTexts([{ path: 'a.md', text: 'He closed\n\nthe door quietly.\n\nHe closed\n\nthe door quietly.\n\nHe closed\n\nthe door quietly.' }]);
  assert.equal(r.repeatedPhrasesTotal, 0);
});

test('empty text gives defined metrics without division by zero', () => {
  const r = analyzeTexts([{ path: 'a.md', text: '' }]);
  assert.equal(r.files[0].words, 0);
  assert.equal(r.files[0].hitsPer1000Words, 0);
  assert.equal(r.files[0].medianWordsPerParagraph, 0);
});
