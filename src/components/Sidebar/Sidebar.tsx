import React, { useState } from 'react';
import { Star, ChevronRight, X } from 'lucide-react';
import { getToolById, getCategoriesWithTools } from '@/registry/toolRegistry';
import type { ToolDefinition } from '@/types/tool';
import { useLocale } from '@/hooks/useLocale';

interface SidebarProps {
  favoriteIds: string[];
  onSelectTool: (categoryId: string, toolId: string) => void;
  onToggleFavorite: (toolId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  favoriteIds,
  onSelectTool,
  onToggleFavorite,
  isOpen,
  onClose,
}) => {
  const { t, toolName, categoryName } = useLocale();
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
        <div key={tool.id} className="flex items-center group px-2 py-1 mx-2 rounded hover:bg-[var(--bg-hover)] cursor-pointer">
          <button
            className="flex-1 min-w-0 text-left text-sm text-[var(--sidebar-item)] group-hover:text-[var(--sidebar-category)] truncate pl-4"
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
            className="p-1 shrink-0 opacity-0 group-hover:opacity-100 hover:text-[var(--color-brand-400)] transition-opacity"
          >
            <Star className={`w-3.5 h-3.5 ${favoriteIds.includes(tool.id) ? 'fill-current text-[var(--color-brand-500)] opacity-100' : 'text-[var(--sidebar-muted)]'}`} />
          </button>
        </div>
      );
    });
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[var(--bg-panel)] border-r border-[var(--border-subtle)] w-64 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] lg:hidden">
        <span className="font-bold text-[var(--text-primary)]">{t.menu}</span>
        <button onClick={onClose} className="p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded">
          <X className="w-5 h-5" />
        </button>
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
                className="flex items-center w-full px-4 py-1.5 text-sm font-semibold text-[var(--sidebar-category)] hover:bg-[var(--bg-hover)]"
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
