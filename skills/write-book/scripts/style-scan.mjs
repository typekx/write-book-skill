import { readFileSync, realpathSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const WORD = /[\p{L}\p{N}][\p{L}\p{M}\p{N}’'-]*/gu;
// Candidate phrases in English and Polish. A hit is something to read, not an error.
const RULES = [
  ['enumeration', '(?:firstly|secondly|thirdly|another aspect is|po pierwsze|po drugie|po trzecie|po czwarte|kolejnym aspektem)'],
  ['explaining', '(?:in other words|this meant that|which meant that|that was why|he realized then|she realized then|oznaczało to|oznacza to|innymi słowy|to właśnie dlatego|zrozumiał wtedy|zrozumiała wtedy)'],
  ['antithesis', '(?:it wasn[’\']t|it was not|this wasn[’\']t about|not because|to nie było|to nie była|nie chodziło o|nie dlatego)'],
  ['foreshadowing', '(?:little did he know|little did she know|nothing would ever be the same|everything was about to change|jeszcze nie wiedział|jeszcze nie wiedziała|nic już nie będzie takie samo|wszystko miało się zmienić)'],
  ['qualifier', '(?:somehow|as if|in a way|something in him|something in her|w pewnym sensie|niejako|jakby|coś w nim|coś w niej)'],
  ['gesture', '(?:clenched his jaw|clenched her jaw|clenched his fists|clenched her fists|held his breath|held her breath|zacisnął szczękę|zacisnęła szczękę|zacisnął pięści|zacisnęła pięści|wstrzymał oddech|wstrzymała oddech)'],
];

// Selects the analysed range only. The input text is never written.
export function proseLines(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  const result = [];
  let frontmatter = lines[0]?.trim() === '---';
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (frontmatter) {
      if (i > 0 && /^(---|\.\.\.)\s*$/.test(line)) frontmatter = false;
      result.push({ line: i + 1, text: '' });
      continue;
    }
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence.char && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      result.push({ line: i + 1, text: '' });
      continue;
    }
    if (marker) {
      fence = { char: marker[1][0], length: marker[1].length };
      result.push({ line: i + 1, text: '' });
      continue;
    }
    const omit = /^\s{0,3}#{1,6}\s/.test(line) || /^\s*\|/.test(line) || /^\s*([*\-_]\s*){3,}$/.test(line);
    result.push({ line: i + 1, text: omit ? '' : line });
  }
  return result;
}

function median(values) {
  if (!values.length) return 0;
  const a = [...values].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

export function analyzeTexts(inputs) {
  const phrases = new Map();
  const files = [];
  for (const input of inputs) {
    const lines = proseLines(input.text);
    const hits = [];
    const paragraphs = [];
    let paragraph = [];
    const flush = () => {
      if (!paragraph.length) return;
      paragraphs.push(paragraph.length);
      for (let i = 0; i + 5 <= paragraph.length; i++) {
        const key = paragraph.slice(i, i + 5).map(t => t.word).join(' ');
        let item = phrases.get(key);
        if (!item) {
          item = { phrase: key, occurrences: 0, examples: [] };
          phrases.set(key, item);
        }
        item.occurrences++;
        if (item.examples.length < 6) item.examples.push({ file: input.path, line: paragraph[i].line });
      }
      paragraph = [];
    };
    for (const row of lines) {
      if (!row.text.trim()) { flush(); continue; }
      for (const token of row.text.matchAll(WORD)) {
        paragraph.push({ word: token[0].normalize('NFC').toLocaleLowerCase(), line: row.line });
      }
      for (const [category, pattern] of RULES) {
        const rx = new RegExp(`(?<![\\p{L}\\p{N}])${pattern}(?![\\p{L}\\p{N}])`, 'giu');
        for (const match of row.text.matchAll(rx)) {
          hits.push({ category, phrase: match[0], line: row.line,
            context: row.text.slice(Math.max(0, match.index - 80), match.index + match[0].length + 120) });
        }
      }
    }
    flush();
    const words = paragraphs.reduce((a, b) => a + b, 0);
    const categories = Object.fromEntries(RULES.map(([c]) => [c, hits.filter(h => h.category === c).length]));
    files.push({ file: input.path, words, paragraphs: paragraphs.length,
      medianWordsPerParagraph: median(paragraphs), categories,
      hitsPer1000Words: words ? Math.round(hits.length / words * 100000) / 100 : 0,
      hits });
  }
  const repeats = [...phrases.values()].filter(p => p.occurrences >= 3)
    .sort((a, b) => b.occurrences - a.occurrences || a.phrase.localeCompare(b.phrase));
  return {
    version: 1,
    meaning: 'Candidates for reading; no judgement of authorship, quality or "AI percentage". No file is changed.',
    method: 'Selected phrases on single lines and literal 5-word phrases with at least 3 occurrences in the given corpus. Frontmatter, ATX headings, pipe tables, separators and code blocks are skipped. Dates, dialogue, quotations and lists are kept. Phrases do not cross paragraph boundaries.',
    limitations: 'No semantic analysis and no recognition of deliberate motifs; inflections and paraphrases may be missed. A phrase split by a line break may escape the rules. Overlapping windows are counted separately. At most 40 phrases and 6 examples per phrase are listed. Do not pass a whole volume together with its chapters.',
    files,
    repeatedPhrasesTotal: repeats.length,
    repeatedPhrases: repeats.slice(0, 40),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    let args = process.argv.slice(2);
    if (args.length === 1 && args[0] === '--help') {
      process.stdout.write('Usage: node style-scan.mjs [--] file.md [file2.md ...]\nJSON report on standard output; no files are changed. Node.js 20 or newer.\n');
    } else {
      const literal = args[0] === '--';
      if (literal) args = args.slice(1);
      if (!args.length || (!literal && args.some(a => a.startsWith('--')))) throw new Error('Give text files; see --help.');
      const seen = new Set();
      const inputs = [];
      for (const arg of args) {
        const path = realpathSync(resolve(arg));
        const identity = process.platform === 'win32' ? path.toLowerCase() : path;
        if (seen.has(identity)) throw new Error(`The same file was given more than once: ${arg}`);
        seen.add(identity);
        if (!statSync(path).isFile()) throw new Error(`Input is not a file: ${arg}`);
        inputs.push({ path, text: readFileSync(path, 'utf8') });
      }
      process.stdout.write(JSON.stringify(analyzeTexts(inputs), null, 2) + '\n');
    }
  } catch (error) {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  }
}
