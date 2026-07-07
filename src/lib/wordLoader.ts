import type { Difficulty, Language, WordDatabase } from '../types';
import { normalizeEntry } from './normalize';

const modules = import.meta.glob<{ default: WordDatabase }>(
  '../data/words/*.json',
  { eager: true },
);

export function loadWordDatabase(
  language: Language,
  difficulty: Difficulty,
): WordDatabase {
  const key = `../data/words/${language}-${difficulty}.json`;
  const mod = modules[key];
  if (!mod) {
    throw new Error(`Word database not found: ${language}-${difficulty}`);
  }
  const raw = mod.default;
  const words = raw.words
    .map(normalizeEntry)
    .filter((w): w is NonNullable<typeof w> => w !== null);
  return { ...raw, words };
}
