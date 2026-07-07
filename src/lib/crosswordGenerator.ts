import type {
  CrosswordPuzzle,
  Direction,
  PlacedWord,
  PuzzleSettings,
  WordEntry,
} from '../types';
import { SIZE_MAP } from '../types';
import { loadWordDatabase } from './wordLoader';

const EMPTY = '';
const BLOCK = '#';

interface Candidate {
  entry: WordEntry;
  row: number;
  col: number;
  direction: Direction;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createEmptyGrid(size: number): string[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => EMPTY),
  );
}

function canPlace(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
): boolean {
  const size = grid.length;
  const len = word.length;

  if (direction === 'across') {
    if (col + len > size) return false;
    if (col > 0 && grid[row][col - 1] !== EMPTY && grid[row][col - 1] !== BLOCK)
      return false;
    if (col + len < size && grid[row][col + len] !== EMPTY) return false;
  } else {
    if (row + len > size) return false;
    if (row > 0 && grid[row - 1][col] !== EMPTY && grid[row - 1][col] !== BLOCK)
      return false;
    if (row + len < size && grid[row + len][col] !== EMPTY) return false;
  }

  for (let i = 0; i < len; i++) {
    const r = direction === 'across' ? row : row + i;
    const c = direction === 'across' ? col + i : col;
    const cell = grid[r][c];

    if (cell === BLOCK) return false;
    if (cell !== EMPTY && cell !== word[i]) return false;

    if (cell === EMPTY) {
      if (direction === 'across') {
        if (r > 0 && grid[r - 1][c] !== EMPTY) return false;
        if (r < size - 1 && grid[r + 1][c] !== EMPTY) return false;
      } else {
        if (c > 0 && grid[r][c - 1] !== EMPTY) return false;
        if (c < size - 1 && grid[r][c + 1] !== EMPTY) return false;
      }
    }
  }

  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
): void {
  for (let i = 0; i < word.length; i++) {
    const r = direction === 'across' ? row : row + i;
    const c = direction === 'across' ? col + i : col;
    grid[r][c] = word[i];
  }
}

function findIntersections(
  grid: string[][],
  entry: WordEntry,
  usedWords: Set<string>,
): Candidate[] {
  if (usedWords.has(entry.word)) return [];

  const candidates: Candidate[] = [];
  const size = grid.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = grid[row][col];
      if (cell === EMPTY || cell === BLOCK) continue;

      for (let i = 0; i < entry.word.length; i++) {
        if (entry.word[i] !== cell) continue;

        const acrossCol = col - i;
        if (
          acrossCol >= 0 &&
          acrossCol + entry.word.length <= size &&
          canPlace(grid, entry.word, row, acrossCol, 'across')
        ) {
          candidates.push({
            entry,
            row,
            col: acrossCol,
            direction: 'across',
          });
        }

        const downRow = row - i;
        if (
          downRow >= 0 &&
          downRow + entry.word.length <= size &&
          canPlace(grid, entry.word, downRow, col, 'down')
        ) {
          candidates.push({
            entry,
            row: downRow,
            col,
            direction: 'down',
          });
        }
      }
    }
  }

  return candidates;
}

function fillBlocks(grid: string[][]): void {
  const size = grid.length;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === EMPTY) {
        grid[row][col] = BLOCK;
      }
    }
  }
}

function assignNumbers(placedWords: PlacedWord[]): void {
  const starts = new Map<string, number>();
  for (const pw of placedWords) {
    starts.set(`${pw.row},${pw.col}`, 0);
  }

  const sorted = [...starts.keys()].sort((a, b) => {
    const [ar, ac] = a.split(',').map(Number);
    const [br, bc] = b.split(',').map(Number);
    return ar !== br ? ar - br : ac - bc;
  });

  let num = 1;
  for (const key of sorted) {
    starts.set(key, num++);
  }

  for (const pw of placedWords) {
    pw.number = starts.get(`${pw.row},${pw.col}`) ?? 0;
  }

  placedWords.sort((a, b) => a.number - b.number || (a.direction === 'across' ? -1 : 1));
}

function targetWordCount(size: number): number {
  if (size <= 9) return 8;
  if (size <= 13) return 14;
  return 22;
}

export function generateCrossword(settings: PuzzleSettings): CrosswordPuzzle {
  const size = SIZE_MAP[settings.size];
  const database = loadWordDatabase(settings.language, settings.difficulty);
  const maxAttempts = 50;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const grid = createEmptyGrid(size);
    const placedWords: PlacedWord[] = [];
    const usedWords = new Set<string>();
    const words = shuffle(database.words).filter((w) => w.word.length <= size);

    const starters = words.filter((w) => w.word.length >= 3);
    if (starters.length === 0) continue;

    const first = starters[Math.floor(Math.random() * starters.length)];
    const firstRow = Math.floor(size / 2);
    const firstCol = Math.floor((size - first.word.length) / 2);

    if (!canPlace(grid, first.word, firstRow, firstCol, 'across')) continue;

    placeWord(grid, first.word, firstRow, firstCol, 'across');
    placedWords.push({
      word: first.word,
      clue: first.clue,
      row: firstRow,
      col: firstCol,
      direction: 'across',
      number: 0,
    });
    usedWords.add(first.word);

    const goal = targetWordCount(size);
    let stagnant = 0;

    while (placedWords.length < goal && stagnant < 80) {
      const shuffled = shuffle(words);
      let placed = false;

      for (const entry of shuffled) {
        if (entry.word.length < 2) continue;
        const candidates = findIntersections(grid, entry, usedWords);
        if (candidates.length === 0) continue;

        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        placeWord(grid, pick.entry.word, pick.row, pick.col, pick.direction);
        placedWords.push({
          word: pick.entry.word,
          clue: pick.entry.clue,
          row: pick.row,
          col: pick.col,
          direction: pick.direction,
          number: 0,
        });
        usedWords.add(pick.entry.word);
        placed = true;
        stagnant = 0;
        break;
      }

      if (!placed) stagnant++;
    }

    if (placedWords.length >= Math.max(4, Math.floor(goal * 0.5))) {
      fillBlocks(grid);
      assignNumbers(placedWords);
      return {
        grid,
        placedWords,
        size,
        language: settings.language,
        difficulty: settings.difficulty,
      };
    }
  }

  throw new Error('Could not generate a crossword. Try again or change settings.');
}

export function checkSolution(
  puzzle: CrosswordPuzzle,
  userGrid: string[][],
): boolean {
  for (let row = 0; row < puzzle.size; row++) {
    for (let col = 0; col < puzzle.size; col++) {
      if (puzzle.grid[row][col] === BLOCK) continue;
      if (userGrid[row][col].toUpperCase() !== puzzle.grid[row][col]) {
        return false;
      }
    }
  }
  return true;
}

export function createUserGrid(puzzle: CrosswordPuzzle): string[][] {
  return Array.from({ length: puzzle.size }, (_, row) =>
    Array.from({ length: puzzle.size }, (_, col) =>
      puzzle.grid[row][col] === BLOCK ? BLOCK : '',
    ),
  );
}

export function revealLetter(
  userGrid: string[][],
  puzzle: CrosswordPuzzle,
  row: number,
  col: number,
): string[][] {
  const next = userGrid.map((r) => [...r]);
  if (puzzle.grid[row][col] !== BLOCK) {
    next[row][col] = puzzle.grid[row][col];
  }
  return next;
}

export function revealWord(
  userGrid: string[][],
  puzzle: CrosswordPuzzle,
  placed: PlacedWord,
): string[][] {
  const next = userGrid.map((r) => [...r]);
  for (let i = 0; i < placed.word.length; i++) {
    const r = placed.direction === 'across' ? placed.row : placed.row + i;
    const c = placed.direction === 'across' ? placed.col + i : placed.col;
    next[r][c] = puzzle.grid[r][c];
  }
  return next;
}
