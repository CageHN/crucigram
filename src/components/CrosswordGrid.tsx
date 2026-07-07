import { useCallback, useEffect, useRef } from 'react';
import type { CrosswordPuzzle, PlacedWord } from '../types';

const BLOCK = '#';

interface CrosswordGridProps {
  puzzle: CrosswordPuzzle;
  userGrid: string[][];
  onCellChange: (row: number, col: number, value: string) => void;
  activeCell: { row: number; col: number } | null;
  onActiveCellChange: (cell: { row: number; col: number } | null) => void;
  activeDirection: 'across' | 'down';
  onDirectionChange: (dir: 'across' | 'down') => void;
  selectedWord: PlacedWord | null;
}

function getCellNumber(puzzle: CrosswordPuzzle, row: number, col: number): number | null {
  const pw = puzzle.placedWords.find((w) => w.row === row && w.col === col);
  return pw ? pw.number : null;
}

function findWordAt(
  puzzle: CrosswordPuzzle,
  row: number,
  col: number,
  direction: 'across' | 'down',
): PlacedWord | null {
  return (
    puzzle.placedWords.find((w) => {
      if (w.direction !== direction) return false;
      if (direction === 'across') {
        return w.row === row && col >= w.col && col < w.col + w.word.length;
      }
      return w.col === col && row >= w.row && row < w.row + w.word.length;
    }) ?? null
  );
}

export function CrosswordGrid({
  puzzle,
  userGrid,
  onCellChange,
  activeCell,
  onActiveCellChange,
  activeDirection,
  onDirectionChange,
  selectedWord,
}: CrosswordGridProps) {
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const isActive = useCallback(
    (row: number, col: number) => {
      if (!activeCell) return false;
      if (!selectedWord) {
        return activeCell.row === row && activeCell.col === col;
      }
      if (selectedWord.direction === 'across') {
        return (
          selectedWord.row === row &&
          col >= selectedWord.col &&
          col < selectedWord.col + selectedWord.word.length
        );
      }
      return (
        selectedWord.col === col &&
        row >= selectedWord.row &&
        row < selectedWord.row + selectedWord.word.length
      );
    },
    [activeCell, selectedWord],
  );

  const focusCell = (row: number, col: number) => {
    const key = `${row},${col}`;
    const input = inputRefs.current.get(key);
    input?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    row: number,
    col: number,
  ) => {
    const size = puzzle.size;

    if (e.key === 'Backspace' && !userGrid[row][col]) {
      e.preventDefault();
      if (activeDirection === 'across' && col > 0) {
        let prevCol = col - 1;
        while (prevCol >= 0 && puzzle.grid[row][prevCol] === BLOCK) prevCol--;
        if (prevCol >= 0 && puzzle.grid[row][prevCol] !== BLOCK) {
          onActiveCellChange({ row, col: prevCol });
          focusCell(row, prevCol);
        }
      } else if (activeDirection === 'down' && row > 0) {
        let prevRow = row - 1;
        while (prevRow >= 0 && puzzle.grid[prevRow][col] === BLOCK) prevRow--;
        if (prevRow >= 0 && puzzle.grid[prevRow][col] !== BLOCK) {
          onActiveCellChange({ row: prevRow, col });
          focusCell(prevRow, col);
        }
      }
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onDirectionChange('across');
      let next = col + 1;
      while (next < size && puzzle.grid[row][next] === BLOCK) next++;
      if (next < size && puzzle.grid[row][next] !== BLOCK) {
        onActiveCellChange({ row, col: next });
        focusCell(row, next);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onDirectionChange('across');
      let prev = col - 1;
      while (prev >= 0 && puzzle.grid[row][prev] === BLOCK) prev--;
      if (prev >= 0 && puzzle.grid[row][prev] !== BLOCK) {
        onActiveCellChange({ row, col: prev });
        focusCell(row, prev);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onDirectionChange('down');
      let next = row + 1;
      while (next < size && puzzle.grid[next][col] === BLOCK) next++;
      if (next < size && puzzle.grid[next][col] !== BLOCK) {
        onActiveCellChange({ row: next, col });
        focusCell(next, col);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onDirectionChange('down');
      let prev = row - 1;
      while (prev >= 0 && puzzle.grid[prev][col] === BLOCK) prev--;
      if (prev >= 0 && puzzle.grid[prev][col] !== BLOCK) {
        onActiveCellChange({ row: prev, col });
        focusCell(prev, col);
      }
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    const val = e.target.value.slice(-1).toUpperCase().replace(/[^A-Z]/g, '');
    onCellChange(row, col, val);

    if (val) {
      const size = puzzle.size;
      if (activeDirection === 'across') {
        let next = col + 1;
        while (next < size && puzzle.grid[row][next] === BLOCK) next++;
        if (next < size && puzzle.grid[row][next] !== BLOCK) {
          onActiveCellChange({ row, col: next });
          focusCell(row, next);
        }
      } else {
        let next = row + 1;
        while (next < size && puzzle.grid[next][col] === BLOCK) next++;
        if (next < size && puzzle.grid[next][col] !== BLOCK) {
          onActiveCellChange({ row: next, col });
          focusCell(next, col);
        }
      }
    }
  };

  useEffect(() => {
    if (activeCell) {
      focusCell(activeCell.row, activeCell.col);
    }
  }, [activeCell, selectedWord]);

  const cellSize = puzzle.size <= 9 ? 36 : puzzle.size <= 13 ? 30 : 26;

  return (
    <div
      className="crossword-grid"
      style={{
        gridTemplateColumns: `repeat(${puzzle.size}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: puzzle.size }, (_, row) =>
        Array.from({ length: puzzle.size }, (_, col) => {
          const isBlock = puzzle.grid[row][col] === BLOCK;
          const number = getCellNumber(puzzle, row, col);
          const active = isActive(row, col);

          if (isBlock) {
            return <div key={`${row}-${col}`} className="cell block" />;
          }

          return (
            <div
              key={`${row}-${col}`}
              className={`cell ${active ? 'active' : ''}`}
              onClick={() => {
                onActiveCellChange({ row, col });
                const across = findWordAt(puzzle, row, col, 'across');
                const down = findWordAt(puzzle, row, col, 'down');
                if (across && down) {
                  onDirectionChange(
                    activeDirection === 'across' ? 'down' : 'across',
                  );
                } else if (down) {
                  onDirectionChange('down');
                } else {
                  onDirectionChange('across');
                }
              }}
            >
              {number !== null && (
                <span className="cell-number">{number}</span>
              )}
              <input
                ref={(el) => {
                  if (el) inputRefs.current.set(`${row},${col}`, el);
                }}
                type="text"
                maxLength={1}
                value={userGrid[row][col] === BLOCK ? '' : userGrid[row][col]}
                onChange={(e) => handleInput(e, row, col)}
                onKeyDown={(e) => handleKeyDown(e, row, col)}
                onFocus={() => onActiveCellChange({ row, col })}
                className="cell-input"
                aria-label={`Row ${row + 1}, column ${col + 1}`}
              />
            </div>
          );
        }),
      )}
    </div>
  );
}
