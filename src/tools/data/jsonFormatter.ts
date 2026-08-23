import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'jsonFormatter',
  name: 'JSON Formatter',
  description: 'Format and beautify JSON data',
  category: 'data',
  keywords: ['json', 'format', 'beautify', 'pretty'],
  inputType: 'json',
  outputType: 'json',
  autoTransform: true,
  options: [
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
    { id: 'sortKeys', label: 'Sort Keys', type: 'boolean', defaultValue: false },
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    return trimmed.startsWith('{') || trimmed.startsWith('[');
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';
    
    try {
      const data = JSON.parse(input);
      const indentStr = options?.indentation === 'tab' ? '\t' : (options?.indentation === '4' ? 4 : 2);
      const sortKeys = options?.sortKeys === true;

      const sortObject = (obj: unknown): unknown => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sortObject);
        const sorted: Record<string, unknown> = {};
        Object.keys(obj).sort().forEach(key => {
          sorted[key] = sortObject((obj as Record<string, unknown>)[key]);
        });
        return sorted;
      };

      const finalData = sortKeys ? sortObject(data) : data;
      return JSON.stringify(finalData, null, indentStr);
    } catch (e) {
      if (e instanceof Error) return `Invalid JSON: ${e.message}`;
      return 'Invalid JSON';
    }
  },
};

export default tool;
