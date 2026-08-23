import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LOCALE,
  formatMessage,
  getMessages,
  resolveCategoryDescription,
  resolveCategoryName,
  resolveLabel,
  resolveToolDescription,
  resolveToolName,
  type Locale,
  type Messages,
} from '@/i18n';
import { readStorage, writeStorage } from '@/services/storage/storage';

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  messages: Messages;
  t: Messages['ui'];
  label: (englishLabel: string) => string;
  toolName: (toolId: string, fallback: string) => string;
  toolDescription: (toolId: string, fallback: string) => string;
  categoryName: (categoryId: string, fallback: string) => string;
  categoryDescription: (categoryId: string, fallback: string) => string;
  format: (template: string, vars: Record<string, string | number>) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = readStorage<Locale>('locale', DEFAULT_LOCALE);
    return stored === 'tr' || stored === 'en' ? stored : DEFAULT_LOCALE;
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    writeStorage('locale', locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === 'en' ? 'tr' : 'en'));
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const messages = getMessages(locale);
    return {
      locale,
      setLocale,
      toggleLocale,
      messages,
      t: messages.ui,
      label: (englishLabel) => resolveLabel(locale, englishLabel),
      toolName: (toolId, fallback) => resolveToolName(locale, toolId, fallback),
      toolDescription: (toolId, fallback) => resolveToolDescription(locale, toolId, fallback),
      categoryName: (categoryId, fallback) => resolveCategoryName(locale, categoryId, fallback),
      categoryDescription: (categoryId, fallback) =>
        resolveCategoryDescription(locale, categoryId, fallback),
      format: formatMessage,
    };
  }, [locale, setLocale, toggleLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
