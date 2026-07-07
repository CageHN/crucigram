#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const DIR = dirname(fileURLToPath(import.meta.url));

function normalize(word) {
  return word
    .toUpperCase()
    .replace(/Å/g, 'A')
    .replace(/Ä/g, 'A')
    .replace(/Ö/g, 'O')
    .replace(/[^A-Z]/g, '');
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
      `  { word: "${e.word}", clue: "${e.clue.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}" }`,
  );
  writeFileSync(join(DIR, filename), `export default [\n${lines.join(',\n')},\n];\n`);
}
