import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'removeDuplicates',
  name: 'Remove Duplicates',
  description: 'Remove duplicate lines from text',
  category: 'text',
  keywords: ['text', 'duplicate', 'unique', 'lines'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    { id: 'caseSensitive', label: 'Case Sensitive', type: 'boolean', defaultValue: true },
    { id: 'trim', label: 'Trim whitespace', type: 'boolean', defaultValue: true },
    { id: 'preserveOrder', label: 'Preserve Order', type: 'boolean', defaultValue: true },
  ],
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input) return '';
    const caseSensitive = options?.caseSensitive !== false;
    const trim = options?.trim !== false;
    const preserveOrder = options?.preserveOrder !== false;

    let lines = input.split(/\r?\n/);
    const seen = new Set<string>();
    const result: string[] = [];

    for (let line of lines) {
      if (trim) line = line.trim();
      const compLine = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(compLine)) {
        seen.add(compLine);
        result.push(line);
      }
    }

    if (!preserveOrder) {
      result.sort((a, b) => {
        const compA = caseSensitive ? a : a.toLowerCase();
        const compB = caseSensitive ? b : b.toLowerCase();
        return compA.localeCompare(compB);
      });
    }

    return result.join('\n');
  },
};

export default tool;
