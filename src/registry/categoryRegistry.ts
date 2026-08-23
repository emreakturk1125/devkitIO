import type { ToolCategory, ToolDefinition } from '@/types/tool';

// ─── Category Definitions ─────────────────────────────────────────────────

export const categories: ToolCategory[] = [
  {
    id: 'sql',
    name: 'SQL',
    description: 'SQL formatting, generation and transformation tools',
    icon: 'Database',
    tools: [],
  },
  {
    id: 'data',
    name: 'Data',
    description: 'JSON, YAML, XML, JavaScript and data conversion tools',
    icon: 'Braces',
    tools: [],
  },
  {
    id: 'text',
    name: 'Text',
    description: 'Text manipulation, sorting and transformation tools',
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
    description: 'UUID, hash, password and random data generators',
    icon: 'Sparkles',
    tools: [],
  },
  {
    id: 'debugging',
    name: 'Debugging',
    description: 'Diff, validation and debugging utilities',
    icon: 'Bug',
    tools: [],
  },
  {
    id: 'code',
    name: 'Code',
    description: 'Code formatting and beautification tools',
    icon: 'Code',
    tools: [],
  },
  {
    id: 'conversion',
    name: 'Conversion',
    description: 'Data format conversion tools',
    icon: 'ArrowLeftRight',
    tools: [],
  },
  {
    id: 'web',
    name: 'Web',
    description: 'URL parsing, cURL conversion and web utilities',
    icon: 'Globe',
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
