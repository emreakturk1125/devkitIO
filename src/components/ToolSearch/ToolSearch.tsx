import React, { useState, useEffect, useRef, useMemo } from 'react';
import { searchTools, getAllTools } from '@/registry/toolRegistry';
import { useLocale } from '@/hooks/useLocale';
import { getMessages } from '@/i18n';

interface ToolSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (categoryId: string, toolId: string) => void;
}

export const ToolSearch: React.FC<ToolSearchProps> = ({ isOpen, onClose, onSelectTool }) => {
  const { t, locale, toolName, toolDescription, categoryName } = useLocale();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return getAllTools().slice(0, 8);

    const englishHits = new Set(searchTools(query).map((tool) => tool.id));
    const messages = getMessages(locale);

    return getAllTools()
      .filter((tool) => {
        if (englishHits.has(tool.id)) return true;
        const localized = messages.tools[tool.id];
        const cat = messages.categories[tool.category];
        return (
          localized?.name.toLowerCase().includes(q) ||
          localized?.description.toLowerCase().includes(q) ||
          cat?.name.toLowerCase().includes(q) ||
          false
        );
      })
      .slice(0, 8);
  }, [query, locale]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, visibleResults.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + visibleResults.length) % Math.max(1, visibleResults.length));
      } else if (e.key === 'Enter' && visibleResults.length > 0) {
        e.preventDefault();
        const selected = visibleResults[selectedIndex];
        if (selected) {
          onSelectTool(selected.category, selected.id);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, visibleResults, selectedIndex, onSelectTool, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="search-overlay fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="slide-up w-full max-w-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <input
            ref={inputRef}
            type="text"
            className="text-input w-full bg-transparent text-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {visibleResults.length === 0 ? (
            <div className="p-4 text-center text-[var(--text-tertiary)]">{t.noToolsFound}</div>
          ) : (
            visibleResults.map((tool, index) => (
              <button
                key={tool.id}
                className={`w-full flex flex-col items-start p-3 rounded-lg transition-colors ${
                  index === selectedIndex ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]/50'
                }`}
                onClick={() => {
                  onSelectTool(tool.category, tool.id);
                  onClose();
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--text-primary)]">
                    {toolName(tool.id, tool.name)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-tertiary)]">
                    {categoryName(tool.category, tool.category)}
                  </span>
                </div>
                <span className="text-sm text-[var(--text-secondary)] mt-1 text-left">
                  {toolDescription(tool.id, tool.description)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
