import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'trimLines',
  name: 'Trim Lines',
  description: 'Trim leading and trailing whitespace from each line',
  category: 'text',
  keywords: ['text', 'trim', 'whitespace', 'lines', 'strip'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    { id: 'trimStart', label: 'Trim Start', type: 'boolean', defaultValue: true },
    { id: 'trimEnd', label: 'Trim End', type: 'boolean', defaultValue: true },
    { id: 'removeEmptyLines', label: 'Remove Empty Lines', type: 'boolean', defaultValue: false },
  ],
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input) return '';

    try {
      const trimStart = options?.trimStart !== false;
      const trimEnd = options?.trimEnd !== false;
      const removeEmpty = options?.removeEmptyLines === true;

      let lines = input.split(/\r?\n/).map((line) => {
        let result = line;
        if (trimStart) result = result.replace(/^\s+/, '');
        if (trimEnd) result = result.replace(/\s+$/, '');
        return result;
      });

      if (removeEmpty) {
        lines = lines.filter((line) => line.length > 0);
      }

      return lines.join('\n');
    } catch (e) {
      if (e instanceof Error) return `Error trimming lines: ${e.message}`;
      return 'Error trimming lines';
    }
  },
};

export default tool;
