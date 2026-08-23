import type { ToolDefinition, ToolCategory } from '@/types/tool';
import { categories, getCategoryById } from './categoryRegistry';

// ─── Tool Registry ────────────────────────────────────────────────────────

const toolMap = new Map<string, ToolDefinition>();
let _initialized = false;

/**
 * Register a tool in the global registry.
 * Also adds it to the corresponding category's tools array.
 */
export function registerTool(tool: ToolDefinition): void {
  if (toolMap.has(tool.id)) {
    console.warn(`Tool "${tool.id}" is already registered. Skipping.`);
    return;
  }
  toolMap.set(tool.id, tool);

  const category = getCategoryById(tool.category);
  if (category) {
    category.tools.push(tool);
  } else {
    console.warn(`Category "${tool.category}" not found for tool "${tool.id}".`);
  }
}

/**
 * Get a tool by its ID.
 */
export function getToolById(id: string): ToolDefinition | undefined {
  return toolMap.get(id);
}

/**
 * Get all tools for a given category ID.
 */
export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  const category = getCategoryById(categoryId);
  return category?.tools ?? [];
}

/**
 * Get all registered tools.
 */
export function getAllTools(): ToolDefinition[] {
  return Array.from(toolMap.values());
}

/**
 * Get all categories with their tools populated.
 */
export function getCategoriesWithTools(): ToolCategory[] {
  return categories.filter((cat) => cat.tools.length > 0);
}

/**
 * Search tools by keyword, name or description.
 */
export function searchTools(query: string): ToolDefinition[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();
  const results: Array<{ tool: ToolDefinition; score: number }> = [];

  for (const tool of toolMap.values()) {
    let score = 0;

    // Exact name match gets highest score
    if (tool.name.toLowerCase() === q) {
      score = 100;
    }
    // Name starts with query
    else if (tool.name.toLowerCase().startsWith(q)) {
      score = 80;
    }
    // Name contains query
    else if (tool.name.toLowerCase().includes(q)) {
      score = 60;
    }
    // Keywords match
    else if (tool.keywords.some((kw) => kw.toLowerCase().includes(q))) {
      score = 40;
    }
    // Description contains query
    else if (tool.description.toLowerCase().includes(q)) {
      score = 20;
    }

    if (score > 0) {
      results.push({ tool, score });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .map((r) => r.tool);
}

/**
 * Detect recommended tools for given input.
 */
export function detectTools(input: string): ToolDefinition[] {
  if (!input.trim()) return [];

  const results: ToolDefinition[] = [];

  for (const tool of toolMap.values()) {
    if (tool.detect && tool.detect(input)) {
      results.push(tool);
    }
  }

  return results.slice(0, 6); // Max 6 recommendations
}

/** Kategori içi görüntüleme sırası (sidebar + tool selector). */
const CATEGORY_TOOL_ORDER: Record<string, string[]> = {
  sql: [
    'sqlFormatter',
    'sqlInGenerator',
    'sqlToCSharpClass',
  ],
  data: [
    'jsonFormatter',
    'jsonMinifier',
    'jsonValidator',
    'jsonToClass',
    'jsonToTypeScript',
    'jsonToXml',
    'jsonToYaml',
    'jsonDiff',
    'classToJson',
    'yamlFormatter',
    'xmlFormatter',
    'javascriptFormatter',
    'jqueryFormatter',
    'typescriptFormatter',
    'htmlFormatter',
    'cssFormatter',
  ],
  text: [
    'columnToComma',
    'commaToColumn',
    'columnToQuoted',
    'columnToSqlIn',
    'removeDuplicates',
    'sortLines',
    'removeEmptyLines',
    'trimLines',
    'caseConverter',
    'wordCounter',
    'characterCounter',
  ],
  generators: [
    'guidGenerator',
    'uuidGenerator',
    'passwordGenerator',
    'randomStringGenerator',
  ],
  debugging: [
    'diffCompare',
    'regexTester',
    'jwtDecoder',
    'httpStatusLookup',
  ],
};

function sortCategoryTools(): void {
  for (const category of categories) {
    const preferred = CATEGORY_TOOL_ORDER[category.id];
    if (!preferred) {
      category.tools.sort((a, b) => a.name.localeCompare(b.name));
      continue;
    }
    const rank = new Map(preferred.map((id, index) => [id, index]));
    category.tools.sort((a, b) => {
      const ai = rank.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const bi = rank.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      if (ai !== bi) return ai - bi;
      return a.name.localeCompare(b.name);
    });
  }
}

// ─── Lazy Registration ────────────────────────────────────────────────────

/**
 * Initialize the registry by importing and registering all tools.
 * Called once at app startup.
 */
export async function initializeRegistry(): Promise<void> {
  if (_initialized) return;

  // Import all tool modules eagerly (they are small definition objects).
  // The heavy processing libraries inside them are lazily loaded at runtime.
  const toolModules = import.meta.glob<{ default: ToolDefinition }>(
    '../tools/**/*.ts',
    { eager: true }
  );

  for (const path in toolModules) {
    const mod = toolModules[path];
    if (mod.default) {
      registerTool(mod.default);
    }
  }

  sortCategoryTools();
  _initialized = true;
}
