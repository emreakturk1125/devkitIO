import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'htmlFormatter',
  name: 'HTML Formatter',
  description: 'Format and beautify HTML markup',
  category: 'data',
  keywords: ['html', 'format', 'beautify', 'pretty', 'markup', 'prettier'],
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
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return false;
    return (
      /<\/?[a-zA-Z][\w:-]*[\s>]/.test(trimmed) &&
      !trimmed.startsWith('{') &&
      !trimmed.startsWith('<?xml')
    );
  },
  process: async (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const prettier = await import('prettier/standalone');
      const html = await import('prettier/plugins/html');
      const useTabs = options?.indentation === 'tab';
      const tabWidth = options?.indentation === '4' ? 4 : 2;

      return await prettier.format(input, {
        parser: 'html',
        plugins: [html],
        useTabs,
        tabWidth,
      });
    } catch (e) {
      if (e instanceof Error) return `Error formatting HTML: ${e.message}`;
      return 'Error formatting HTML';
    }
  },
};

export default tool;
