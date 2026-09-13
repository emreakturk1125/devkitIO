import React from 'react';
import { getAllCategories } from '@/registry/categoryRegistry';
import { useLocale } from '@/hooks/useLocale';
import { Link } from 'react-router-dom';
import { SITE_NAME } from '@/seo/site';

export const HomeSeo: React.FC = () => {
  const { categoryName, categoryDescription, t } = useLocale();
  const categories = getAllCategories();

  return (
    <section aria-labelledby="home-heading">
      <h1
        id="home-heading"
        className="text-sm font-semibold text-[var(--text-primary)] sm:text-base mb-1"
      >
        {t.homeHeading || `${SITE_NAME} — Developer Toolkit`}
      </h1>
      <p className="max-w-3xl min-w-0 text-xs leading-relaxed text-[var(--text-secondary)] mb-3">
        {t.homeIntro || `Free online developer toolkit featuring ${categories.length}+ tool categories. 100% client-side processing ensuring your data never leaves your browser.`}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            to={`/tools/${cat.id}`}
            className="flex flex-col p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors min-w-0"
          >
            <span className="text-xs font-semibold text-[var(--color-brand-500)] mb-1 truncate">
              {categoryName(cat.id, cat.name)}
            </span>
            <span className="text-[11px] text-[var(--text-tertiary)] line-clamp-2">
              {categoryDescription(cat.id, cat.description)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
