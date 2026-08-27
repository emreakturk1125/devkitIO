import { useState, useCallback, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';

import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
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
  SITE_NAME,
  categoryPageDescription,
  categoryPageTitle,
  categoryPath,
  toolPageDescription,
  toolPageTitle,
  toolPath,
} from '@/seo/site';

import type { EditorLanguage } from '@/components/Editor/CodeEditor';
import { Play, Star } from 'lucide-react';
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

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function getRouteKind(pathname: string): 'home' | 'category' | 'tool' | 'unknown' {
  const path = normalizePath(pathname);
  if (path === '/') return 'home';
  if (/^\/tools\/[^/]+$/.test(path)) return 'category';
  if (/^\/tools\/[^/]+\/[^/]+$/.test(path)) return 'tool';
  return 'unknown';
}

function parseRouteParams(pathname: string): { category?: string; toolId?: string } {
  const path = normalizePath(pathname);
  const toolMatch = path.match(/^\/tools\/([^/]+)\/([^/]+)$/);
  if (toolMatch) return { category: toolMatch[1], toolId: toolMatch[2] };
  const categoryMatch = path.match(/^\/tools\/([^/]+)$/);
  if (categoryMatch) return { category: categoryMatch[1] };
  return {};
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
  const { t, locale, toolName, toolDescription, categoryName, categoryDescription } = useLocale();

  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registryReady, setRegistryReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const routeParams = useParams<{ category?: string; toolId?: string }>();
  const parsedParams = parseRouteParams(location.pathname);
  const params = {
    category: routeParams.category ?? parsedParams.category,
    toolId: routeParams.toolId ?? parsedParams.toolId,
  };
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
      const catName = categoryName(
        selectedTool.category,
        getCategoryById(selectedTool.category)?.name ?? selectedTool.category
      );
      return {
        title: toolPageTitle(name),
        description: toolPageDescription(desc),
        path: toolPath(selectedTool.category, selectedTool.id),
        breadcrumbs: [
          { name: SITE_NAME, path: '/' },
          { name: catName, path: categoryPath(selectedTool.category) },
          { name, path: toolPath(selectedTool.category, selectedTool.id) },
        ],
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
        breadcrumbs: [
          { name: SITE_NAME, path: '/' },
          { name, path: categoryPath(selectedCategoryId) },
        ],
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

  useSeo({ ...seo, locale });

  // Initialize registry on mount
  useEffect(() => {
    initializeRegistry().then(() => setRegistryReady(true));
  }, []);

  // Cloudflare serves directory index.html with a trailing slash on refresh.
  useEffect(() => {
    if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
      navigate(`${normalizePath(location.pathname)}${location.search}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

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
      <div className="flex items-center justify-center h-dvh bg-[var(--bg-app)]">
        <div className="text-[var(--text-secondary)] text-sm">{t.loadingTools}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh min-w-0 overflow-x-hidden bg-[var(--bg-app)]">
      {/* Header */}
      <Header
        onSearchOpen={() => setSearchOpen(true)}
        onMenuOpen={() => setSidebarOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Main Content */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto md:overflow-hidden" aria-label="Developer tool workspace">
          {isNotFound ? (
            <NotFound />
          ) : (
            <>
          {/* Controls Area */}
          <div className="p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4 shrink-0 md:overflow-y-auto">
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
          <div className="flex-1 min-h-0 max-md:min-h-[32rem] p-3 sm:p-4 lg:p-5 pt-0 flex flex-col gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {isDualInput ? (
              /* Dual input for Diff tool — inline diff highlighting, no separate output */
              <div className="flex-1 min-h-[200px] max-md:min-h-[28rem] flex flex-col">
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
              <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-3 max-md:auto-rows-[minmax(16rem,1fr)] md:grid-cols-2">
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
                  className="btn-primary w-full min-h-11 sm:w-auto"
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

      <Footer />

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
