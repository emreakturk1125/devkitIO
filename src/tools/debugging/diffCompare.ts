import type { ToolDefinition } from '@/types/tool';
import { diffLines, diffWords, diffChars } from 'diff';

const tool: ToolDefinition = {
  id: 'diffCompare',
  name: 'Diff Compare',
  description: 'Compare two text inputs and show differences',
  category: 'debugging',
  keywords: ['diff', 'compare', 'difference', 'text'],
  inputType: 'dual',
  outputType: 'text',
  autoTransform: true,
  options: [
    {
      id: 'diffType',
      label: 'Diff Type',
      type: 'select',
      defaultValue: 'lines',
      options: [
        { label: 'Lines', value: 'lines' },
        { label: 'Words', value: 'words' },
        { label: 'Characters', value: 'chars' },
      ],
    },
    { id: 'ignoreWhitespace', label: 'Ignore Whitespace', type: 'boolean', defaultValue: false },
  ],
  process: async (input: string, options?: Record<string, unknown>) => {
    const secondaryInput = (options?.secondaryInput as string) || '';
    if (!input && !secondaryInput) return '';

    try {
      const diffType = (options?.diffType as string) || 'lines';

      let differences;
      if (diffType === 'words') {
        differences = diffWords(input, secondaryInput);
      } else if (diffType === 'chars') {
        differences = diffChars(input, secondaryInput);
      } else {
        differences = diffLines(input, secondaryInput, {
          ignoreWhitespace: options?.ignoreWhitespace === true,
        });
      }

      let result = '';
      for (const part of differences) {
        const prefix = part.added ? '+' : part.removed ? '-' : ' ';
        const lines = part.value.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (i === lines.length - 1 && lines[i] === '') continue;
          result += `${prefix}${lines[i]}\n`;
        }
      }

      return result;
    } catch (error) {
      if (error instanceof Error) return `Error generating diff: ${error.message}`;
      return 'Error generating diff';
    }
  },
};

export default tool;
