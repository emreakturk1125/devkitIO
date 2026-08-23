import React from 'react';
import type { ToolCategory } from '@/types/tool';
import { useLocale } from '@/hooks/useLocale';

interface CategorySelectorProps {
  value: string | null;
  onChange: (categoryId: string | null) => void;
  categories: ToolCategory[];
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, categories }) => {
  const { t, categoryName } = useLocale();

  return (
    <select
      className="select-field w-full px-3 py-2 rounded bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--color-brand-500)] outline-none transition-colors"
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="">{t.selectCategory}</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {categoryName(category.id, category.name)}
        </option>
      ))}
    </select>
  );
};
