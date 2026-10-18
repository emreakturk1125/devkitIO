/**
 * Home page copy shared by the React app and `scripts/prerender-seo.mjs`.
 * Pure data module (no imports) so Node can load it with type stripping.
 */

export interface HomeFaqItem {
  q: string;
  a: string;
}

export function homeAboutParagraphs(toolCount: number, categoryCount: number): string[] {
  return [
    `DevKit is a free set of ${toolCount} browser-based developer tools in ${categoryCount} categories: JSON, XML and YAML formatting and conversion, SQL formatting and generators, JavaScript, TypeScript, HTML and CSS formatters, Base64 and JWT decoding, GUID, UUID and password generators, text and list utilities, a diff checker, a regex tester and an HTTP status lookup.`,
    'Pick a category or tool, paste or type your input into the editor, and read the result in the output panel. Most tools update as you type; the SQL, JavaScript, TypeScript, HTML, CSS and jQuery formatters run when you press Transform.',
    'The tools run in your browser with JavaScript, and the code does not send your input to a server. Press Ctrl+K (or \u2318K) to search all tools.',
  ];
}

export const homeFaq: HomeFaqItem[] = [
  {
    q: 'Is DevKit free?',
    a: 'Yes. Every tool is free to use and does not require an account or an installation.',
  },
  {
    q: 'Is my input uploaded anywhere?',
    a: 'No. The tools run in your browser and the code does not send your input to a server. The page does load its web fonts from Google Fonts.',
  },
  {
    q: 'Which tool should I start with?',
    a: 'Common starting points are the JSON Formatter, SQL Formatter, Base64 Encoder/Decoder, GUID Generator and Diff Compare. Use search (Ctrl+K) to find any other tool by name.',
  },
];
