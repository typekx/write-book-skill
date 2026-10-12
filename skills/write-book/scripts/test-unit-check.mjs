import test from 'node:test';
import assert from 'node:assert/strict';
import { addHardSpaces, checkUnit, checkVolume } from './unit-check.mjs';

const kinds = r => r.errors.map(e => e.kind);

test('checks weekdays in English (both orders) and Polish, including leap years', () => {
  assert.deepEqual(kinds(checkUnit('### Chapter 1. Start\n\n*York, Tuesday, 29 February 2028*\n\nText.')), []);
  assert.deepEqual(kinds(checkUnit('*York, Tuesday, February 29, 2028*\n\nText.')), []);
  assert.match(kinds(checkUnit('*York, Monday, 3 March 2026*\n\nText.'))[0], /calendar says tuesday/);
  assert.match(kinds(checkUnit('*York, Monday, March 3rd, 2026*\n\nText.'))[0], /calendar says tuesday/);
  assert.match(kinds(checkUnit('*Kraków, poniedziałek, 3 marca 2026*\n\nTekst.'))[0], /calendar says wtorek/);
  assert.match(kinds(checkUnit('*Friday, 31 April 2026*\n\nText.'))[0], /does not exist/);
});

test('finds work leftovers and invisible characters', () => {
  const k = kinds(checkUnit('He came in.​\n\nShe said [TK] something.\n\n${report_md}')).join(' | ');
  assert.match(k, /invisible/);
  assert.match(k, /work marker/);
  assert.match(k, /template variable/);
});

test('English typography profile reports straight quotes, dots and hyphen dashes', () => {
  const r = checkUnit('"Yes," he said... -- and left - fast.', { typography: 'en' });
  const k = kinds(r).join(' | ');
  assert.match(k, /straight double quote/);
  assert.match(k, /three dots/);
  assert.match(k, /hyphen used as a dash/);
  assert.deepEqual(kinds(checkUnit('“Yes,” he said… and left — fast. Don’t.', { typography: 'en' })), []);
});

test('Polish typography profile accepts Polish quotes and en dashes', () => {
  assert.deepEqual(kinds(checkUnit('– „Tak” – powiedział.', { typography: 'pl' })), []);
  assert.ok(checkUnit('- Tak - powiedział. "Nie"... — dodał.', { typography: 'pl' }).errors.length >= 3);
});

test('without rules typography gives warnings, not errors', () => {
  const r = checkUnit('He said... - and left.');
  assert.equal(r.errors.length, 0);
  assert.ok(r.warnings.length >= 2);
});

test('phrase limits count word endings with a trailing star', () => {
  const r = checkUnit('Exactly so. Exactness matters. Inexactly.', { limits: [{ phrase: 'exact*', max: 0 }] });
  assert.equal(r.counters[0].count, 2);
  assert.match(kinds(r)[0], /limit exceeded/);
});

test('built-in patterns catch disguised antitheses in English and Polish and skip dialogue colons', () => {
  const text = 'It wasn’t luck. It was a plan.\n\nTo nie był przypadek. To był plan.\n\nHe knew one thing: he would return.\n\n“Listen: we go back.”\n\nNo calls, no letters, no visits.';
  const r = checkUnit(text, { limits: [
    { builtin: 'it-was-not', max: 0 }, { builtin: 'colon-reveal', max: 5 }, { builtin: 'triple-anaphora', max: 0 }, { builtin: 'antithesis', max: 5 },
  ] });
  const n = Object.fromEntries(r.counters.map(c => [c.name, c.count]));
  assert.equal(n['it-was-not'], 2);
  assert.equal(n['colon-reveal'], 1);
  assert.equal(n['triple-anaphora'], 1);
});

test('unknown built-in gives a readable error', () => {
  assert.throws(() => checkUnit('Text.', { limits: [{ builtin: 'none', max: 0 }] }), /Available/);
});

test('digits only in italics when the project requires it', () => {
  const r = checkUnit('*9:45.*\n\nHe left at 9.', { digitsOnlyInItalics: true });
  assert.equal(r.errors.filter(e => e.kind === 'digits outside italics').length, 1);
});

test('retired names are found with word endings', () => {
  assert.match(kinds(checkUnit('He worked for Kalwer’s firm.', { bannedNames: ['Kalwer'] }))[0], /retired name: Kalwer/);
});

test('minimum words depend on the unit type in the heading', () => {
  const rules = { minWords: 50, wordsByUnitType: { Epilogue: { min: 5 } } };
  const epilogue = checkUnit('## PART II\n\n### Epilogue. Title\n\nOne two three four five six.', rules);
  assert.equal(epilogue.unitType, 'Epilogue');
  assert.equal(epilogue.errors.length, 0);
  assert.match(kinds(checkUnit('### Chapter 1. Start\n\nOne two three.', rules))[0], /too short: \d+ < 50 \(Chapter\)/);
});

test('comparison detects silent shortening and missing headings', () => {
  const old = '### Chapter 1. A\n\n' + 'word '.repeat(1000) + '\n\n### Chapter 2. B\n\n' + 'word '.repeat(1000);
  const now = '### Chapter 1. A\n\n' + 'word '.repeat(300);
  const r = checkUnit(now, {}, old);
  const k = kinds(r).join(' | ');
  assert.match(k, /dropped by/);
  assert.match(k, /headings from the previous version/);
  assert.deepEqual(r.comparison.missingHeadings, ['### Chapter 2. B']);
});

test('non-breaking spaces only after single-letter words', () => {
  assert.equal(addHardSpaces('Szedł w las i z psem, a potem wózek.'), 'Szedł w las i z psem, a potem wózek.');
});

test('an empty file is an error', () => {
  assert.match(kinds(checkUnit('# Title\n')).join(), /no prose/);
});

test('volume: totals, volume limit, duplicate content and headings', () => {
  const a = { path: 'a.md', text: '### Chapter 1. A\n\nThere was fog over the river.' };
  const b = { path: 'b.md', text: '### Chapter 2. B\n\nNothing could be seen.' };
  const copy = { path: 'c.md', text: '### Chapter 1. A\n\nThere was fog over the river.' };
  const r = checkVolume([a, b, copy], { limits: [{ phrase: 'fog*', max: 5, maxVolume: 1 }] });
  const k = r.errors.map(e => e.kind).join(' | ');
  assert.equal(r.unitCount, 3);
  assert.equal(r.counters[0].count, 2);
  assert.match(k, /range limit exceeded/);
  assert.match(k, /identical content/);
  assert.match(k, /repeated unit heading/);
});
