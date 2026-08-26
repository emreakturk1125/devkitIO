import React, { useState } from 'react';
import { Star, ChevronRight, X, Sun, Moon } from 'lucide-react';
import { getToolById, getCategoriesWithTools } from '@/registry/toolRegistry';
import type { ToolDefinition } from '@/types/tool';
import { useLocale } from '@/hooks/useLocale';

interface SidebarProps {
  favoriteIds: string[];
  onSelectTool: (categoryId: string, toolId: string) => void;
  onToggleFavorite: (toolId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  favoriteIds,
  onSelectTool,
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
          <button
            className="flex-1 min-w-0 min-h-9 lg:min-h-0 text-left text-sm text-[var(--sidebar-item)] group-hover:text-[var(--sidebar-category)] truncate pl-4"
            onClick={() => {
              onSelectTool(tool.category, tool.id);
              if (window.innerWidth < 1024) onClose();
            }}
            title={name}
          >
            {name}
          </button>
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

      <div className="flex-1 overflow-y-auto py-4">
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
              <button
                className="flex min-h-10 w-full items-center px-4 py-2 text-sm font-semibold text-[var(--sidebar-category)] hover:bg-[var(--bg-hover)] lg:min-h-0 lg:py-1.5"
                onClick={() => toggleCategory(category.id)}
              >
                <ChevronRight className={`w-3.5 h-3.5 mr-1.5 text-[var(--sidebar-muted)] transition-transform ${expandedCategories[category.id] ? 'rotate-90' : ''}`} />
                {categoryName(category.id, category.name)}
              </button>
              {expandedCategories[category.id] && (
                <div className="mt-1">
                  {renderToolList(category.tools)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
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
