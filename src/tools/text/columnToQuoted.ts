import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'columnToQuoted',
  name: 'Column to Quoted List',
  description: 'Convert newline-separated values to quoted comma-separated values',
  category: 'text',
  keywords: ['text', 'comma', 'quoted', 'column', 'list'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    {
      id: 'quoteStyle',
      label: 'Quote Style',
      type: 'select',
      defaultValue: 'single',
      options: [
        { label: 'Single Quotes', value: 'single' },
        { label: 'Double Quotes', value: 'double' },
      ],
    },
    { id: 'separator', label: 'Separator', type: 'text', defaultValue: ',' },
    { id: 'trim', label: 'Trim whitespace', type: 'boolean', defaultValue: true },
    { id: 'removeEmptyLines', label: 'Remove Empty Lines', type: 'boolean', defaultValue: true },
    { id: 'removeDuplicates', label: 'Remove Duplicates', type: 'boolean', defaultValue: false },
  ],
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input) return '';
    const quoteStyle = (options?.quoteStyle as string) || 'single';
    const separator = (options?.separator as string) ?? ',';
    const trim = options?.trim !== false;
    const removeEmpty = options?.removeEmptyLines !== false;
    const removeDupes = options?.removeDuplicates === true;

    let lines = input.split(/\r?\n/);
    if (trim) lines = lines.map(l => l.trim());
    if (removeEmpty) lines = lines.filter(l => l.length > 0);
    if (removeDupes) lines = Array.from(new Set(lines));

    const quoteChar = quoteStyle === 'single' ? "'" : '"';
    return lines.map(l => `${quoteChar}${l}${quoteChar}`).join(separator);
  },
};

export default tool;
