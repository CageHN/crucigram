export type Language = 'en' | 'es' | 'sv';
export type Difficulty = 'kid' | 'adult' | 'wise';
export type Size = 'small' | 'standard' | 'large';

export interface WordEntry {
  word: string;
  clue: string;
}

export interface WordDatabase {
  language: Language;
  difficulty: Difficulty;
  words: WordEntry[];
}

export type Direction = 'across' | 'down';

export interface PlacedWord {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: Direction;
  number: number;
}

export interface CrosswordPuzzle {
  grid: string[][];
  placedWords: PlacedWord[];
  size: number;
  language: Language;
  difficulty: Difficulty;
}

export interface PuzzleSettings {
  language: Language;
  difficulty: Difficulty;
  size: Size;
}

export const SIZE_MAP: Record<Size, number> = {
  small: 9,
  standard: 13,
  large: 17,
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  es: 'Spanish',
  sv: 'Swedish',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  kid: 'Kid',
  adult: 'Adult',
  wise: 'Wise',
};

export const SIZE_LABELS: Record<Size, string> = {
  small: 'Small (9×9)',
  standard: 'Standard (13×13)',
  large: 'Large (17×17)',
};
