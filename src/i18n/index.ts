import type { Messages } from './types';
import { en } from './en';
import { extraToolFaqs } from '@/seo/extraToolFaqs';

export type { Messages, ToolLocale } from './types';
export { en } from './en';

export function getMessages(): Messages {
  return en;
}

export function resolveToolName(toolId: string, fallback: string): string {
  return en.tools[toolId]?.name ?? fallback;
}

export function resolveToolDescription(toolId: string, fallback: string): string {
  return en.tools[toolId]?.description ?? fallback;
}

export function resolveToolFaq(toolId: string): { q: string; a: string }[] | undefined {
  const merged = [...(en.tools[toolId]?.faq ?? []), ...(extraToolFaqs[toolId] ?? [])];
  return merged.length > 0 ? merged.slice(0, 7) : undefined;
}

export function resolveCategoryName(categoryId: string, fallback: string): string {
  return en.categories[categoryId]?.name ?? fallback;
}

export function resolveCategoryDescription(categoryId: string, fallback: string): string {
  return en.categories[categoryId]?.description ?? fallback;
}

export function resolveLabel(englishLabel: string): string {
  return englishLabel;
}

export function formatMessage(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));
}
