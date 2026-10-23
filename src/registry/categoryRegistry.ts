import type { ToolCategory, ToolDefinition } from '@/types/tool';

// ─── Category Definitions ─────────────────────────────────────────────────

export const categories: ToolCategory[] = [
  {
    id: 'json',
    name: 'JSON & Data',
    description: 'JSON formatting, validation, diffing and class conversion tools',
    icon: 'Braces',
    tools: [],
  },
  {
    id: 'formatters',
    name: 'Code Formatters',
    description: 'JavaScript, TypeScript, jQuery, HTML, CSS, XML and YAML code formatting tools',
    icon: 'Code',
    tools: [],
  },
  {
    id: 'sql',
    name: 'SQL Tools',
    description: 'SQL query formatting, IN clause generation and C# class conversion tools',
    icon: 'Database',
    tools: [],
  },
  {
    id: 'text',
    name: 'Text & Lists',
    description: 'Text manipulation, list conversion, line deduplication, sorting and counting tools',
    icon: 'Type',
    tools: [],
  },
  {
    id: 'encoding',
    name: 'Encoding & Tokens',
    description: 'UTF-8 Base64 encoding/decoding and JWT token inspection tools',
    icon: 'Lock',
    tools: [],
  },
  {
    id: 'generators',
    name: 'Generators',
    description: 'UUID, GUID, secure password and random string generators',
    icon: 'Sparkles',
    tools: [],
  },
  {
    id: 'inspect',
    name: 'Debug & Testing',
    description: 'Text diff checker, regex tester and HTTP status code lookup',
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
