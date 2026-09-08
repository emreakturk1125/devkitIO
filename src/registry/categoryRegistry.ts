import type { ToolCategory, ToolDefinition } from '@/types/tool';

// ─── Category Definitions ─────────────────────────────────────────────────

export const categories: ToolCategory[] = [
  {
    id: 'json',
    name: 'JSON & Data Conversion',
    description: 'JSON, XML, YAML formatting, validation and data conversion tools',
    icon: 'Braces',
    tools: [],
  },
  {
    id: 'formatters',
    name: 'Code Formatters',
    description: 'JavaScript, TypeScript, HTML, CSS and SQL code formatting tools',
    icon: 'Code',
    tools: [],
  },
  {
    id: 'sql',
    name: 'SQL',
    description: 'SQL generation and transformation tools',
    icon: 'Database',
    tools: [],
  },
  {
    id: 'text',
    name: 'Text & List Utils',
    description: 'Text manipulation, list conversion, sorting and counting tools',
    icon: 'Type',
    tools: [],
  },
  {
    id: 'encoding',
    name: 'Encoding',
    description: 'Base64, URL, HTML encoding and decoding tools',
    icon: 'Lock',
    tools: [],
  },
  {
    id: 'generators',
    name: 'Generators',
    description: 'UUID, GUID, password and random data generators',
    icon: 'Sparkles',
    tools: [],
  },
  {
    id: 'inspect',
    name: 'Inspect & Debug',
    description: 'Diff compare, JWT decode, regex test and HTTP status lookup',
    icon: 'Bug',
    tools: [],
  },
];

// ─── Category Lookup ──────────────────────────────────────────────────────

const categoryMap = new Map<string, ToolCategory>();
categories.forEach((cat) => categoryMap.set(cat.id, cat));

export function getCategoryById(id: string): ToolCategory | undefined {
  return categoryMap.get(id);
}

export function getCategoryForTool(tool: ToolDefinition): ToolCategory | undefined {
  return categoryMap.get(tool.category);
}

export function getAllCategories(): ToolCategory[] {
  return categories;
}
