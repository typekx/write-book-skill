import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { applyPairs } from './patch.mjs';
import { run } from './wb.mjs';

test('each old fragment must occur exactly once; replacements are atomic', () => {
  const t = 'Ann has a cat. Ann has a dog.';
  const bad = applyPairs(t, [['Ann has a cat.', 'Eve has a cat.'], ['has', 'had']]);
  assert.equal(bad.ok, false);
  assert.equal(bad.errors[0].found, 2);
  assert.equal(bad.text, t);
  assert.equal(applyPairs(t, [['missing', 'x']]).errors[0].found, 0);
});

test('later pairs work on the already-changed text; Polish keys are accepted', () => {
  const r = applyPairs('He walked fast.', [{ old: 'He walked fast.', new: 'He walked slowly.' }, { stary: 'slowly', nowy: 'carefully' }]);
  assert.equal(r.ok, true);
  assert.equal(r.text, 'He walked carefully.');
});

test('a space in the old fragment matches a non-breaking one; hard spaces only where the text uses them', () => {
  const pl = applyPairs('Poszedł z psem w las.', [['z psem w las', 'z kotem w ciemny las']]);
  assert.equal(pl.ok, true);
  assert.equal(pl.text, 'Poszedł z kotem w ciemny las.');
  assert.equal(applyPairs('He saw a cat.', [['a cat', 'a dog']]).text, 'He saw a dog.');
});

test('an empty new deletes the fragment, and new artifacts are reported', () => {
  const r = applyPairs('One, two.', [[', two', ' ,']]);
  assert.ok(r.artifacts.some(a => a.kind === 'commaBeforeFullStop'));
  assert.equal(applyPairs('One. Two.', [[' Two.', '']]).text, 'One.');
});

test('occurrence picks one of repeated sentences; deletion leaves no empty paragraph', () => {
  const t = 'A speaks.\n\nShe nodded.\n\nB speaks. She nodded. Then on.';
  const r = applyPairs(t, [{ old: 'She nodded.', new: '', occurrence: 2 }, ['She nodded.', 'She agreed.']]);
  assert.equal(r.text, 'A speaks.\n\nShe agreed.\n\nB speaks. Then on.');
  assert.deepEqual(r.artifacts, []);
  assert.equal(applyPairs(t, [{ old: 'She nodded.', new: '', occurrence: 3 }]).ok, false);
  assert.equal(applyPairs('A.\n\nHe nodded.\n\nB.', [['He nodded.', '']]).text, 'A.\n\nB.');
});

test('wb patch: dry run saves nothing, saving needs a backup and never overwrites it', () => {
  const root = mkdtempSync(join(tmpdir(), 'patch-'));
  const md = join(root, 'a.md');
  const js = join(root, 'p.json');
  writeFileSync(md, 'Old text.');
  writeFileSync(js, JSON.stringify([['Old', 'New']]));
  assert.equal(run(['patch', md, js]).report.written, false);
  assert.equal(readFileSync(md, 'utf8'), 'Old text.');
  assert.throws(() => run(['patch', md, js, '--write']), /requires a backup/);
  const backup = join(root, 'before.md');
  assert.equal(run(['zamien', md, js, '--write', '--backup', backup]).report.written, true);
  assert.equal(readFileSync(md, 'utf8'), 'New text.');
  assert.equal(readFileSync(backup, 'utf8'), 'Old text.');
  writeFileSync(js, JSON.stringify([['New', 'Other']]));
  assert.throws(() => run(['patch', md, js, '--write', '--backup', backup]), /not overwriting/);
  assert.ok(existsSync(backup));
  writeFileSync(js, JSON.stringify([['Absent', 'x']]));
  const r = run(['patch', md, js, '--write', '--backup', join(root, 'k.md')]);
  assert.equal(r.fail, true);
  assert.equal(readFileSync(md, 'utf8'), 'New text.');
});

test('ticks: occurrence numbers match patch; density counts per 10,000 words', () => {
  const root = mkdtempSync(join(tmpdir(), 'ticks-'));
  const md = join(root, 'a.md');
  const text = '# Ch. 1\n\nHe speaks.\n\nHe nodded.\n\nThen he stood. He nodded. Then he left.';
  writeFileSync(md, text);
  const r = run(['ticks', '-p', 'nodded', '--context', '10', md]).report;
  assert.equal(r.hits, 2);
  assert.equal(r.sentences[1].occurrence, 2);
  assert.equal(r.sentences[1].line, 7);
  const out = applyPairs(text, [{ old: r.sentences[1].sentence, new: '', occurrence: 2 }]);
  assert.ok(out.text.endsWith('Then he stood. Then he left.'));
  const d = run(['density', '-p', '(?:^|(?<=[.!?] ))Then\\b', md]).report.files[0];
  assert.equal(d.hits, 2);
  assert.ok(d.per10k > 0);
  assert.throws(() => run(['ticks', md]), /needs a pattern/);
});
