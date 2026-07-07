import type { PlacedWord } from '../types';

interface ClueListProps {
  placedWords: PlacedWord[];
  activeWord: PlacedWord | null;
  onClueClick: (word: PlacedWord) => void;
  onRevealWord: (word: PlacedWord) => void;
}

function ClueSection({
  title,
  words,
  activeWord,
  onClueClick,
  onRevealWord,
}: {
  title: string;
  words: PlacedWord[];
  activeWord: PlacedWord | null;
  onClueClick: (word: PlacedWord) => void;
  onRevealWord: (word: PlacedWord) => void;
}) {
  if (words.length === 0) return null;

  return (
    <div className="clue-section">
      <h3>{title}</h3>
      <ol className="clue-list">
        {words.map((w) => (
          <li
            key={`${w.number}-${w.direction}`}
            className={`clue-item ${
              activeWord === w ? 'active' : ''
            }`}
          >
            <button
              type="button"
              className="clue-text"
              onClick={() => onClueClick(w)}
            >
              <span className="clue-number">{w.number}.</span> {w.clue}
            </button>
            <button
              type="button"
              className="reveal-btn"
              onClick={() => onRevealWord(w)}
              title="Reveal word"
            >
              ?
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ClueList({
  placedWords,
  activeWord,
  onClueClick,
  onRevealWord,
}: ClueListProps) {
  const across = placedWords.filter((w) => w.direction === 'across');
  const down = placedWords.filter((w) => w.direction === 'down');

  return (
    <div className="clues-panel">
      <ClueSection
        title="Across"
        words={across}
        activeWord={activeWord}
        onClueClick={onClueClick}
        onRevealWord={onRevealWord}
      />
      <ClueSection
        title="Down"
        words={down}
        activeWord={activeWord}
        onClueClick={onClueClick}
        onRevealWord={onRevealWord}
      />
    </div>
  );
}
