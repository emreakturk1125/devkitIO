import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Search, Sun, Moon } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

interface HeaderProps {
  onSearchOpen: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchOpen, theme, onToggleTheme }) => {
  const { t, locale, setLocale } = useLocale();

  return (
    <header className="flex h-12 items-center justify-between px-4 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)]">
      <Link
        to="/"
        className="flex items-center gap-2 text-[var(--text-primary)]"
        aria-label="DevKit home"
      >
        <Wrench className="w-5 h-5 text-[var(--text-secondary)]" />
        <span className="font-sans font-bold text-lg">DevKit</span>
      </Link>
      <div className="flex items-center gap-3">
        <div className="px-2 py-1 text-xs font-semibold rounded bg-[var(--color-success)] text-[var(--bg-app)]">
          {t.clientSide}
        </div>
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] text-[var(--text-secondary)] transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">{t.searchTools}</span>
          <kbd className="ml-0 sm:ml-2 font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">⌘K</kbd>
        </button>
        <div
          className="flex items-center rounded border border-[var(--border-default)] bg-[var(--bg-input)] overflow-hidden"
          title={t.language}
          role="group"
          aria-label={t.language}
        >
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={`px-2 py-1 text-xs font-semibold transition-colors ${
              locale === 'en'
                ? 'bg-[var(--color-brand-500)] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLocale('tr')}
            className={`px-2 py-1 text-xs font-semibold transition-colors ${
              locale === 'tr'
                ? 'bg-[var(--color-brand-500)] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            TR
          </button>
        </div>
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"
          title={t.toggleTheme}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
