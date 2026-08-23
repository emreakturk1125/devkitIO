import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'jqueryFormatter',
  name: 'jQuery Formatter',
  description: 'Format and beautify jQuery / JavaScript code',
  category: 'data',
  keywords: ['jquery', 'js', 'javascript', 'format', 'beautify', 'pretty', 'dom'],
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
      id: 'semicolons',
      label: 'Semicolons',
      type: 'boolean',
      defaultValue: true,
    },
    {
      id: 'singleQuote',
      label: 'Single Quotes',
      type: 'boolean',
      defaultValue: true,
    },
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return false;
    return /\$\s*\(|jQuery\s*\(|\.ready\s*\(|\.ajax\s*\(/.test(trimmed);
  },
  process: async (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const prettier = await import('prettier/standalone');
      const babel = await import('prettier/plugins/babel');
      const estree = await import('prettier/plugins/estree');
      const useTabs = options?.indentation === 'tab';
      const tabWidth = options?.indentation === '4' ? 4 : 2;

      return await prettier.format(input, {
        parser: 'babel',
        plugins: [babel, estree],
        useTabs,
        tabWidth,
        semi: options?.semicolons !== false,
        singleQuote: options?.singleQuote !== false,
      });
    } catch (e) {
      if (e instanceof Error) return `Error formatting jQuery: ${e.message}`;
      return 'Error formatting jQuery';
    }
  },
};

export default tool;
