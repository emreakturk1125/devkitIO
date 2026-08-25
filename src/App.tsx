import { useState, useCallback, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';

import { Header } from '@/components/Layout/Header';
import { CategorySelector } from '@/components/CategorySelector/CategorySelector';
import { ToolSelector } from '@/components/ToolSelector/ToolSelector';
import { ToolOptions } from '@/components/ToolOptions/ToolOptions';
import InputPanel from '@/components/InputPanel/InputPanel';
import OutputPanel from '@/components/OutputPanel/OutputPanel';
import DiffView from '@/components/DiffView/DiffView';
import { ToolSearch } from '@/components/ToolSearch/ToolSearch';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { ToolSeo } from '@/components/ToolSeo/ToolSeo';
import { NotFound } from '@/components/NotFound/NotFound';

import { useToolbox } from '@/hooks/useToolbox';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/hooks/useFavorites';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSeo } from '@/hooks/useSeo';
import { copyToClipboard } from '@/services/clipboard/clipboard';
import { getToolById, getToolsByCategory, initializeRegistry } from '@/registry/toolRegistry';
import { getAllCategories, getCategoryById } from '@/registry/categoryRegistry';
import {
  BASE_DESCRIPTION,
  BASE_TITLE,
  categoryPageDescription,
  categoryPageTitle,
  categoryPath,
  toolPageDescription,
  toolPageTitle,
  toolPath,
} from '@/seo/site';

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

function getRouteKind(pathname: string): 'home' | 'category' | 'tool' | 'unknown' {
  if (pathname === '/') return 'home';
  if (/^\/tools\/[^/]+$/.test(pathname)) return 'category';
  if (/^\/tools\/[^/]+\/[^/]+$/.test(pathname)) return 'tool';
  return 'unknown';
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
  const { t, toolName, toolDescription, categoryName, categoryDescription } = useLocale();

  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registryReady, setRegistryReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ category?: string; toolId?: string }>();
  const routeKind = getRouteKind(location.pathname);

  const isNotFound = useMemo(() => {
    if (routeKind === 'unknown') return true;
    if (!registryReady) return false;
    if (routeKind === 'category') {
      const category = getCategoryById(params.category ?? '');
      return !category || getToolsByCategory(category.id).length === 0;
    }
    if (routeKind === 'tool') {
      const tool = getToolById(params.toolId ?? '');
      return !tool || tool.category !== params.category;
    }
    return false;
  }, [registryReady, routeKind, params.category, params.toolId]);

  const seo = useMemo(() => {
    if (isNotFound) {
      return {
        title: `${t.pageNotFound} — DevKit`,
        description: t.pageNotFoundHint,
        path: location.pathname,
        noindex: true,
      };
    }
    if (selectedTool) {
      const name = toolName(selectedTool.id, selectedTool.name);
      const desc = toolDescription(selectedTool.id, selectedTool.description);
      return {
        title: toolPageTitle(name),
        description: toolPageDescription(desc),
        path: toolPath(selectedTool.category, selectedTool.id),
      };
    }
    if (selectedCategoryId) {
      const category = getCategoryById(selectedCategoryId);
      const name = categoryName(selectedCategoryId, category?.name ?? selectedCategoryId);
      const desc = categoryDescription(selectedCategoryId, category?.description ?? '');
      return {
        title: categoryPageTitle(name),
        description: categoryPageDescription(desc),
        path: categoryPath(selectedCategoryId),
      };
    }
    return {
      title: BASE_TITLE,
      description: BASE_DESCRIPTION,
      path: '/',
    };
  }, [
    isNotFound,
    selectedTool,
    selectedCategoryId,
    location.pathname,
    t.pageNotFound,
    t.pageNotFoundHint,
    toolName,
    toolDescription,
    categoryName,
    categoryDescription,
  ]);

  useSeo(seo);

  // Initialize registry on mount
  useEffect(() => {
    initializeRegistry().then(() => setRegistryReady(true));
  }, []);

  // Sync URL params to state on load
  useEffect(() => {
    if (!registryReady || isNotFound) return;
    if (params.category && params.toolId) {
      const tool = getToolById(params.toolId);
      if (tool && tool.category === params.category) {
        selectCategoryAndTool(params.category, params.toolId);
      }
    } else if (params.category) {
      const category = getCategoryById(params.category);
      if (category) selectCategory(params.category);
    } else {
      selectCategory(null);
    }
  }, [registryReady, params.category, params.toolId, isNotFound]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state to URL
  useEffect(() => {
    if (!registryReady || isNotFound) return;
    if (selectedCategoryId && selectedToolId) {
      navigate(`/tools/${selectedCategoryId}/${selectedToolId}`, { replace: true });
    } else if (selectedCategoryId) {
      navigate(`/tools/${selectedCategoryId}`, { replace: true });
    } else if (location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [selectedCategoryId, selectedToolId, registryReady, navigate, isNotFound, location.pathname]);

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
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden" aria-label="Developer tool workspace">
          {isNotFound ? (
            <NotFound />
          ) : (
            <>
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

            {selectedTool ? (
              <ToolSeo
                toolId={selectedTool.id}
                name={toolName(selectedTool.id, selectedTool.name)}
                description={toolDescription(selectedTool.id, selectedTool.description)}
              />
            ) : (
              <section>
                <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                  {selectedCategoryId
                    ? categoryName(
                        selectedCategoryId,
                        getCategoryById(selectedCategoryId)?.name ?? selectedCategoryId
                      )
                    : t.homeHeading}
                </h1>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {selectedCategoryId
                    ? categoryDescription(
                        selectedCategoryId,
                        getCategoryById(selectedCategoryId)?.description ?? ''
                      )
                    : t.homeIntro}
                </p>
              </section>
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
            </>
          )}
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
          <Route path="*" element={<ToolboxPage />} />
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  );
}
