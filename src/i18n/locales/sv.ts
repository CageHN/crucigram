import type { TranslationKeys } from './en';

export const sv = {
  appTitle: 'Crucigram',
  tagline: 'Skapa och lös korsord',
  welcomeTitle: 'Välkommen till Crucigram',
  welcomeText:
    'Välj språk, svårighetsgrad och rutnätsstorlek och tryck sedan på Generera för att skapa ett slumpmässigt korsord.',
  congratulations: 'Grattis! Du löste korsordet!',
  revealLetter: 'Visa bokstav',
  newPuzzle: 'Nytt korsord',
  generationFailed: 'Generering misslyckades',
  settings: {
    language: 'Språk',
    difficulty: 'Svårighetsgrad',
    size: 'Storlek',
    generate: 'Generera korsord',
    generating: 'Genererar…',
  },
  clues: {
    across: 'Vågrätt',
    down: 'Lodrätt',
    revealWord: 'Visa ord',
  },
  grid: {
    cellAria: 'Rad {{row}}, kolumn {{col}}',
  },
  errors: {
    generationFailed:
      'Kunde inte generera ett korsord. Försök igen eller ändra inställningarna.',
    databaseNotFound: 'Ordlista hittades inte: {{key}}',
  },
  labels: {
    language: {
      en: 'Engelska',
      es: 'Spanska',
      sv: 'Svenska',
    },
    difficulty: {
      kid: 'Barn',
      adult: 'Vuxen',
      wise: 'Klok',
    },
    size: {
      small: 'Litet (9×9)',
      standard: 'Standard (13×13)',
      large: 'Stort (17×17)',
    },
  },
} satisfies TranslationKeys;
