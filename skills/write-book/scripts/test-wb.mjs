import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { findRules, normalizeCommand, run } from './wb.mjs';

test('English and Polish commands, with or without Polish diacritics', () => {
  assert.equal(normalizeCommand('check'), 'check');
  assert.equal(normalizeCommand('CHECK'), 'check');
  assert.equal(normalizeCommand('sprawdź'), 'check');
  assert.equal(normalizeCommand('porównaj'), 'diff');
  assert.equal(normalizeCommand('tom'), 'volume');
  assert.equal(normalizeCommand('spacje'), 'nbsp');
  assert.equal(normalizeCommand('xyz'), null);
});

test('rules are found automatically in the project folder', () => {
  const root = mkdtempSync(join(tmpdir(), 'wb-'));
  mkdirSync(join(root, '01_Project_Rules'));
  mkdirSync(join(root, '04_Manuscript', 'Volume_1'), { recursive: true });
  writeFileSync(join(root, '01_Project_Rules', 'check_rules.json'), '{"limits":[{"phrase":"somehow","max":0}]}');
  const unit = join(root, '04_Manuscript', 'Volume_1', '01.md');
  writeFileSync(unit, '### Chapter 1. A\n\nSomehow nothing.');
  assert.ok(findRules(unit).endsWith('check_rules.json'));
  const r = run(['check', unit]);
  assert.equal(r.fail, true);
  assert.match(r.report.errors[0].kind, /limit exceeded/);
});

test('nbsp never overwrites; diff needs two files; unknown command fails', () => {
  const root = mkdtempSync(join(tmpdir(), 'wb-'));
  const a = join(root, 'a.md');
  writeFileSync(a, 'Szedł w las.');
  const out = join(root, 'b.md');
  run(['nbsp', a, out]);
  assert.ok(existsSync(out));
  assert.throws(() => run(['spacje', a, out]), /not overwriting/);
  assert.throws(() => run(['diff', a]), /two files/);
  assert.throws(() => run(['unknown', a]), /Unknown command/);
});

test('help without arguments', () => {
  assert.match(run([]).text, /check  \| sprawdz/);
});

test('diff: two files differing only in name case are two files', () => {
  const dir = mkdtempSync(join(tmpdir(), 'wb-case-'));
  writeFileSync(join(dir, 'a.md'), 'Old text.\nSecond line.\n');
  writeFileSync(join(dir, 'A.md'), 'Old text.\n');
  if (readdirSync(dir).length < 2) return; // case-insensitive file system
  const r = run(['diff', join(dir, 'a.md'), join(dir, 'A.md')]);
  assert.ok(r.report.porownanie || r.report.comparison, 'comparison report');
  assert.throws(() => run(['diff', join(dir, 'a.md'), join(dir, 'a.md')]), /same file/);
});

test('an unknown option is a readable error, not a file', () => {
  assert.throws(() => run(['check', '--foo', 'x.md']), /Unknown option --foo/);
});
