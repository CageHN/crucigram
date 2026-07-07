#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const DIR = dirname(fileURLToPath(import.meta.url));

function normalize(word) {
  return word
    .toUpperCase()
    .replace(/Ñ/g, 'N')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '');
}

function parseDataFile(path) {
  const text = readFileSync(path, 'utf8');
  const pairs = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('|');
    if (idx === -1) continue;
    pairs.push([trimmed.slice(0, idx), trimmed.slice(idx + 1)]);
  }
  return pairs;
}

function buildEntries(pairs, limit) {
  const seen = new Set();
  const entries = [];
  for (const [rawWord, clue] of pairs) {
    const word = normalize(rawWord);
    if (!word || word.length < 2) continue;
    if (seen.has(word)) continue;
    seen.add(word);
    entries.push({ word, clue });
    if (entries.length === limit) break;
  }
  return entries;
}

function writeMjs(filename, entries) {
  const lines = entries.map(
    (e) =>
      `  { word: "${e.word}", clue: "${e.clue.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}" }`
  );
  writeFileSync(join(DIR, filename), `export default [\n${lines.join(',\n')},\n];\n`);
}

const banks = [
  { data: 'data-kid.txt', out: 'es-kid.mjs', count: 200 },
  { data: 'data-adult.txt', out: 'es-adult.mjs', count: 400 },
  { data: 'data-wise.txt', out: 'es-wise.mjs', count: 600 },
];

for (const { data, out, count } of banks) {
  const pairs = parseDataFile(join(DIR, data));
  const entries = buildEntries(pairs, count);
  if (entries.length !== count) {
    console.error(`${out}: expected ${count}, got ${entries.length} (from ${pairs.length} raw lines)`);
    process.exit(1);
  }
  writeMjs(out, entries);
  console.log(`${out}: ${entries.length} entries`);
}
