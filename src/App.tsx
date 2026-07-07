import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { I18nProvider, translateError, useTranslation } from './i18n';
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

function AppContent({
  settings,
  onSettingsChange,
}: {
  settings: PuzzleSettings;
  onSettingsChange: (settings: PuzzleSettings) => void;
}) {
  const { t } = useTranslation();
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [userGrid, setUserGrid] = useState<string[][] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [activeDirection, setActiveDirection] = useState<'across' | 'down'>('across');
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    document.title = `${t('appTitle')} — ${t('tagline')}`;
    document.documentElement.lang = settings.language;
  }, [settings.language, t]);

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
        const message =
          err instanceof Error ? err.message : t('generationFailed');
        setError(translateError(settings.language, message));
        setPuzzle(null);
        setUserGrid(null);
      } finally {
        setIsGenerating(false);
      }
    });
  }, [settings, t]);

  const handleCellChange = (row: number, col: number, value: string) => {
    if (!userGrid || !puzzle) return;
    const next = userGrid.map((r) => [...r]);
    next[row][col] = value;
    setUserGrid(next);
    setIsSolved(checkSolution(puzzle, next));
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
        <h1>{t('appTitle')}</h1>
        <p className="tagline">{t('tagline')}</p>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <SettingsPanel
            settings={settings}
            onChange={onSettingsChange}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </aside>

        <section className="play-area">
          {error && <div className="error-banner">{error}</div>}

          {!puzzle && !error && (
            <div className="welcome">
              <div className="welcome-icon">✏️</div>
              <h2>{t('welcomeTitle')}</h2>
              <p>{t('welcomeText')}</p>
            </div>
          )}

          {puzzle && userGrid && (
            <>
              {isSolved && (
                <div className="success-banner">{t('congratulations')}</div>
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
                      {t('revealLetter')}
                    </button>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={handleGenerate}
                    >
                      {t('newPuzzle')}
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

export default function App() {
  const [settings, setSettings] = useState<PuzzleSettings>(DEFAULT_SETTINGS);

  return (
    <I18nProvider language={settings.language}>
      <AppContent settings={settings} onSettingsChange={setSettings} />
    </I18nProvider>
  );
}
