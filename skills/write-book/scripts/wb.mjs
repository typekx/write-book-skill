import { existsSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { analyzeTexts } from './style-scan.mjs';
import { addHardSpaces, checkUnit, checkVolume } from './unit-check.mjs';

// One-word commands in English and Polish; Polish diacritics are optional.
const COMMANDS = {
  check: 'check', sprawdz: 'check',
  volume: 'volume', tom: 'volume',
  diff: 'diff', porownaj: 'diff',
  style: 'style', styl: 'style',
  nbsp: 'nbsp', spacje: 'nbsp',
  help: 'help', pomoc: 'help',
};
const RULE_FILES = ['check_rules.json', join('01_Project_Rules', 'check_rules.json')];

const HELP = `Usage: node scripts/wb.mjs <command> [-r rules.json] files…

  check  | sprawdz   file.md                 technical check of one unit
  volume | tom       file1.md file2.md …     units separately, totals and volume limits
  diff   | porownaj  old.md new.md           word-count drop and missing headings
  style  | styl      file.md …               scan for mannerisms and repeated phrases
  nbsp   | spacje    file.md output.md       copy with non-breaking spaces (new file)
  help   | pomoc                             this help

Rules: -r file.json, or automatically check_rules.json (or 01_Project_Rules/check_rules.json)
in the file's folder and up to four levels above. Output: JSON; exit code 1 on errors. Input files are never changed.
`;

export function normalizeCommand(word = '') {
  const key = word.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/ł/g, 'l');
  return COMMANDS[key] ?? null;
}

export function findRules(startPath) {
  let dir = dirname(resolve(startPath));
  for (let i = 0; i <= 4; i++) {
    for (const name of RULE_FILES) {
      const candidate = join(dir, name);
      if (existsSync(candidate)) return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function load(path) {
  const real = realpathSync(resolve(path));
  if (!statSync(real).isFile()) throw new Error(`Input is not a file: ${path}`);
  return { path: real, text: readFileSync(real, 'utf8') };
}

export function run(argv) {
  const [word, ...rest] = argv;
  const cmd = normalizeCommand(word);
  if (!word || cmd === 'help') return { text: HELP };
  if (!cmd) throw new Error(`Unknown command "${word}". List: node scripts/wb.mjs help`);
  let rulesPath = null;
  const files = [];
  for (let i = 0; i < rest.length; i++) {
    if (['-r', '--rules'].includes(rest[i])) {
      if (i + 1 >= rest.length) throw new Error('Missing rules file after -r.');
      rulesPath = rest[++i];
    } else files.push(rest[i]);
  }
  if (!files.length) throw new Error('Give a file; see: node scripts/wb.mjs help');
  const needRules = ['check', 'volume', 'diff'].includes(cmd);
  const usedRules = needRules ? (rulesPath ?? findRules(files[0])) : null;
  const rules = usedRules ? JSON.parse(load(usedRules).text.replace(/^﻿/, '')) : {};
  const withRules = report => ({ rules: usedRules ? realpathSync(usedRules) : 'none (default checks only)', ...report });

  if (cmd === 'check') {
    if (files.length !== 1) throw new Error('check takes one file; for several use volume.');
    const input = load(files[0]);
    const report = withRules({ file: input.path, ...checkUnit(input.text, rules) });
    return { report, fail: report.errors.length > 0 };
  }
  if (cmd === 'volume') {
    const seen = new Set();
    const inputs = files.map(f => {
      const input = load(f);
      const id = process.platform === 'win32' ? input.path.toLowerCase() : input.path;
      if (seen.has(id)) throw new Error(`The same file was given more than once: ${f}`);
      seen.add(id);
      return input;
    });
    const report = withRules(checkVolume(inputs, rules));
    return { report, fail: report.errors.length > 0 || report.unitErrors > 0 };
  }
  if (cmd === 'diff') {
    if (files.length !== 2) throw new Error('diff takes two files: old.md new.md');
    const [old, now] = files.map(load);
    if (old.path.toLowerCase() === now.path.toLowerCase()) throw new Error('The same file was given twice.');
    const report = withRules({ file: now.path, previous: old.path, ...checkUnit(now.text, rules, old.text) });
    return { report, fail: report.errors.length > 0 };
  }
  if (cmd === 'style') {
    return { report: analyzeTexts(files.map(load)), fail: false };
  }
  if (cmd === 'nbsp') {
    if (files.length !== 2) throw new Error('nbsp takes two files: input.md output.md');
    const input = load(files[0]);
    const out = resolve(files[1]);
    if (existsSync(out)) throw new Error(`Output file already exists, not overwriting: ${files[1]}`);
    writeFileSync(out, addHardSpaces(input.text), 'utf8');
    return { report: { written: out, source: input.path }, fail: false };
  }
  throw new Error(`Unhandled command: ${word}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = run(process.argv.slice(2));
    process.stdout.write(result.text ?? JSON.stringify(result.report, null, 2) + '\n');
    if (result.fail) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  }
}
