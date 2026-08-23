import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'typescriptFormatter',
  name: 'TypeScript Formatter',
  description: 'Format and beautify TypeScript code',
  category: 'data',
  keywords: ['typescript', 'ts', 'tsx', 'format', 'beautify', 'pretty', 'prettier'],
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
    return /\b(interface|type\s+\w+\s*=|:\s*(string|number|boolean|any|unknown)|as\s+const|enum\s+\w+|implements\s+|<\w+>)\b/.test(
      trimmed
    );
  },
  process: async (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const prettier = await import('prettier/standalone');
      const typescript = await import('prettier/plugins/typescript');
      const estree = await import('prettier/plugins/estree');
      const useTabs = options?.indentation === 'tab';
      const tabWidth = options?.indentation === '4' ? 4 : 2;

      return await prettier.format(input, {
        parser: 'typescript',
        plugins: [typescript, estree],
        useTabs,
        tabWidth,
        semi: options?.semicolons !== false,
        singleQuote: options?.singleQuote !== false,
      });
    } catch (e) {
      if (e instanceof Error) return `Error formatting TypeScript: ${e.message}`;
      return 'Error formatting TypeScript';
    }
  },
};

export default tool;
