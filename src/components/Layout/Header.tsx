import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Search, Sun, Moon, Menu } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

interface HeaderProps {
  onSearchOpen: () => void;
  onMenuOpen: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchOpen, onMenuOpen, theme, onToggleTheme }) => {
  const { t, locale, setLocale } = useLocale();

  return (
    <header className="flex min-h-12 shrink-0 items-center justify-between gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)] px-3 pt-[env(safe-area-inset-top)] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:px-4">
      <div className="flex min-w-0 items-center gap-1.5">
        <button
          type="button"
          className="btn-ghost lg:hidden !px-2 min-h-9 min-w-9"
          onClick={onMenuOpen}
          aria-label={t.menu}
        >
          <Menu size={18} />
        </button>
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2 text-[var(--text-primary)]"
          aria-label="DevKit home"
        >
          <Wrench className="h-5 w-5 shrink-0 text-[var(--text-secondary)]" />
          <span className="truncate font-sans text-lg font-bold">DevKit</span>
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div className="hidden px-2 py-1 text-xs font-semibold rounded bg-[var(--color-success)] text-[var(--bg-app)] md:block">
          {t.clientSide}
        </div>
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex min-h-9 min-w-9 items-center justify-center gap-2 rounded border border-[var(--border-default)] bg-[var(--bg-input)] px-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] sm:min-w-0 sm:px-3 sm:py-1.5"
          aria-label={t.searchTools}
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">{t.searchTools}</span>
          <kbd className="hidden font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] sm:inline-flex">⌘K</kbd>
        </button>
        <div
          className="hidden items-center overflow-hidden rounded border border-[var(--border-default)] bg-[var(--bg-input)] sm:flex"
          title={t.language}
          role="group"
          aria-label={t.language}
        >
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={`min-h-9 px-2.5 text-xs font-semibold transition-colors ${
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
            className={`min-h-9 px-2.5 text-xs font-semibold transition-colors ${
              locale === 'tr'
                ? 'bg-[var(--color-brand-500)] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            TR
          </button>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          className="hidden min-h-9 min-w-9 rounded p-1.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] sm:inline-flex"
          title={t.toggleTheme}
          aria-label={t.toggleTheme}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
};
