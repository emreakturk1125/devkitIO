import { useState, useLayoutEffect, useCallback } from 'react';
import { readStorage, writeStorage } from '@/services/storage/storage';

export type Theme = 'dark' | 'light';

function applyThemeToDom(next: Theme): void {
  const root = document.documentElement;
  // Disable CSS transitions for one frame so the entire page + editors swap in sync
  root.classList.add('theme-switching');
  if (next === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', next === 'light' ? '#ffffff' : '#141418');
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove('theme-switching');
    });
  });
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return readStorage<Theme>('theme', 'dark');
  });

  useLayoutEffect(() => {
    applyThemeToDom(theme);
    writeStorage('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      applyThemeToDom(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    applyThemeToDom(newTheme);
    setThemeState(newTheme);
  }, []);

  return { theme, toggleTheme, setTheme };
}
