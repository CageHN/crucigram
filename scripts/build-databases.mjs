#!/usr/bin/env node
/**
 * Builds src/data/words/*.json from scripts/banks/*.mjs word banks.
 * Run: node scripts/build-databases.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(ROOT, '../src/data/words');

const TARGETS = { kid: 200, adult: 400, wise: 600 };
const LANGUAGES = ['en', 'es', 'sv'];

mkdirSync(OUT_DIR, { recursive: true });

for (const lang of LANGUAGES) {
  for (const difficulty of Object.keys(TARGETS)) {
    const target = TARGETS[difficulty];
    const bankPath = join(ROOT, 'banks', `${lang}-${difficulty}.mjs`);
    const mod = await import(bankPath);
    const words = mod.default;

    if (!Array.isArray(words) || words.length !== target) {
      console.error(
        `${lang}-${difficulty}: expected ${target}, got ${words?.length ?? 0}`,
      );
      process.exit(1);
    }

    const seen = new Set();
    for (const entry of words) {
      if (seen.has(entry.word)) {
        console.error(`${lang}-${difficulty}: duplicate word ${entry.word}`);
        process.exit(1);
      }
      seen.add(entry.word);
    }

    const database = { language: lang, difficulty, words };
    const outPath = join(OUT_DIR, `${lang}-${difficulty}.json`);
    writeFileSync(outPath, JSON.stringify(database, null, 2) + '\n');
    console.log(`Wrote ${outPath} (${words.length} words)`);
  }
}

console.log('Done.');
