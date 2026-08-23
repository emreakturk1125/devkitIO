import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'cssFormatter',
  name: 'CSS Formatter',
  description: 'Format and beautify CSS stylesheets',
  category: 'data',
  keywords: ['css', 'format', 'beautify', 'pretty', 'stylesheet', 'prettier'],
  inputType: 'code',
  outputType: 'code',
  autoTransform: false,
  options: [
    {
      id: 'indentation',
      label: 'Indentation',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '2 Spaces', value: '2' },
        { label: '4 Spaces', value: '4' },
        { label: 'Tab', value: 'tab' },
      ],
    },
    {
      id: 'singleQuote',
      label: 'Single Quotes',
      type: 'boolean',
      defaultValue: false,
    },
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return false;
    return /[{;]\s*[a-zA-Z-]+\s*:/.test(trimmed) || /@media|@keyframes|@import/.test(trimmed);
  },
  process: async (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const prettier = await import('prettier/standalone');
      const postcss = await import('prettier/plugins/postcss');
      const useTabs = options?.indentation === 'tab';
      const tabWidth = options?.indentation === '4' ? 4 : 2;

      return await prettier.format(input, {
        parser: 'css',
        plugins: [postcss],
        useTabs,
        tabWidth,
        singleQuote: options?.singleQuote === true,
      });
    } catch (e) {
      if (e instanceof Error) return `Error formatting CSS: ${e.message}`;
      return 'Error formatting CSS';
    }
  },
};

export default tool;
