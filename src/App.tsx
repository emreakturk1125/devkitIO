import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

import { Header } from '@/components/Layout/Header';
import { CategorySelector } from '@/components/CategorySelector/CategorySelector';
import { ToolSelector } from '@/components/ToolSelector/ToolSelector';
import { ToolOptions } from '@/components/ToolOptions/ToolOptions';
import InputPanel from '@/components/InputPanel/InputPanel';
import OutputPanel from '@/components/OutputPanel/OutputPanel';
import DiffView from '@/components/DiffView/DiffView';
import { ToolSearch } from '@/components/ToolSearch/ToolSearch';
import { Sidebar } from '@/components/Sidebar/Sidebar';

import { useToolbox } from '@/hooks/useToolbox';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/hooks/useFavorites';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { copyToClipboard } from '@/services/clipboard/clipboard';
import { initializeRegistry } from '@/registry/toolRegistry';
import { getAllCategories } from '@/registry/categoryRegistry';

import type { EditorLanguage } from '@/components/Editor/CodeEditor';
import { Play, Star, Menu } from 'lucide-react';
import { LocaleProvider } from '@/i18n/LocaleContext';
import { useLocale } from '@/hooks/useLocale';

// ─── Map tool inputType to editor language ─────────────────────────────────
function getEditorLanguage(inputType?: string): EditorLanguage {
  switch (inputType) {
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    case 'sql':
      return 'sql';
    case 'code':
      return 'javascript';
    default:
      return 'text';
  }
}

// ─── Main Toolbox Page ──────────────────────────────────────────────────────
function ToolboxPage() {
  const {
    selectedCategoryId,
    selectedToolId,
    selectedTool,
    availableTools,
    toolOptions,
    input,
    secondaryInput,
    output,
    error,
    isProcessing,
    selectCategory,
    selectTool,
    selectCategoryAndTool,
    setInput,
    setSecondaryInput,
    setOption,
    transform,
    clearInput,
  } = useToolbox();

  const { theme, toggleTheme } = useTheme();
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  const { t, toolDescription } = useLocale();

  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registryReady, setRegistryReady] = useState(false);

  const navigate = useNavigate();
  const params = useParams<{ category?: string; toolId?: string }>();

  // Initialize registry on mount
  useEffect(() => {
    initializeRegistry().then(() => setRegistryReady(true));
  }, []);

  // Sync URL params to state on load
  useEffect(() => {
    if (!registryReady) return;
    if (params.category && params.toolId) {
      selectCategoryAndTool(params.category, params.toolId);
    } else if (params.category) {
      selectCategory(params.category);
    }
  }, [registryReady, params.category, params.toolId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state to URL
  useEffect(() => {
    if (!registryReady) return;
    if (selectedCategoryId && selectedToolId) {
      navigate(`/tools/${selectedCategoryId}/${selectedToolId}`, { replace: true });
    } else if (selectedCategoryId) {
      navigate(`/tools/${selectedCategoryId}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [selectedCategoryId, selectedToolId, registryReady, navigate]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onTransform: transform,
    onCopyOutput: useCallback(() => {
      if (output) copyToClipboard(output);
    }, [output]),
    onSearch: useCallback(() => setSearchOpen(true), []),
    onClearInput: clearInput,
  });

  const categories = getAllCategories();
  const isDualInput = selectedTool?.inputType === 'dual';
  const inputDisabled = selectedTool?.requiresInput === false;
  const inputLang =
    selectedTool?.id === 'typescriptFormatter'
      ? 'typescript'
      : getEditorLanguage(selectedTool?.inputType);
  const outputLang =
    selectedTool?.id === 'typescriptFormatter'
      ? 'typescript'
      : getEditorLanguage(selectedTool?.outputType ?? selectedTool?.inputType);

  if (!registryReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg-app)]">
        <div className="text-[var(--text-secondary)] text-sm">{t.loadingTools}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-app)]">
      {/* Header */}
      <Header
        onSearchOpen={() => setSearchOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          favoriteIds={favoriteIds}
          onSelectTool={selectCategoryAndTool}
          onToggleFavorite={toggleFavorite}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Controls Area */}
          <div className="p-4 lg:p-5 space-y-4 shrink-0 overflow-y-auto">
            {/* Mobile menu button */}
            <button
              className="btn-ghost lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={16} />
              {t.menu}
            </button>

            {/* Category & Tool Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="field-label">{t.category}</label>
                <CategorySelector
                  value={selectedCategoryId}
                  onChange={selectCategory}
                  categories={categories}
                />
              </div>
              <div>
                <label className="field-label">
                  {t.tool}
                  {selectedTool && (
                    <button
                      className="ml-2 inline-flex"
                      onClick={() => toggleFavorite(selectedTool.id)}
                      title={isFavorite(selectedTool.id) ? t.removeFavorite : t.addFavorite}
                    >
                      <Star
                        size={12}
                        className={isFavorite(selectedTool.id)
                          ? 'fill-current text-[var(--color-brand-500)]'
                          : 'text-[var(--text-tertiary)]'}
                      />
                    </button>
                  )}
                </label>
                <ToolSelector
                  value={selectedToolId}
                  onChange={selectTool}
                  tools={availableTools}
                  disabled={!selectedCategoryId}
                />
              </div>
            </div>

            {/* Tool Description */}
            {selectedTool && (
              <p className="text-xs text-[var(--text-tertiary)]">
                {toolDescription(selectedTool.id, selectedTool.description)}
              </p>
            )}

            {/* Dynamic Options */}
            {selectedTool?.options && selectedTool.options.length > 0 && (
              <div>
                <label className="field-label mb-2">{t.options}</label>
                <ToolOptions
                  options={selectedTool.options}
                  values={toolOptions}
                  onChange={setOption}
                />
              </div>
            )}
          </div>

          {/* Editor Area */}
          <div className="flex-1 min-h-0 p-4 lg:p-5 pt-0 lg:pt-0 flex flex-col gap-3">
            {isDualInput ? (
              /* Dual input for Diff tool — inline diff highlighting, no separate output */
              <div className="flex-1 min-h-[200px] flex flex-col">
                <DiffView
                  originalValue={input}
                  modifiedValue={secondaryInput}
                  onOriginalChange={setInput}
                  onModifiedChange={setSecondaryInput}
                  theme={theme}
                  diffType={(toolOptions.diffType as 'lines' | 'words' | 'chars') ?? 'lines'}
                  ignoreWhitespace={toolOptions.ignoreWhitespace === true}
                />
              </div>
            ) : (
              /* Standard single-input layout */
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
                <InputPanel
                  value={input}
                  onChange={setInput}
                  language={inputLang}
                  theme={theme}
                  onClear={clearInput}
                  disabled={inputDisabled}
                />
                <OutputPanel
                  value={output}
                  error={error}
                  language={outputLang}
                  theme={theme}
                  isProcessing={isProcessing}
                />
              </div>
            )}

            {/* Action Buttons */}
            {selectedTool && !selectedTool.autoTransform && (
              <div className="flex items-center justify-center gap-3 py-2 shrink-0">
                <button
                  className="btn-primary"
                  onClick={transform}
                  disabled={
                    isProcessing ||
                    (selectedTool.requiresInput !== false &&
                      !input.trim() &&
                      selectedTool.inputType !== 'text')
                  }
                >
                  <Play size={14} />
                  {isProcessing
                    ? t.processing
                    : selectedTool.requiresInput === false
                      ? t.generate
                      : t.transform}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Tool Search Modal */}
      <ToolSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={selectCategoryAndTool}
      />
    </div>
  );
}

// ─── App Root with Router ───────────────────────────────────────────────────
export default function App() {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ToolboxPage />} />
          <Route path="/tools/:category" element={<ToolboxPage />} />
          <Route path="/tools/:category/:toolId" element={<ToolboxPage />} />
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  );
}
