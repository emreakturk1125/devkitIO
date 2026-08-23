import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'sqlInGenerator',
  name: 'SQL IN Generator',
  description: 'Generate SQL IN expression from lines of text',
  category: 'sql',
  keywords: ['sql', 'in', 'clause', 'list', 'generate'],
  inputType: 'text',
  outputType: 'sql',
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
        { label: 'None', value: 'none' },
      ],
    },
    { id: 'removeEmptyLines', label: 'Remove Empty Lines', type: 'boolean', defaultValue: true },
    { id: 'removeDuplicates', label: 'Remove Duplicates', type: 'boolean', defaultValue: true },
    { id: 'trim', label: 'Trim whitespace', type: 'boolean', defaultValue: true },
  ],
  detect: (input: string) => {
    const lines = input.split('\n');
    return lines.length > 1 && !input.includes(',');
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';
    
    const quoteStyle = (options?.quoteStyle as string) || 'single';
    const removeEmpty = options?.removeEmptyLines !== false;
    const removeDupes = options?.removeDuplicates !== false;
    const trim = options?.trim !== false;

    let lines = input.split('\n');
    
    if (trim) lines = lines.map(l => l.trim());
    if (removeEmpty) lines = lines.filter(l => l.length > 0);
    if (removeDupes) lines = Array.from(new Set(lines));

    if (lines.length === 0) return '';

    const quoteChar = quoteStyle === 'single' ? "'" : (quoteStyle === 'double' ? '"' : "");
    const formatted = lines.map(l => `${quoteChar}${l}${quoteChar}`).join(',');
    
    return `IN (${formatted})`;
  },
};

export default tool;
