import type { WordEntry } from '../types';

const ACCENT_MAP: Record<string, string> = {
  Á: 'A', À: 'A', Â: 'A', Ä: 'A', Å: 'A',
  É: 'E', È: 'E', Ê: 'E', Ë: 'E',
  Í: 'I', Ì: 'I', Î: 'I', Ï: 'I',
  Ó: 'O', Ò: 'O', Ô: 'O', Ö: 'O',
  Ú: 'U', Ù: 'U', Û: 'U', Ü: 'U',
  Ñ: 'N', Ç: 'C',
  á: 'A', à: 'A', â: 'A', ä: 'A', å: 'A',
  é: 'E', è: 'E', ê: 'E', ë: 'E',
  í: 'I', ì: 'I', î: 'I', ï: 'I',
  ó: 'O', ò: 'O', ô: 'O', ö: 'O',
  ú: 'U', ù: 'U', û: 'U', ü: 'U',
  ñ: 'N', ç: 'C',
};

export function normalizeWord(word: string): string {
  return word
    .toUpperCase()
    .split('')
    .map((ch) => ACCENT_MAP[ch] ?? ch)
    .join('')
    .replace(/[^A-Z]/g, '');
}

export function normalizeEntry(entry: WordEntry): WordEntry | null {
  const word = normalizeWord(entry.word);
  if (word.length < 2) return null;
  return { word, clue: entry.clue };
}
