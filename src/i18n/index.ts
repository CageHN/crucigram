import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react';
import type { Language } from '../types';
import { en, type TranslationKeys } from './locales/en';
import { es } from './locales/es';
import { sv } from './locales/sv';

const translations: Record<Language, TranslationKeys> = { en, es, sv };

const I18nContext = createContext<{
  language: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
}>({
  language: 'en',
  t: (key) => key,
});

function resolve(obj: TranslationKeys, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : undefined;
}

function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    String(params[key] ?? `{{${key}}}`),
  );
}

export function I18nProvider({
  language,
  children,
}: {
  language: Language;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    const messages = translations[language];
    return {
      language,
      t: (key: string, params?: Record<string, string | number>) => {
        const text = resolve(messages, key);
        return text ? interpolate(text, params) : key;
      },
    };
  }, [language]);

  return createElement(I18nContext.Provider, { value }, children);
}

export function useTranslation() {
  return useContext(I18nContext);
}

export function translateError(
  language: Language,
  message: string,
): string {
  const t = (key: string, params?: Record<string, string | number>) => {
    const text = resolve(translations[language], key);
    return text ? interpolate(text, params) : key;
  };

  if (message.startsWith('Word database not found:')) {
    const key = message.replace('Word database not found: ', '');
    return t('errors.databaseNotFound', { key });
  }
  if (message === 'Could not generate a crossword. Try again or change settings.') {
    return t('errors.generationFailed');
  }
  return message;
}
