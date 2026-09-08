import {
  createContext,
  useMemo,
  type ReactNode,
} from 'react';
import {
  formatMessage,
  getMessages,
  resolveCategoryDescription,
  resolveCategoryName,
  resolveLabel,
  resolveToolDescription,
  resolveToolName,
  type Messages,
} from '@/i18n';

export interface LocaleContextValue {
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
  const value = useMemo<LocaleContextValue>(() => {
    const messages = getMessages();
    return {
      messages,
      t: messages.ui,
      label: (englishLabel) => resolveLabel(englishLabel),
      toolName: (toolId, fallback) => resolveToolName(toolId, fallback),
      toolDescription: (toolId, fallback) => resolveToolDescription(toolId, fallback),
      categoryName: (categoryId, fallback) => resolveCategoryName(categoryId, fallback),
      categoryDescription: (categoryId, fallback) =>
        resolveCategoryDescription(categoryId, fallback),
      format: formatMessage,
    };
  }, []);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
