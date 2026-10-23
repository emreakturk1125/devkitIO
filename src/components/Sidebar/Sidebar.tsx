import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ChevronRight,
  X,
  Sun,
  Moon,
  Braces,
  Code,
  Database,
  Type,
  Lock,
  Sparkles,
  Bug,
} from 'lucide-react';
import { getToolById, getCategoriesWithTools } from '@/registry/toolRegistry';
import type { ToolDefinition } from '@/types/tool';
import { useLocale } from '@/hooks/useLocale';
import { categoryPath, toolPath } from '@/seo/site';

interface SidebarProps {
  favoriteIds: string[];
  onToggleFavorite: (toolId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  selectedCategoryId?: string | null;
  selectedToolId?: string | null;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Braces,
  Code,
  Database,
  Type,
  Lock,
  Sparkles,
  Bug,
};

export const Sidebar: React.FC<SidebarProps> = ({
  favoriteIds,
  onToggleFavorite,
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  selectedCategoryId,
  selectedToolId,
}) => {
  const { t, toolName, categoryName } = useLocale();
  const categories = getCategoriesWithTools();

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const cat of categories) {
      initial[cat.id] = true;
    }
    return initial;
  });

  // Automatically expand the active category when navigating via URL or search
  useEffect(() => {
    if (selectedCategoryId) {
      setExpandedCategories((prev) =>
        prev[selectedCategoryId] ? prev : { ...prev, [selectedCategoryId]: true }
      );
    }
  }, [selectedCategoryId]);

  const favoriteTools = favoriteIds.map(id => getToolById(id)).filter(Boolean) as ToolDefinition[];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderToolList = (tools: ToolDefinition[]) => {
    if (tools.length === 0) {
      return <div className="px-5 py-2 text-sm text-[var(--sidebar-muted)] italic">{t.none}</div>;
    }

    return tools.map(tool => {
      const name = toolName(tool.id, tool.name);
      const isSelected = selectedToolId === tool.id;
      return (
        <div
          key={tool.id}
          className={`flex items-center group px-2 py-1.5 lg:py-1 mx-2 rounded transition-colors cursor-pointer ${
            isSelected
              ? 'bg-[var(--color-brand-500)]/15 text-[var(--color-brand-400)]'
              : 'hover:bg-[var(--bg-hover)]'
          }`}
        >
          <Link
            to={toolPath(tool.category, tool.id)}
            aria-current={isSelected ? 'page' : undefined}
            className={`flex-1 min-w-0 min-h-9 lg:min-h-0 flex items-center text-left text-sm truncate pl-3.5 ${
              isSelected
                ? 'font-semibold text-[var(--color-brand-400)]'
                : 'text-[var(--sidebar-item)] group-hover:text-[var(--sidebar-category)]'
            }`}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            title={name}
          >
            {name}
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(tool.id);
            }}
            className="p-2 lg:p-1 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:text-[var(--color-brand-400)] transition-opacity"
            aria-label={favoriteIds.includes(tool.id) ? t.removeFavorite : t.addFavorite}
          >
            <Star className={`w-3.5 h-3.5 ${favoriteIds.includes(tool.id) ? 'fill-current text-[var(--color-brand-500)] opacity-100' : 'text-[var(--sidebar-muted)]'}`} />
          </button>
        </div>
      );
    });
  };

  const sidebarContent = (
    <div className="flex h-full w-[min(19rem,85vw)] flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--bg-panel)] pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)]">
      <div className="flex items-center justify-between gap-2 p-4 border-b border-[var(--border-subtle)] lg:hidden">
        <span className="font-bold text-[var(--text-primary)]">{t.menu}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleTheme}
            className="min-h-9 min-w-9 rounded p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            title={t.toggleTheme}
            aria-label={t.toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 min-w-9 rounded p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            aria-label={t.exit}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4" aria-label="Developer tools">
        {favoriteTools.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-4 mb-2 text-xs font-semibold text-[var(--sidebar-heading)] uppercase tracking-wider">
              <Star className="w-3.5 h-3.5" /> {t.favorites}
            </div>
            {renderToolList(favoriteTools)}
          </div>
        )}

        <div className="mb-4">
          <div className="px-4 mb-2 text-xs font-semibold text-[var(--sidebar-heading)] uppercase tracking-wider">
            {t.allCategories}
          </div>
          {categories.map(category => {
            const IconComponent = CATEGORY_ICONS[category.icon];
            const isExpanded = Boolean(expandedCategories[category.id]);
            const isCategorySelected = selectedCategoryId === category.id && !selectedToolId;
            return (
              <div key={category.id} className="mb-1">
                <div
                  className={`flex min-h-10 items-center lg:min-h-0 mx-1 rounded transition-colors ${
                    isCategorySelected ? 'bg-[var(--color-brand-500)]/15' : 'hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <button
                    type="button"
                    className="flex shrink-0 items-center py-2 pl-3 pr-1.5 text-[var(--sidebar-muted)] hover:text-[var(--text-primary)] lg:py-1.5"
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={isExpanded}
                    aria-label={categoryName(category.id, category.name)}
                  >
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                  <Link
                    to={categoryPath(category.id)}
                    aria-current={isCategorySelected ? 'page' : undefined}
                    className={`min-w-0 flex-1 flex items-center gap-2 truncate py-2 pr-3 text-sm font-semibold lg:py-1.5 ${
                      selectedCategoryId === category.id
                        ? 'text-[var(--color-brand-400)]'
                        : 'text-[var(--sidebar-category)]'
                    }`}
                    onClick={() => {
                      setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
                      if (window.innerWidth < 1024) onClose();
                    }}
                  >
                    {IconComponent && (
                      <IconComponent className="h-3.5 w-3.5 shrink-0 opacity-80" />
                    )}
                    <span className="truncate">{categoryName(category.id, category.name)}</span>
                  </Link>
                </div>
                <div className={isExpanded ? 'mt-0.5' : 'hidden'} aria-hidden={!isExpanded}>
                  {renderToolList(category.tools)}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
