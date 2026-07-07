import type { Difficulty, Language, PuzzleSettings, Size } from '../types';
import {
  DIFFICULTY_LABELS,
  LANGUAGE_LABELS,
  SIZE_LABELS,
} from '../types';

interface SettingsPanelProps {
  settings: PuzzleSettings;
  onChange: (settings: PuzzleSettings) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

function OptionGroup<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  labels: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="option-group">
      <legend>{label}</legend>
      <div className="option-buttons">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`option-btn ${value === opt ? 'active' : ''}`}
            onClick={() => onChange(opt)}
          >
            {labels[opt]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function SettingsPanel({
  settings,
  onChange,
  onGenerate,
  isGenerating,
}: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <OptionGroup<Language>
        label="Language"
        value={settings.language}
        options={['en', 'es', 'sv']}
        labels={LANGUAGE_LABELS}
        onChange={(language) => onChange({ ...settings, language })}
      />
      <OptionGroup<Difficulty>
        label="Difficulty"
        value={settings.difficulty}
        options={['kid', 'adult', 'wise']}
        labels={DIFFICULTY_LABELS}
        onChange={(difficulty) => onChange({ ...settings, difficulty })}
      />
      <OptionGroup<Size>
        label="Size"
        value={settings.size}
        options={['small', 'standard', 'large']}
        labels={SIZE_LABELS}
        onChange={(size) => onChange({ ...settings, size })}
      />
      <button
        type="button"
        className="generate-btn"
        onClick={onGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating…' : 'Generate Crossword'}
      </button>
    </div>
  );
}
