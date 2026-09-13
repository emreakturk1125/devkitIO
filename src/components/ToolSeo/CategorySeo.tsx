import React from 'react';
import { getCategoryById } from '@/registry/categoryRegistry';
import { getToolsByCategory } from '@/registry/toolRegistry';
import { useLocale } from '@/hooks/useLocale';
import { Link } from 'react-router-dom';

interface CategorySeoProps {
  categoryId: string;
}

export const CategorySeo: React.FC<CategorySeoProps> = ({ categoryId }) => {
  const { categoryName, categoryDescription, toolName, toolDescription } = useLocale();
  const category = getCategoryById(categoryId);
  const tools = getToolsByCategory(categoryId);

  if (!category) return null;

  const name = categoryName(categoryId, category.name);
  const description = categoryDescription(categoryId, category.description);

  return (
    <section aria-labelledby={`category-heading-${categoryId}`}>
      <h1
        id={`category-heading-${categoryId}`}
        className="text-sm font-semibold text-[var(--text-primary)] sm:text-base mb-1"
      >
        {name} Tools
      </h1>
      <p className="max-w-3xl min-w-0 text-xs leading-relaxed text-[var(--text-secondary)] mb-3">
        {description}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {tools.map(tool => (
          <Link 
            key={tool.id} 
            to={`/tools/${categoryId}/${tool.id}`}
            className="flex flex-col p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors min-w-0"
          >
            <span className="text-xs font-semibold text-[var(--color-brand-500)] mb-1 truncate">
              {toolName(tool.id, tool.name)}
            </span>
            <span className="text-[11px] text-[var(--text-tertiary)] line-clamp-2">
              {toolDescription(tool.id, tool.description)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
