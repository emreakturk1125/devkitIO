import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'columnToComma',
  name: 'Column to Comma',
  description: 'Convert newline-separated values to comma-separated',
  category: 'text',
  keywords: ['text', 'comma', 'csv', 'column', 'list'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    { id: 'separator', label: 'Separator', type: 'text', defaultValue: ',' },
    { id: 'trim', label: 'Trim whitespace', type: 'boolean', defaultValue: true },
    { id: 'removeEmptyLines', label: 'Remove Empty Lines', type: 'boolean', defaultValue: true },
    { id: 'removeDuplicates', label: 'Remove Duplicates', type: 'boolean', defaultValue: false },
  ],
  detect: (input: string) => {
    return input.includes('\n') && !input.includes(',');
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input) return '';
    const separator = (options?.separator as string) ?? ',';
    const trim = options?.trim !== false;
    const removeEmpty = options?.removeEmptyLines !== false;
    const removeDupes = options?.removeDuplicates === true;

    let lines = input.split(/\r?\n/);
    if (trim) lines = lines.map(l => l.trim());
    if (removeEmpty) lines = lines.filter(l => l.length > 0);
    if (removeDupes) lines = Array.from(new Set(lines));

    return lines.join(separator);
  },
};

export default tool;
