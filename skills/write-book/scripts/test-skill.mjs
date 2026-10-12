import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAX_SKILL_WORDS = 1300;

function markdownFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return markdownFiles(path);
    return name.endsWith('.md') ? [path] : [];
  });
}

const skill = readFileSync(join(ROOT, 'SKILL.md'), 'utf8');

test('SKILL.md has a header with name, description and version', () => {
  const head = skill.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(head, 'missing YAML header');
  assert.match(head[1], /^name: \S+/m);
  assert.match(head[1], /^description: ".{50,1024}"$/m);
  assert.match(head[1], /version: "\d+\.\d+\.\d+"/);
});

test(`SKILL.md stays within ${MAX_SKILL_WORDS} words`, () => {
  const words = skill.split(/\s+/).filter(Boolean).length;
  assert.ok(words <= MAX_SKILL_WORDS, `SKILL.md has ${words} words`);
});

test('every Markdown link points to an existing file', () => {
  const broken = [];
  for (const file of markdownFiles(ROOT)) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(/\]\(([^)#\s]+)(#[^)]*)?\)/g)) {
      if (/^https?:/.test(m[1])) continue;
      if (!existsSync(resolve(dirname(file), m[1]))) broken.push(`${file.slice(ROOT.length)} → ${m[1]}`);
    }
  }
  assert.deepEqual(broken, []);
});

test('every command in the command table is listed in SKILL.md', () => {
  const table = readFileSync(join(ROOT, 'references', 'commands.md'), 'utf8');
  const commands = [...table.matchAll(/^\| `([^`]+)` \| `([^`]+)` \|/gm)].flatMap(m => [m[1], m[2]]);
  assert.ok(commands.length >= 40, `too few commands in the table: ${commands.length}`);
  const missing = commands.filter(c => !skill.includes(c));
  assert.deepEqual(missing, []);
});

test('behaviour scenarios are well formed', () => {
  const data = JSON.parse(readFileSync(join(ROOT, 'evals', 'scenarios.json'), 'utf8'));
  assert.ok(data.scenarios.length >= 10);
  const ids = new Set();
  for (const s of data.scenarios) {
    assert.ok(s.id && !ids.has(s.id), `bad or repeated id: ${s.id}`);
    ids.add(s.id);
    for (const key of ['prompt', 'situation']) assert.ok(typeof s[key] === 'string' && s[key].length > 3, `${s.id}: ${key}`);
    for (const key of ['required', 'forbidden']) assert.ok(Array.isArray(s[key]) && s[key].length, `${s.id}: ${key}`);
  }
});
