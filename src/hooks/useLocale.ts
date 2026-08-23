import { useContext } from 'react';
import { LocaleContext } from '@/i18n/LocaleContext';

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}
