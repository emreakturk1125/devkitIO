import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'commaToColumn',
  name: 'Comma to Column',
  description: 'Convert comma-separated values to newline-separated',
  category: 'text',
  keywords: ['text', 'comma', 'csv', 'column', 'list'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    { id: 'trim', label: 'Trim whitespace', type: 'boolean', defaultValue: true },
    { id: 'removeEmptyLines', label: 'Remove Empty Lines', type: 'boolean', defaultValue: true },
  ],
  detect: (input: string) => {
    return input.includes(',') && !input.includes('\n');
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input) return '';
    const trim = options?.trim !== false;
    const removeEmpty = options?.removeEmptyLines !== false;

    let items = input.split(',');
    if (trim) items = items.map(i => i.trim());
    if (removeEmpty) items = items.filter(i => i.length > 0);

    return items.join('\n');
  },
};

export default tool;
