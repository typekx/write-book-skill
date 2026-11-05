import { addHardSpaces } from './unit-check.mjs';

// "Old fragment → new fragment" replacements, applied in order to the already-changed text.
// The old fragment must occur exactly once, unless the pair names an occurrence number (1, 2, …),
// e.g. for a short sentence repeated across a volume ("He nodded."); `wb ticks` reports the numbers.
// An empty "new" deletes the fragment together with an orphaned space and an empty paragraph.
// Replacements are atomic: if any pair fails, nothing is changed.
// The new text gets non-breaking spaces after one-letter words only if the manuscript already uses them
// (a Polish typographic convention; English text is left as it is).

const NBSP = ' ';
const ARTIFACTS = {
  doubleSpaces: /[  ]{2,}/g,
  commaBeforeFullStop: /,\s*[.?!]/g,
  straightQuotes: /"/g,
  brokenCharacter: /�/g,
};

function escapeRx(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function pattern(old) {
  return new RegExp([...old].map(ch => (ch === ' ' || ch === NBSP ? `[ ${NBSP}]` : escapeRx(ch))).join(''), 'gu');
}

// Accepts English keys (old, new, occurrence) and Polish ones (stary, nowy, wystapienie).
export function normalizePairs(raw) {
  const list = Array.isArray(raw) ? raw : (raw?.pairs ?? raw?.pary);
  if (!Array.isArray(list) || !list.length) throw new Error('The pairs file must hold a list [["old","new"], …] or {"pairs": […]}.');
  return list.map((p, i) => {
    const [old, now, occurrence] = Array.isArray(p) ? p : [p?.old ?? p?.stary, p?.new ?? p?.nowy, p?.occurrence ?? p?.wystapienie];
    if (typeof old !== 'string' || typeof now !== 'string' || !old) throw new Error(`Pair ${i + 1}: needs a non-empty "old" and a "new" (an empty "new" deletes the fragment).`);
    if (occurrence !== undefined && !(Number.isInteger(occurrence) && occurrence >= 1)) throw new Error(`Pair ${i + 1}: "occurrence" is an integer from 1.`);
    return { old, now, occurrence };
  });
}

// After a deletion: one space instead of two, no space at a paragraph edge, no empty paragraph.
export function tidyDeletion(before, after) {
  const sp = /[  ]$/;
  if (sp.test(before) && (/^[  ]/.test(after) || /^[\n.,;:!?…]/.test(after) || after === '')) before = before.replace(/[  ]+$/, '');
  else if ((before === '' || before.endsWith('\n')) && /^[  ]/.test(after)) after = after.replace(/^[  ]+/, '');
  if (/\n\n$/.test(before) && /^\n\n/.test(after)) after = after.slice(2);
  if (before === '' && after.startsWith('\n\n')) after = after.slice(2);
  return [before, after];
}

function countArtifacts(text) {
  return Object.fromEntries(Object.entries(ARTIFACTS).map(([k, rx]) => [k, (text.match(rx) ?? []).length]));
}

function countWords(text) {
  return text.split(/[\s ]+/u).filter(Boolean).length;
}

export function applyPairs(text, rawPairs) {
  const pairs = normalizePairs(rawPairs);
  const hardSpaces = text.includes(NBSP);
  let current = text;
  const errors = [];
  pairs.forEach((p, i) => {
    const matches = [...current.matchAll(pattern(p.old))];
    const ok = p.occurrence ? matches.length >= p.occurrence : matches.length === 1;
    if (!ok) {
      errors.push({ pair: i + 1, found: matches.length, ...(p.occurrence ? { occurrence: p.occurrence } : {}), old: p.old.slice(0, 90) });
      return;
    }
    const m = matches[(p.occurrence ?? 1) - 1];
    let before = current.slice(0, m.index);
    let after = current.slice(m.index + m[0].length);
    if (p.now === '') [before, after] = tidyDeletion(before, after);
    current = before + (hardSpaces ? addHardSpaces(p.now) : p.now) + after;
  });
  if (errors.length) return { ok: false, errors, text };
  const pre = countArtifacts(text);
  const post = countArtifacts(current);
  const artifacts = Object.keys(post).filter(k => post[k] > pre[k]).map(k => ({ kind: k, before: pre[k], after: post[k] }));
  return {
    ok: true,
    text: current,
    applied: pairs.length,
    words: { before: countWords(text), after: countWords(current) },
    artifacts,
  };
}
