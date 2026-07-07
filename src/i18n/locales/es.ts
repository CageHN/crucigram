import type { TranslationKeys } from './en';

export const es = {
  appTitle: 'Crucigram',
  tagline: 'Genera y resuelve crucigramas',
  welcomeTitle: 'Bienvenido a Crucigram',
  welcomeText:
    'Elige idioma, dificultad y tamaño de cuadrícula, luego pulsa Generar para crear un crucigrama aleatorio.',
  congratulations: '¡Felicidades! ¡Has resuelto el crucigrama!',
  revealLetter: 'Revelar letra',
  newPuzzle: 'Nuevo crucigrama',
  generationFailed: 'Error al generar',
  settings: {
    language: 'Idioma',
    difficulty: 'Dificultad',
    size: 'Tamaño',
    generate: 'Generar crucigrama',
    generating: 'Generando…',
  },
  clues: {
    across: 'Horizontal',
    down: 'Vertical',
    revealWord: 'Revelar palabra',
  },
  grid: {
    cellAria: 'Fila {{row}}, columna {{col}}',
  },
  errors: {
    generationFailed:
      'No se pudo generar un crucigrama. Inténtalo de nuevo o cambia la configuración.',
    databaseNotFound: 'Base de palabras no encontrada: {{key}}',
  },
  labels: {
    language: {
      en: 'Inglés',
      es: 'Español',
      sv: 'Sueco',
    },
    difficulty: {
      kid: 'Niños',
      adult: 'Adulto',
      wise: 'Sabio',
    },
    size: {
      small: 'Pequeño (9×9)',
      standard: 'Estándar (13×13)',
      large: 'Grande (17×17)',
    },
  },
} satisfies TranslationKeys;
