import { existsSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { proseLines } from './style-scan.mjs';

// Weekday and month names in English and Polish, keyed to JavaScript getUTCDay / month index.
const DAYS = {
  en: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  pl: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
};
const MONTHS = {
  en: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
  pl: ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],
};
const DAY_ALT = [...DAYS.en, ...DAYS.pl].join('|');
const MONTH_ALT = [...MONTHS.en, ...MONTHS.pl].join('|');
// "Monday, 3 March 2026", "Monday, March 3, 2026", "poniedziałek, 3 marca 2026".
const DATE_DMY = new RegExp(`(?<![\\p{L}])(${DAY_ALT}),?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_ALT}),?\\s+(\\d{4})`, 'giu');
const DATE_MDY = new RegExp(`(?<![\\p{L}])(${DAYS.en.join('|')}),?\\s+(${MONTHS.en.join('|')})\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})`, 'giu');
const HIDDEN = /[­​-‏‪-‮⁠﻿�]/u;
const LEFTOVERS = [
  ['template variable', /\$\{[^}]*\}|\{\{[^}]*\}\}/u],
  ['work marker', /\[(?:NF|TODO|TBD|TK|CHECK|TO VERIFY|DO WERYFIKACJI|DO UZUPEŁNIENIA|NOTE)[^\]]*\]/iu],
  ['comment', /<!--|-->/u],
  ['work note', /(?<![\p{L}])(?:TODO|TBD|DO WERYFIKACJI|DO UZUPEŁNIENIA)(?![\p{L}])/u],
];
const DEFAULTS = {
  typography: null,
  digitsOnlyInItalics: false,
  noSquareBrackets: false,
  minWords: null,
  maxWords: null,
  maxWordDropPct: 3,
  limits: [],
  bannedNames: [],
};

// Ready-made patterns, English and Polish alternatives in one expression.
const BUILTINS = {
  'antithesis': { rx: /(?<![\p{L}])(?:not(?![\p{L}])[^.!?\n]{1,80}?,? but(?![\p{L}])|nie(?![\p{L}])[^.!?\n]{1,80}?, (?:tylko|lecz)(?![\p{L}]))/giu },
  'it-was-not': { rx: /(?<![\p{L}])(?:(?:it|this|that)\s+(?:wasn['’]t|was not|isn['’]t|is not)\s[^.!?\n]{1,80}[.!?]\s+(?:it|this|that)\s+(?:was|is)(?![\p{L}])|(?:to\s+)?nie\s+był[aoy]?(?:\s+to)?\s[^.!?\n]{1,80}[.!?]\s+(?:to\s+)?był[aoy]?(?![\p{L}]))/giu },
  'colon-reveal': { rx: /[\p{Ll}»”’]:\s/gu, narrationOnly: true },
  'triple-anaphora': { rx: /(?<![\p{L}])(no|without|not|never|nor|bez|ani|nie)\s[^,.;!?\n]{1,40},\s+(?:and\s+|or\s+)?\1\s[^,.;!?\n]{1,40},\s+(?:and\s+|or\s+)?\1(?![\p{L}])/giu },
};

function escape(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// "phrase" is literal with Unicode word boundaries; a trailing * allows any word ending.
function compileLimit(limit) {
  if (limit.builtin) {
    const item = BUILTINS[limit.builtin];
    if (!item) throw new Error(`Unknown built-in pattern: ${limit.builtin}. Available: ${Object.keys(BUILTINS).join(', ')}.`);
    return new RegExp(item.rx.source, item.rx.flags);
  }
  if (limit.pattern) return new RegExp(limit.pattern, 'giu');
  const prefix = limit.phrase.endsWith('*');
  const core = escape(prefix ? limit.phrase.slice(0, -1) : limit.phrase).replace(/\s+/g, '\\s+');
  return new RegExp(`(?<![\\p{L}\\p{N}])${core}${prefix ? '[\\p{L}]*' : '(?![\\p{L}\\p{N}])'}`, 'giu');
}

function countWords(text) {
  return text.split(/[\s ]+/u).filter(Boolean).length;
}

function headings(text) {
  return text.split(/\r?\n/).filter(l => /^\s{0,3}#{1,6}\s/.test(l)).map(l => l.trim());
}

export function addHardSpaces(text) {
  return text.replace(/(?<![\p{L}\p{N}])([aiouwzAIOUWZ]) (?=\S)/gu, '$1 ');
}

function checkDate(m, dayName, day, monthName, year, add, line) {
  const lang = DAYS.en.includes(dayName.toLowerCase()) ? 'en' : 'pl';
  const monthIndex = [...MONTHS.en, ...MONTHS.pl].indexOf(monthName.toLowerCase()) % 12;
  const date = new Date(Date.UTC(+year, monthIndex, +day));
  if (date.getUTCDate() !== +day) { add('date does not exist', line, m); return; }
  const real = DAYS[lang][date.getUTCDay()];
  if (real !== dayName.toLowerCase()) add(`weekday: calendar says ${real}`, line, m);
}

export function checkUnit(text, rules = {}, previous = null) {
  const cfg = { ...DEFAULTS, ...rules };
  const errors = [];
  const warnings = [];
  const add = (list, kind, line, fragment) => list.push({ kind, line, fragment: fragment.slice(0, 160) });
  const prose = proseLines(text);
  const rawLines = text.replace(/^﻿/, '').split(/\r?\n/);

  rawLines.forEach((line, i) => {
    if (HIDDEN.test(line)) add(errors, 'invisible or replacement character', i + 1, JSON.stringify(line.match(HIDDEN)[0]));
    for (const [kind, rx] of LEFTOVERS) if (rx.test(line)) add(errors, `leftover: ${kind}`, i + 1, line);
    const err = (kind, l, m) => add(errors, kind, l, m);
    for (const m of line.matchAll(DATE_DMY)) checkDate(m[0], m[1], m[2], m[3], m[4], err, i + 1);
    for (const m of line.matchAll(DATE_MDY)) checkDate(m[0], m[1], m[3], m[2], m[4], err, i + 1);
  });

  // Typography: "en" or "pl" as errors when set; without rules both are reported as warnings only when obvious.
  const typo = cfg.typography ? errors : warnings;
  const style = cfg.typography ?? 'any';
  for (const { line, text: l } of prose) {
    if (!l.trim()) continue;
    if (style === 'pl' || style === 'any') {
      if (style === 'pl' && /"/u.test(l)) add(typo, 'straight quotation mark (use „…”)', line, l);
      if (style === 'pl' && /“/u.test(l)) add(typo, 'English opening quote (use „)', line, l);
      if (style === 'pl' && /—/u.test(l)) add(typo, 'em dash (Polish uses en dash –)', line, l);
      if (/^\s*-\s/u.test(l) || /\s-\s/u.test(l)) add(typo, 'spaced hyphen instead of a dash', line, l);
      if (/\.\.\./u.test(l)) add(typo, 'three dots instead of an ellipsis character', line, l);
    }
    if (style === 'en') {
      if (/"/u.test(l)) add(typo, 'straight double quote (use “…”)', line, l);
      if (/(?<=\s|^)'|'(?=\s|$|[.,;:!?])/u.test(l)) add(typo, 'straight single quote (use ‘…’ or ’)', line, l);
      if (/\.\.\./u.test(l)) add(typo, 'three dots instead of an ellipsis character', line, l);
      if (/--/u.test(l) || /\s-\s/u.test(l)) add(typo, 'hyphen used as a dash (use — or –)', line, l);
      if (/„/u.test(l)) add(typo, 'low opening quote in English text', line, l);
    }
    if (cfg.digitsOnlyInItalics && /\p{Nd}/u.test(l.replace(/\*[^*]+\*/gu, '').replace(/_[^_]+_/gu, '')))
      add(errors, 'digits outside italics', line, l);
    if (cfg.noSquareBrackets && /[[\]]/u.test(l)) add(errors, 'square bracket in prose', line, l);
  }

  const counters = [];
  for (const limit of cfg.limits) {
    const rx = compileLimit(limit);
    const narrationOnly = limit.narrationOnly ?? BUILTINS[limit.builtin]?.narrationOnly ?? false;
    const places = [];
    for (const { line, text: l } of prose) {
      if (narrationOnly && /^\s*(?:[–—-]\s|["“„])/u.test(l)) continue;
      for (const m of l.matchAll(rx)) places.push({ line, fragment: m[0] });
    }
    const item = { name: limit.name ?? limit.builtin ?? limit.phrase ?? limit.pattern, count: places.length, max: limit.max ?? null, places: places.slice(0, 12) };
    counters.push(item);
    if (item.max !== null && item.count > item.max)
      errors.push({ kind: `limit exceeded: ${item.name} (${item.count} > ${item.max})`, line: places[0]?.line ?? null, fragment: places.map(p => `L${p.line}`).join(', ') });
  }
  for (const name of cfg.bannedNames) {
    const rx = compileLimit({ phrase: name.endsWith('*') ? name : `${name}*` });
    rawLines.forEach((l, i) => { if (rx.test(l)) add(errors, `banned or retired name: ${name}`, i + 1, l); rx.lastIndex = 0; });
  }

  const body = prose.map(p => p.text).join('\n');
  const words = countWords(text);
  const proseWords = countWords(body);
  // Unit type = first word of the last heading before the prose, e.g. "### Interlude II. Title".
  const unitType = headings(text).map(h => h.replace(/^#+\s*/, '').split(/[\s.]/)[0]).at(-1) ?? null;
  const byType = cfg.wordsByUnitType?.[unitType] ?? {};
  const min = byType.min ?? cfg.minWords;
  const max = byType.max ?? cfg.maxWords;
  if (min !== null && min !== undefined && words < min) errors.push({ kind: `too short: ${words} < ${min}${unitType ? ` (${unitType})` : ''}`, line: null, fragment: '' });
  if (max !== null && max !== undefined && words > max) errors.push({ kind: `too long: ${words} > ${max}${unitType ? ` (${unitType})` : ''}`, line: null, fragment: '' });
  if (proseWords === 0) errors.push({ kind: 'no prose in the file', line: null, fragment: '' });

  let comparison = null;
  if (previous !== null) {
    const before = countWords(previous);
    const change = before ? Math.round((words - before) / before * 1000) / 10 : null;
    const now = new Set(headings(text));
    const missingHeadings = headings(previous).filter(h => !now.has(h));
    const separators = t => t.split(/\r?\n/).filter(l => /^\s*(\*\s*){3}$|^\s*([-_]\s*){3,}$|^\s*#\s*$/u.test(l)).length;
    comparison = { wordsBefore: before, wordsNow: words, changePct: change, missingHeadings,
      sceneSeparatorsBefore: separators(previous), sceneSeparatorsNow: separators(text) };
    if (change !== null && -change > cfg.maxWordDropPct)
      errors.push({ kind: `word count dropped by ${-change}% (threshold ${cfg.maxWordDropPct}%): check whether scenes were removed or summarised`, line: null, fragment: '' });
    if (missingHeadings.length) errors.push({ kind: 'headings from the previous version are missing', line: null, fragment: missingHeadings.join(' | ') });
  }

  return {
    version: 1,
    meaning: 'Technical check of one unit. It does not judge literary quality or canon and never changes the input file.',
    wordCountMethod: 'Runs of characters separated by whitespace; a non-breaking space counts as whitespace. "words" includes headings and date lines; "proseWords" skips headings, tables, code blocks and frontmatter.',
    unitType, words, proseWords, counters, comparison, errors, warnings,
  };
}

// Checking a range (part, volume): each unit separately, then totals and "maxVolume" limits.
export function checkVolume(inputs, rules = {}) {
  const units = inputs.map(input => ({ file: input.path, ...checkUnit(input.text, rules) }));
  const errors = [];
  const words = units.reduce((a, u) => a + u.words, 0);
  const counters = (rules.limits ?? []).map((limit, i) => {
    const count = units.reduce((a, u) => a + u.counters[i].count, 0);
    const item = { name: units[0]?.counters[i].name, count, maxVolume: limit.maxVolume ?? null,
      inUnits: units.filter(u => u.counters[i].count).map(u => `${u.file} (${u.counters[i].count})`) };
    if (item.maxVolume !== null && count > item.maxVolume) errors.push({ kind: `range limit exceeded: ${item.name} (${count} > ${item.maxVolume})`, line: null, fragment: item.inUnits.join(', ') });
    return item;
  });
  if (rules.minVolumeWords && words < rules.minVolumeWords) errors.push({ kind: `range too short: ${words} < ${rules.minVolumeWords}`, line: null, fragment: '' });
  const texts = new Map();
  const heads = new Map();
  inputs.forEach(input => {
    const key = input.text.replace(/\s+/gu, ' ').trim();
    if (key && texts.has(key)) errors.push({ kind: 'two files with identical content', line: null, fragment: `${texts.get(key)} = ${input.path}` });
    else texts.set(key, input.path);
    for (const h of headings(input.text).filter(h => /^#{3,}\s/.test(h))) {
      if (heads.has(h)) errors.push({ kind: 'repeated unit heading', line: null, fragment: `${h}: ${heads.get(h)} and ${input.path}` });
      else heads.set(h, input.path);
    }
  });
  const unitErrors = units.reduce((a, u) => a + u.errors.length, 0);
  return {
    version: 1,
    meaning: 'Technical check of a range: each unit separately plus totals. It does not judge literary quality or canon.',
    unitCount: units.length, words, counters, errors, unitErrors, units,
  };
}

function loadFile(arg) {
  const path = realpathSync(resolve(arg));
  if (!statSync(path).isFile()) throw new Error(`Input is not a file: ${arg}`);
  return { path, text: readFileSync(path, 'utf8') };
}

const HELP = `Usage: node unit-check.mjs [-r rules.json] [-c previous.md] [-n output.md] [--] file.md
       node unit-check.mjs [-r rules.json] [--] unit1.md unit2.md ...
JSON report on standard output. Input files are never changed.
Several files: each unit checked, totals, "maxVolume" limits, duplicate content and headings.
-r/--rules rules file; -c/--compare previous version; -n/--nbsp write a copy with non-breaking spaces to a NEW file.
Simpler: node scripts/wb.mjs help. Exit code 1 means a usage error or check errors. Node.js 20 or newer.
`;

const ALIASES = {
  '--rules': '--rules', '-r': '--rules',
  '--compare': '--compare', '-c': '--compare',
  '--nbsp': '--nbsp', '-n': '--nbsp',
};

function readArgs(args) {
  const opts = {};
  const files = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--') { files.push(...args.slice(i + 1)); break; }
    const name = ALIASES[a];
    if (name) {
      if (i + 1 >= args.length) throw new Error(`Missing value for ${a}.`);
      opts[name] = args[++i];
    } else if (a.startsWith('-')) throw new Error(`Unknown option ${a}; see --help.`);
    else files.push(a);
  }
  if (!files.length) throw new Error('Give a unit file; see --help.');
  return { opts, files };
}

function main(args) {
  if (args.length === 1 && args[0] === '--help') { process.stdout.write(HELP); return; }
  const { opts, files } = readArgs(args);
  const rules = opts['--rules'] ? JSON.parse(loadFile(opts['--rules']).text.replace(/^﻿/, '')) : {};
  if (files.length > 1) {
    if (opts['--compare'] || opts['--nbsp']) throw new Error('--compare and --nbsp work with a single file only.');
    const seen = new Set();
    const inputs = files.map(f => {
      const input = loadFile(f);
      const id = process.platform === 'win32' ? input.path.toLowerCase() : input.path;
      if (seen.has(id)) throw new Error(`The same file was given more than once: ${f}`);
      seen.add(id);
      return input;
    });
    const report = checkVolume(inputs, rules);
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    if (report.errors.length || report.unitErrors) process.exitCode = 1;
    return;
  }
  const input = loadFile(files[0]);
  const previous = opts['--compare'] ? loadFile(opts['--compare']) : null;
  if (previous && previous.path.toLowerCase() === input.path.toLowerCase()) throw new Error('The comparison file is the same as the input.');
  const report = { file: input.path, ...checkUnit(input.text, rules, previous?.text ?? null) };
  if (opts['--nbsp']) {
    const out = resolve(opts['--nbsp']);
    if (existsSync(out)) throw new Error(`Output file already exists, not overwriting: ${opts['--nbsp']}`);
    writeFileSync(out, addHardSpaces(input.text), 'utf8');
    report.copyWritten = out;
  }
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  if (report.errors.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  }
}
