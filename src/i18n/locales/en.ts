import type { Difficulty, Language, Size } from '../../types';

export interface TranslationKeys {
  appTitle: string;
  tagline: string;
  welcomeTitle: string;
  welcomeText: string;
  congratulations: string;
  revealLetter: string;
  newPuzzle: string;
  generationFailed: string;
  settings: {
    language: string;
    difficulty: string;
    size: string;
    generate: string;
    generating: string;
  };
  clues: {
    across: string;
    down: string;
    revealWord: string;
  };
  grid: {
    cellAria: string;
  };
  errors: {
    generationFailed: string;
    databaseNotFound: string;
  };
  labels: {
    language: Record<Language, string>;
    difficulty: Record<Difficulty, string>;
    size: Record<Size, string>;
  };
}

export const en: TranslationKeys = {
  appTitle: 'Crucigram',
  tagline: 'Generate & solve crossword puzzles',
  welcomeTitle: 'Welcome to Crucigram',
  welcomeText:
    'Choose your language, difficulty, and grid size, then hit Generate to create a random crossword puzzle.',
  congratulations: 'Congratulations! You solved the puzzle!',
  revealLetter: 'Reveal Letter',
  newPuzzle: 'New Puzzle',
  generationFailed: 'Generation failed',
  settings: {
    language: 'Language',
    difficulty: 'Difficulty',
    size: 'Size',
    generate: 'Generate Crossword',
    generating: 'Generating…',
  },
  clues: {
    across: 'Across',
    down: 'Down',
    revealWord: 'Reveal word',
  },
  grid: {
    cellAria: 'Row {{row}}, column {{col}}',
  },
  errors: {
    generationFailed: 'Could not generate a crossword. Try again or change settings.',
    databaseNotFound: 'Word database not found: {{key}}',
  },
  labels: {
    language: {
      en: 'English',
      es: 'Spanish',
      sv: 'Swedish',
    },
    difficulty: {
      kid: 'Kid',
      adult: 'Adult',
      wise: 'Wise',
    },
    size: {
      small: 'Small (9×9)',
      standard: 'Standard (13×13)',
      large: 'Large (17×17)',
    },
  },
};
