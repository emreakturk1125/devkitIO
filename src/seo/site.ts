import { CATEGORY_META_DESCRIPTIONS, META_DESCRIPTIONS } from './metaDescriptions.ts';

export const SITE_URL = 'https://devkitio.com';
export const SITE_NAME = 'DevKit';

export const BASE_TITLE = 'DevKit — Free Online Developer Tools for JSON, SQL & Base64';
export const BASE_DESCRIPTION =
  'Free online developer tools: format JSON and SQL, encode Base64, generate GUIDs, compare text and more. Everything runs in your browser; input is not uploaded.';

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
  'jwtDecoder',
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
  // JSON & Data Conversion
  jsonFormatter: 'JSON Formatter, Beautifier & Pretty Print Online — DevKit',
  jsonMinifier: 'JSON Minifier & Compressor Online — One-Click Compact | DevKit',
  jsonValidator: 'JSON Validator & Syntax Checker Online (Line Errors) — DevKit',
  jsonToClass: 'JSON to C#, TypeScript & Java Class Converter Online | DevKit',
  jsonToTypeScript: 'JSON to TypeScript Interface & Type Generator Online | DevKit',
  jsonToXml: 'JSON to XML Converter Online — Custom Root & Escaping | DevKit',
  jsonToYaml: 'JSON to YAML Converter Online — Kubernetes & Docker | DevKit',
  jsonDiff: 'JSON Diff & Compare Tool Online — Semantic Path Diff | DevKit',
  classToJson: 'C#, TypeScript & Java Class to Sample JSON Generator | DevKit',

  // Code Formatters
  yamlFormatter: 'YAML Formatter, Beautifier & Validator Online | DevKit',
  xmlFormatter: 'XML Formatter, Beautifier & Pretty Print Online (SVG) | DevKit',
  javascriptFormatter: 'JavaScript Formatter & Beautifier Online (Prettier) | DevKit',
  jqueryFormatter: 'jQuery & Legacy JS Formatter / Beautifier Online | DevKit',
  typescriptFormatter: 'TypeScript & TSX Formatter Online — Prettier Beautifier | DevKit',
  htmlFormatter: 'HTML Formatter & Beautifier Online — Indent Markup | DevKit',
  cssFormatter: 'CSS Formatter & Beautifier Online — Clean Stylesheets | DevKit',

  // SQL Tools
  sqlFormatter: 'SQL Formatter & Beautifier Online — T-SQL, MySQL, Postgres | DevKit',
  sqlInGenerator: 'SQL IN Clause Generator from List Online — Dedup & Quote | DevKit',
  sqlToCSharpClass: 'SQL CREATE TABLE to C# POCO Class Generator Online | DevKit',

  // Text & List Utilities
  columnToComma: 'Column to Comma Separated List Converter Online | DevKit',
  commaToColumn: 'Comma to Column Converter Online — Split CSV to Lines | DevKit',
  columnToQuoted: 'Column to Quoted List Converter Online — Single/Double | DevKit',
  columnToSqlIn: 'Excel Column to SQL IN Clause Converter Online | DevKit',
  removeDuplicates: 'Remove Duplicate Lines Online — Deduplicate Text List | DevKit',
  sortLines: 'Sort Lines Alphabetically & Numerically Online | DevKit',
  removeEmptyLines: 'Remove Empty & Blank Lines from Text Online | DevKit',
  trimLines: 'Trim Whitespace from Lines Online — Leading & Trailing | DevKit',
  caseConverter: 'Case Converter Online — camelCase, snake_case, PascalCase | DevKit',
  wordCounter: 'Word Counter, Line & Sentence Count Tool Online | DevKit',
  characterCounter: 'Character Counter Online — Letters, Digits & No-Spaces | DevKit',

  // Encoding
  base64: 'Base64 Encode & Decode Online — UTF-8 Safe Converter | DevKit',
  jwtDecoder: 'JWT Decoder & Inspector Online — Decode Header & Payload | DevKit',

  // Generators
  guidGenerator: 'Free GUID / UUID Generator Online (.NET D, N, B, P & Batch) | DevKit',
  uuidGenerator: 'UUID v4 Generator Online — RFC 4122 Bulk & Compact | DevKit',
  passwordGenerator: 'Secure Random Password Generator Online (Web Crypto) — DevKit',
  randomStringGenerator: 'Random String & API Key Generator Online (Hex/Alpha) | DevKit',

  // Inspect & Debug
  diffCompare: 'Online Text Diff Checker — Compare Text & Code Side-by-Side | DevKit',
  regexTester: 'Regex Tester & Debugger Online — JS RegExp Match & Groups | DevKit',
  httpStatusLookup: 'HTTP Status Code Lookup & Reference (1xx–5xx & Cloudflare) | DevKit',
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

/** Category landing-page H1 headings so every category has a rich, descriptive title. */
const CATEGORY_HEADINGS: Record<string, string> = {
  json: 'JSON & Data Conversion Tools',
  formatters: 'Code Formatters',
  sql: 'SQL Formatting & Generation Tools',
  text: 'Text & List Utilities',
  encoding: 'Encoding & JWT Token Tools',
  generators: 'Online Generators',
  inspect: 'Debugging & Testing Tools',
};

export function categoryHeading(categoryId: string, categoryName: string): string {
  return CATEGORY_HEADINGS[categoryId] ?? `${categoryName} Tools`;
}

/** Pass the value returned by `categoryHeading`. */
export function categoryPageTitle(heading: string): string {
  return `${heading} — Free & Client-Side | ${SITE_NAME}`;
}

export function categoryPageDescription(categoryDescription: string, categoryId?: string): string {
  if (categoryId && CATEGORY_META_DESCRIPTIONS[categoryId]) return CATEGORY_META_DESCRIPTIONS[categoryId];
  return `${categoryDescription}. Free online, fast & 100% client-side on DevKit.`;
}

