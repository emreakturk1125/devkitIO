import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'sortLines',
  name: 'Sort Lines',
  description: 'Sort lines of text alphabetically or numerically',
  category: 'text',
  keywords: ['text', 'sort', 'order', 'lines', 'alphabetical', 'numeric'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    {
      id: 'direction',
      label: 'Direction',
      type: 'select',
      defaultValue: 'asc',
      options: [
        { label: 'Ascending', value: 'asc' },
        { label: 'Descending', value: 'desc' },
      ],
    },
    { id: 'caseSensitive', label: 'Case Sensitive', type: 'boolean', defaultValue: false },
    { id: 'numeric', label: 'Numeric Sort', type: 'boolean', defaultValue: false },
    { id: 'trim', label: 'Trim whitespace', type: 'boolean', defaultValue: true },
    { id: 'removeEmptyLines', label: 'Remove Empty Lines', type: 'boolean', defaultValue: false },
  ],
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input) return '';
    const direction = (options?.direction as string) === 'desc' ? -1 : 1;
    const caseSensitive = options?.caseSensitive === true;
    const numeric = options?.numeric === true;
    const trim = options?.trim !== false;
    const removeEmpty = options?.removeEmptyLines === true;

    let lines = input.split(/\r?\n/);
    if (trim) lines = lines.map(l => l.trim());
    if (removeEmpty) lines = lines.filter(l => l.length > 0);

    lines.sort((a, b) => {
      let valA = a;
      let valB = b;
      
      if (!caseSensitive && !numeric) {
        valA = a.toLowerCase();
        valB = b.toLowerCase();
      }

      if (numeric) {
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return (numA - numB) * direction;
        }
      }

      return valA.localeCompare(valB) * direction;
    });

    return lines.join('\n');
  },
};

export default tool;
