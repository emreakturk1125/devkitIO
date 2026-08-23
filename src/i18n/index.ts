import type { Locale, Messages } from './types';
import { en } from './en';
import { tr } from './tr';

export type { Locale, Messages, ToolLocale } from './types';
export { en } from './en';
export { tr } from './tr';

export const DEFAULT_LOCALE: Locale = 'en';

const dictionaries: Record<Locale, Messages> = { en, tr };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? en;
}

export function resolveLabel(locale: Locale, englishLabel: string): string {
  if (locale === 'en') return englishLabel;
  return getMessages(locale).labels[englishLabel] ?? englishLabel;
}

export function resolveToolName(locale: Locale, toolId: string, fallback: string): string {
  return getMessages(locale).tools[toolId]?.name ?? fallback;
}

export function resolveToolDescription(locale: Locale, toolId: string, fallback: string): string {
  return getMessages(locale).tools[toolId]?.description ?? fallback;
}

export function resolveCategoryName(locale: Locale, categoryId: string, fallback: string): string {
  return getMessages(locale).categories[categoryId]?.name ?? fallback;
}

export function resolveCategoryDescription(
  locale: Locale,
  categoryId: string,
  fallback: string
): string {
  return getMessages(locale).categories[categoryId]?.description ?? fallback;
}

export function formatMessage(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));
}
