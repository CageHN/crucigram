# Crucigram

A web app to **generate and solve crossword puzzles** in English, Spanish, and Swedish.

## Features

- **Languages:** English, Spanish, Swedish
- **Difficulty:** Kid, Adult, Wise — each with its own word database
- **Grid sizes:** Small (9×9), Standard (13×13), Large (17×17)
- **Random generation:** Every puzzle is uniquely generated from the word database
- **Interactive solving:** Type answers, navigate with arrow keys, reveal letters or whole words

## Word Databases

Word lists live in `src/data/words/` as JSON files:

```
{language}-{difficulty}.json
```

Nine databases cover all combinations (e.g. `en-kid.json`, `es-adult.json`, `sv-wise.json`). Each entry has a `word` and a `clue`.

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## How It Works

1. Pick language, difficulty, and size in the sidebar.
2. Click **Generate Crossword** — the engine places intersecting words from the matching database onto the grid.
3. Fill in the grid using clues (Across / Down). Use arrow keys to move between cells.
4. Click **?** next to a clue to reveal that word, or **Reveal Letter** for the active cell.

## Tech Stack

- React 19 + TypeScript
- Vite
- No backend — word databases are bundled as static JSON
