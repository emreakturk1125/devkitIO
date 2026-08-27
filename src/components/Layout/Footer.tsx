import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoriesWithTools } from '@/registry/toolRegistry';
import { useLocale } from '@/hooks/useLocale';

export const Footer: React.FC = () => {
  const { t, categoryName } = useLocale();
  const categories = getCategoriesWithTools();

  return (
    <footer className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
      <nav
        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)]"
        aria-label={t.allCategories}
      >
        <Link to="/" className="hover:text-[var(--text-primary)]">
          {t.home}
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/tools/${category.id}`}
            className="hover:text-[var(--text-primary)]"
          >
            {categoryName(category.id, category.name)}
          </Link>
        ))}
      </nav>
    </footer>
  );
};
