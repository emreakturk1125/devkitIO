import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'diffCompare',
  name: 'Diff Compare',
  description: 'Compare two text inputs and show differences',
  category: 'inspect',
  keywords: ['diff', 'compare', 'difference', 'text'],
  inputType: 'dual',
  outputType: 'text',
  autoTransform: true,
  longDescription: 'Diff Compare is a powerful text comparison tool that highlights the differences between two blocks of text. It allows you to find additions, deletions, and modifications instantly without installing any desktop software.',
  howToUse: 'Paste your original text into the left pane and the modified text into the right pane. The tool will automatically generate a unified diff output. You can choose to compare by lines, words, or characters, and optionally ignore whitespace differences.',
  features: [
    'Side-by-side input and unified output diff generation',
    'Three comparison modes: Line-by-line, Word-by-word, and Character-by-character',
    'Option to completely ignore whitespace differences (helpful for code)',
    '100% secure, local browser processing'
  ],
  useCases: [
    'Finding what changed between two versions of a source code file',
    'Comparing configuration files to spot misconfigurations',
    'Reviewing text edits or draft changes',
    'Extracting patch information for git or other version control systems'
  ],
  faq: [
    {
      q: 'Can I ignore spacing and indentation changes?',
      a: 'Yes, just enable the "Ignore Whitespace" option. The diff engine will then treat lines that only differ by spaces or tabs as identical.'
    }
  ],
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
      const { diffLines, diffWords, diffChars } = await import('diff');
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
