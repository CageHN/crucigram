import { useCallback, useMemo, useState } from 'react';
import type { CrosswordPuzzle, PlacedWord, PuzzleSettings } from './types';
import {
  checkSolution,
  createUserGrid,
  generateCrossword,
  revealLetter,
  revealWord,
} from './lib/crosswordGenerator';
import { SettingsPanel } from './components/SettingsPanel';
import { CrosswordGrid } from './components/CrosswordGrid';
import { ClueList } from './components/ClueList';
import './App.css';

const DEFAULT_SETTINGS: PuzzleSettings = {
  language: 'en',
  difficulty: 'adult',
  size: 'standard',
};

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

export default function App() {
  const [settings, setSettings] = useState<PuzzleSettings>(DEFAULT_SETTINGS);
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [userGrid, setUserGrid] = useState<string[][] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [activeDirection, setActiveDirection] = useState<'across' | 'down'>('across');
  const [isSolved, setIsSolved] = useState(false);

  const activeWord = useMemo(() => {
    if (!puzzle || !activeCell) return null;
    const across = findWordAt(puzzle, activeCell.row, activeCell.col, 'across');
    const down = findWordAt(puzzle, activeCell.row, activeCell.col, 'down');
    if (activeDirection === 'across' && across) return across;
    if (activeDirection === 'down' && down) return down;
    return across ?? down;
  }, [puzzle, activeCell, activeDirection]);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setError(null);
    setIsSolved(false);

    requestAnimationFrame(() => {
      try {
        const newPuzzle = generateCrossword(settings);
        setPuzzle(newPuzzle);
        setUserGrid(createUserGrid(newPuzzle));
        setActiveCell(null);
        setActiveDirection('across');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Generation failed');
        setPuzzle(null);
        setUserGrid(null);
      } finally {
        setIsGenerating(false);
      }
    });
  }, [settings]);

  const handleCellChange = (row: number, col: number, value: string) => {
    if (!userGrid || !puzzle) return;
    const next = userGrid.map((r) => [...r]);
    next[row][col] = value;
    setUserGrid(next);
    if (checkSolution(puzzle, next)) {
      setIsSolved(true);
    } else {
      setIsSolved(false);
    }
  };

  const handleRevealLetter = () => {
    if (!puzzle || !userGrid || !activeCell) return;
    const next = revealLetter(userGrid, puzzle, activeCell.row, activeCell.col);
    setUserGrid(next);
    if (checkSolution(puzzle, next)) setIsSolved(true);
  };

  const handleRevealWord = (word: PlacedWord) => {
    if (!puzzle || !userGrid) return;
    const next = revealWord(userGrid, puzzle, word);
    setUserGrid(next);
    if (checkSolution(puzzle, next)) setIsSolved(true);
  };

  const handleClueClick = (word: PlacedWord) => {
    setActiveCell({ row: word.row, col: word.col });
    setActiveDirection(word.direction);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Crucigram</h1>
        <p className="tagline">Generate & solve crossword puzzles</p>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <SettingsPanel
            settings={settings}
            onChange={setSettings}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </aside>

        <section className="play-area">
          {error && <div className="error-banner">{error}</div>}

          {!puzzle && !error && (
            <div className="welcome">
              <div className="welcome-icon">✏️</div>
              <h2>Welcome to Crucigram</h2>
              <p>
                Choose your language, difficulty, and grid size, then hit
                Generate to create a random crossword puzzle.
              </p>
            </div>
          )}

          {puzzle && userGrid && (
            <>
              {isSolved && (
                <div className="success-banner">
                  Congratulations! You solved the puzzle!
                </div>
              )}
              <div className="puzzle-layout">
                <div className="grid-container">
                  <CrosswordGrid
                    puzzle={puzzle}
                    userGrid={userGrid}
                    onCellChange={handleCellChange}
                    activeCell={activeCell}
                    onActiveCellChange={setActiveCell}
                    activeDirection={activeDirection}
                    onDirectionChange={setActiveDirection}
                    selectedWord={activeWord}
                  />
                  <div className="grid-actions">
                    <button
                      type="button"
                      className="action-btn"
                      onClick={handleRevealLetter}
                      disabled={!activeCell}
                    >
                      Reveal Letter
                    </button>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={handleGenerate}
                    >
                      New Puzzle
                    </button>
                  </div>
                </div>
                <ClueList
                  placedWords={puzzle.placedWords}
                  activeWord={activeWord}
                  onClueClick={handleClueClick}
                  onRevealWord={handleRevealWord}
                />
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
