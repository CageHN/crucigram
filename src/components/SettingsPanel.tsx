import type { Difficulty, Language, PuzzleSettings, Size } from '../types';
import { useTranslation } from '../i18n';

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
  const { t } = useTranslation();

  const languageLabels: Record<Language, string> = {
    en: t('labels.language.en'),
    es: t('labels.language.es'),
    sv: t('labels.language.sv'),
  };

  const difficultyLabels: Record<Difficulty, string> = {
    kid: t('labels.difficulty.kid'),
    adult: t('labels.difficulty.adult'),
    wise: t('labels.difficulty.wise'),
  };

  const sizeLabels: Record<Size, string> = {
    small: t('labels.size.small'),
    standard: t('labels.size.standard'),
    large: t('labels.size.large'),
  };

  return (
    <div className="settings-panel">
      <OptionGroup<Language>
        label={t('settings.language')}
        value={settings.language}
        options={['en', 'es', 'sv']}
        labels={languageLabels}
        onChange={(language) => onChange({ ...settings, language })}
      />
      <OptionGroup<Difficulty>
        label={t('settings.difficulty')}
        value={settings.difficulty}
        options={['kid', 'adult', 'wise']}
        labels={difficultyLabels}
        onChange={(difficulty) => onChange({ ...settings, difficulty })}
      />
      <OptionGroup<Size>
        label={t('settings.size')}
        value={settings.size}
        options={['small', 'standard', 'large']}
        labels={sizeLabels}
        onChange={(size) => onChange({ ...settings, size })}
      />
      <button
        type="button"
        className="generate-btn"
        onClick={onGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? t('settings.generating') : t('settings.generate')}
      </button>
    </div>
  );
}
