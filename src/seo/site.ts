export const SITE_URL = 'https://devkitio.com';
export const SITE_NAME = 'DevKit';

export const BASE_TITLE = 'DevKit — Free Online Developer Tools';
export const BASE_DESCRIPTION =
  'Free online developer toolkit — JSON formatter, SQL formatter, Base64 encoder, GUID generator, diff compare & 20+ tools. 100% client-side, your data never leaves your browser.';

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

export function absoluteUrl(path: string): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function toolPath(categoryId: string, toolId: string): string {
  return `/tools/${categoryId}/${toolId}`;
}

export function categoryPath(categoryId: string): string {
  return `/tools/${categoryId}`;
}

export function toolPriority(toolId: string): string {
  return HIGH_PRIORITY_TOOLS.has(toolId) ? '0.9' : '0.8';
}

export function toolPageTitle(toolName: string): string {
  return `${toolName} — DevKit | Free Online Developer Tools`;
}

export function toolPageDescription(toolDescription: string): string {
  return toolDescription;
}

export function categoryPageTitle(categoryName: string): string {
  return `${categoryName} Tools — DevKit | Free Online Developer Tools`;
}

export function categoryPageDescription(categoryDescription: string): string {
  return `${categoryDescription} Free online, 100% client-side on DevKit.`;
}
