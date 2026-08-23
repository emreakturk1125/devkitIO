import type { ToolDefinition } from '@/types/tool';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sanitizeTag(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9_.-]/g, '_');
  if (!cleaned) return 'item';
  if (!/^[A-Za-z_]/.test(cleaned)) return `item_${cleaned}`;
  return cleaned;
}

function toXml(value: unknown, nodeName: string, indent: string, depth: number): string {
  const pad = indent.repeat(depth);
  const tag = sanitizeTag(nodeName);

  if (value === null || value === undefined) {
    return `${pad}<${tag} />`;
  }

  if (typeof value !== 'object') {
    return `${pad}<${tag}>${escapeXml(String(value))}</${tag}>`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}<${tag} />`;
    return value.map((item) => toXml(item, tag, indent, depth)).join('\n');
  }

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return `${pad}<${tag} />`;

  const inner = entries
    .map(([key, child]) => {
      if (Array.isArray(child)) {
        if (child.length === 0) return `${indent.repeat(depth + 1)}<${sanitizeTag(key)} />`;
        return child.map((item) => toXml(item, key, indent, depth + 1)).join('\n');
      }
      return toXml(child, key, indent, depth + 1);
    })
    .join('\n');

  return `${pad}<${tag}>\n${inner}\n${pad}</${tag}>`;
}

const tool: ToolDefinition = {
  id: 'jsonToXml',
  name: 'JSON to XML',
  description: 'Convert JSON data to XML',
  category: 'data',
  keywords: ['json', 'xml', 'convert', 'transform'],
  inputType: 'json',
  outputType: 'xml',
  autoTransform: true,
  options: [
    {
      id: 'rootName',
      label: 'Root Element',
      type: 'text',
      defaultValue: 'root',
      placeholder: 'root',
    },
    {
      id: 'indentation',
      label: 'Indentation',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '2 Spaces', value: '2' },
        { label: '4 Spaces', value: '4' },
        { label: 'Tab', value: 'tab' },
      ],
    },
    {
      id: 'declaration',
      label: 'XML Declaration',
      type: 'boolean',
      defaultValue: true,
    },
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    return trimmed.startsWith('{') || trimmed.startsWith('[');
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const data = JSON.parse(input);
      const rootName = ((options?.rootName as string) || 'root').trim() || 'root';
      const indent =
        options?.indentation === 'tab'
          ? '\t'
          : ' '.repeat(options?.indentation === '4' ? 4 : 2);
      const includeDeclaration = options?.declaration !== false;

      let body: string;
      if (Array.isArray(data)) {
        const items = toXml(data, 'item', indent, 1);
        body = `<${sanitizeTag(rootName)}>\n${items}\n</${sanitizeTag(rootName)}>`;
      } else {
        body = toXml(data, rootName, indent, 0);
      }

      if (includeDeclaration) {
        return `<?xml version="1.0" encoding="UTF-8"?>\n${body}`;
      }
      return body;
    } catch (e) {
      if (e instanceof Error) return `Invalid JSON: ${e.message}`;
      return 'Invalid JSON';
    }
  },
};

export default tool;
