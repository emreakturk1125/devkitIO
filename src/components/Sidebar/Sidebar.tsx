import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, X, Sun, Moon } from 'lucide-react';
import { getToolById, getCategoriesWithTools } from '@/registry/toolRegistry';
import type { ToolDefinition } from '@/types/tool';
import { useLocale } from '@/hooks/useLocale';

interface SidebarProps {
  favoriteIds: string[];
  onToggleFavorite: (toolId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  favoriteIds,
  onToggleFavorite,
  isOpen,
  onClose,
  theme,
  onToggleTheme,
}) => {
  const { t, locale, setLocale, toolName, categoryName } = useLocale();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const favoriteTools = favoriteIds.map(id => getToolById(id)).filter(Boolean) as ToolDefinition[];
  const categories = getCategoriesWithTools();

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
      return (
        <div key={tool.id} className="flex items-center group px-2 py-1.5 lg:py-1 mx-2 rounded hover:bg-[var(--bg-hover)] cursor-pointer">
          <Link
            to={`/tools/${tool.category}/${tool.id}`}
            className="flex-1 min-w-0 min-h-9 lg:min-h-0 flex items-center text-left text-sm text-[var(--sidebar-item)] group-hover:text-[var(--sidebar-category)] truncate pl-4"
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
    <div className="flex h-full w-[min(16rem,85vw)] flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--bg-panel)] pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)]">
      <div className="flex items-center justify-between gap-2 p-4 border-b border-[var(--border-subtle)] lg:hidden">
        <span className="font-bold text-[var(--text-primary)]">{t.menu}</span>
        <div className="flex items-center gap-1">
          <div
            className="flex items-center overflow-hidden rounded border border-[var(--border-default)] bg-[var(--bg-input)]"
            role="group"
            aria-label={t.language}
          >
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`min-h-9 px-2.5 text-xs font-semibold ${
                locale === 'en'
                  ? 'bg-[var(--color-brand-500)] text-white'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale('tr')}
              className={`min-h-9 px-2.5 text-xs font-semibold ${
                locale === 'tr'
                  ? 'bg-[var(--color-brand-500)] text-white'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              TR
            </button>
          </div>
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
          {categories.map(category => (
            <div key={category.id} className="mb-1">
              <div className="flex min-h-10 items-center hover:bg-[var(--bg-hover)] lg:min-h-0">
                <button
                  type="button"
                  className="flex shrink-0 items-center py-2 pl-4 pr-1 text-[var(--sidebar-muted)] lg:py-1.5"
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={Boolean(expandedCategories[category.id])}
                  aria-label={categoryName(category.id, category.name)}
                >
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expandedCategories[category.id] ? 'rotate-90' : ''}`} />
                </button>
                <Link
                  to={`/tools/${category.id}`}
                  className="min-w-0 flex-1 truncate py-2 pr-4 text-sm font-semibold text-[var(--sidebar-category)] lg:py-1.5"
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                >
                  {categoryName(category.id, category.name)}
                </Link>
              </div>
              {expandedCategories[category.id] && (
                <div className="mt-1">
                  {renderToolList(category.tools)}
                </div>
              )}
            </div>
          ))}
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
