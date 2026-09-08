import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { getCategoriesWithTools } from '@/registry/toolRegistry';

const POPULAR_TOOLS = [
  { id: 'jsonFormatter', category: 'json' },
  { id: 'sqlFormatter', category: 'formatters' },
  { id: 'base64', category: 'encoding' },
  { id: 'guidGenerator', category: 'generators' },
  { id: 'diffCompare', category: 'inspect' },
  { id: 'wordCounter', category: 'text' },
];

export const NotFound: React.FC = () => {
  const { t, toolName, categoryName } = useLocale();
  const categories = getCategoriesWithTools();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-8 text-center">
      {/* 404 Badge */}
      <span className="text-5xl font-bold text-[var(--text-tertiary)] select-none">404</span>

      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{t.pageNotFound}</h1>
      <p className="max-w-md text-sm break-words text-[var(--text-secondary)]">{t.pageNotFoundHint}</p>

      <Link to="/" className="btn-primary mt-1">
        {t.goHome}
      </Link>

      {/* Popular Tools */}
      <nav className="mt-4 w-full max-w-lg" aria-label="Popular tools">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          Popular Tools
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_TOOLS.map(({ id, category }) => (
            <Link
              key={id}
              to={`/tools/${category}/${id}`}
              className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--color-brand-500)] hover:text-[var(--text-primary)]"
            >
              {toolName(id, id)}
            </Link>
          ))}
        </div>
      </nav>

      {/* Category Navigation */}
      <nav className="w-full max-w-lg" aria-label="Tool categories">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          Categories
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/tools/${cat.id}`}
              className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--color-brand-500)] hover:text-[var(--text-primary)]"
            >
              {categoryName(cat.id, cat.name)}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

