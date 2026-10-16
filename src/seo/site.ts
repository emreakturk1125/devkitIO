import { META_DESCRIPTIONS } from './metaDescriptions.ts';

export const SITE_URL = 'https://devkitio.com';
export const SITE_NAME = 'DevKit';

export const BASE_TITLE = 'DevKit — Free Online Developer Tools';
export const BASE_DESCRIPTION =
  'Free online developer toolkit — JSON formatter, SQL formatter, Base64 encoder, GUID generator & 35+ tools. 100% client-side, nothing leaves your browser.';

export const INDEXABLE_ROBOTS =
  'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
export const NOINDEX_ROBOTS = 'noindex, follow';

const HIGH_PRIORITY_TOOLS = new Set([
  'jsonFormatter',
  'jsonToClass',
  'sqlFormatter',
  'base64',
  'guidGenerator',
  'diffCompare',
]);

export const TOOL_ID_TO_SLUG: Record<string, string> = {
  jsonFormatter: 'json-formatter',
  jsonMinifier: 'json-minifier',
  jsonValidator: 'json-validator',
  jsonToClass: 'json-to-class',
  jsonToTypeScript: 'json-to-typescript',
  jsonToXml: 'json-to-xml',
  jsonToYaml: 'json-to-yaml',
  jsonDiff: 'json-diff',
  classToJson: 'class-to-json',
  yamlFormatter: 'yaml-formatter',
  xmlFormatter: 'xml-formatter',
  javascriptFormatter: 'javascript-formatter',
  jqueryFormatter: 'jquery-formatter',
  typescriptFormatter: 'typescript-formatter',
  htmlFormatter: 'html-formatter',
  cssFormatter: 'css-formatter',
  sqlFormatter: 'sql-formatter',
  sqlInGenerator: 'sql-in-generator',
  sqlToCSharpClass: 'sql-to-csharp-class',
  columnToComma: 'column-to-comma',
  commaToColumn: 'comma-to-column',
  columnToQuoted: 'column-to-quoted',
  columnToSqlIn: 'column-to-sql-in',
  removeDuplicates: 'remove-duplicates',
  sortLines: 'sort-lines',
  removeEmptyLines: 'remove-empty-lines',
  trimLines: 'trim-lines',
  caseConverter: 'case-converter',
  wordCounter: 'word-counter',
  characterCounter: 'character-counter',
  base64: 'base64',
  guidGenerator: 'guid-generator',
  uuidGenerator: 'uuid-generator',
  passwordGenerator: 'password-generator',
  randomStringGenerator: 'random-string-generator',
  diffCompare: 'diff-compare',
  jwtDecoder: 'jwt-decoder',
  regexTester: 'regex-tester',
  httpStatusLookup: 'http-status-lookup',
};

export const SLUG_TO_TOOL_ID: Record<string, string> = Object.fromEntries(
  Object.entries(TOOL_ID_TO_SLUG).map(([id, slug]) => [slug, id])
);

export function toolSlug(toolId: string): string {
  return TOOL_ID_TO_SLUG[toolId] ?? toolId;
}

export function toolIdFromSlug(slug: string): string {
  return SLUG_TO_TOOL_ID[slug] ?? slug;
}

export function absoluteUrl(path: string): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function toolPath(categoryId: string, toolId: string): string {
  const slug = toolSlug(toolId);
  return `/tools/${categoryId}/${slug}`;
}

export function categoryPath(categoryId: string): string {
  return `/tools/${categoryId}`;
}

export function toolPriority(toolId: string): string {
  return HIGH_PRIORITY_TOOLS.has(toolId) ? '0.9' : '0.8';
}

const CUSTOM_TITLES: Record<string, string> = {
  jsonFormatter: 'Free JSON Formatter & Validator Online (100% Private) — DevKit',
  sqlFormatter: 'SQL Formatter & Beautifier Online — T-SQL, MySQL, PostgreSQL | DevKit',
  base64: 'Base64 Encode & Decode Online — Fast & UTF-8 Safe | DevKit',
  guidGenerator: 'Free GUID / UUID Generator Online (.NET & Batch) | DevKit',
  uuidGenerator: 'Online UUID v4 Generator — Cryptographically Secure | DevKit',
  diffCompare: 'Online Text Diff Checker — Compare Text & Code Differences | DevKit',
  jwtDecoder: 'JWT Decoder Online — Decode Header & Payload Safely | DevKit',
  jsonToClass: 'JSON to C#, TypeScript & Java Class Converter | DevKit',
  jsonMinifier: 'JSON Minifier Online — Compact JSON in One Click | DevKit',
  jsonValidator: 'JSON Validator & Syntax Checker Online — DevKit',
  caseConverter: 'Case Converter Online — camelCase, snake_case, PascalCase | DevKit',
  wordCounter: 'Word Counter & Character Count Tool Online | DevKit',
  passwordGenerator: 'Secure Password Generator Online — DevKit',
  regexTester: 'Regex Tester Online — Test Regular Expressions in Real Time | DevKit',
};

export function toolPageTitle(toolName: string, toolId?: string): string {
  if (toolId && CUSTOM_TITLES[toolId]) {
    return CUSTOM_TITLES[toolId];
  }
  return `Free ${toolName} Online (100% Client-Side) — ${SITE_NAME}`;
}

export function toolPageDescription(toolDescription: string, toolId?: string): string {
  if (toolId && META_DESCRIPTIONS[toolId]) return META_DESCRIPTIONS[toolId];
  if (toolDescription.includes('client-side') || toolDescription.includes('browser')) {
    return toolDescription;
  }
  return `${toolDescription} 100% client-side in your browser, no data leaves your device.`;
}

export function categoryPageTitle(categoryName: string): string {
  return `${categoryName} Tools — Free Online Developer Toolkit | ${SITE_NAME}`;
}

export function categoryPageDescription(categoryDescription: string): string {
  return `${categoryDescription}. Free online, fast & 100% client-side on DevKit.`;
}

