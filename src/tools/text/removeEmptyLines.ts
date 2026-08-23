import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'removeEmptyLines',
  name: 'Remove Empty Lines',
  description: 'Remove empty or whitespace-only lines from text',
  category: 'text',
  keywords: ['text', 'empty', 'lines', 'remove', 'blank', 'whitespace'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    {
      id: 'trim',
      label: 'Trim whitespace',
      type: 'boolean',
      defaultValue: false,
    },
    {
      id: 'keepWhitespaceOnly',
      label: 'Keep Whitespace-only Lines',
      type: 'boolean',
      defaultValue: false,
    },
  ],
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input) return '';

    try {
      const trim = options?.trim === true;
      const keepWhitespaceOnly = options?.keepWhitespaceOnly === true;
      const lines = input.split(/\r?\n/);
      const filtered = lines.filter((line) => {
        if (keepWhitespaceOnly) return line.length > 0;
        return line.trim().length > 0;
      });
      const result = trim ? filtered.map((l) => l.trim()) : filtered;
      return result.join('\n');
    } catch (e) {
      if (e instanceof Error) return `Error removing empty lines: ${e.message}`;
      return 'Error removing empty lines';
    }
  },
};

export default tool;
