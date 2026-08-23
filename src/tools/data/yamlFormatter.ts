import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'yamlFormatter',
  name: 'YAML Formatter',
  description: 'Format and beautify YAML data',
  category: 'data',
  keywords: ['yaml', 'yml', 'format', 'beautify', 'pretty'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
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
    { id: 'sortKeys', label: 'Sort Keys', type: 'boolean', defaultValue: false },
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    if (!trimmed || trimmed.startsWith('{') || trimmed.startsWith('[')) return false;
    return (
      /^---\s*$/m.test(trimmed) ||
      /^[\w.-]+\s*:\s*.+/m.test(trimmed)
    );
  },
  process: async (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const yaml = await import('js-yaml');
      const data = yaml.load(input);
      const indentSize = options?.indentation === '4' ? 4 : 2;
      let result = yaml.dump(data, {
        indent: indentSize,
        sortKeys: options?.sortKeys === true,
        lineWidth: -1,
        noRefs: true,
      });

      if (options?.indentation === 'tab') {
        const re = new RegExp(`^( {${indentSize}})+`, 'gm');
        result = result.replace(re, (match) => '\t'.repeat(match.length / indentSize));
      }

      return result;
    } catch (e) {
      if (e instanceof Error) return `Invalid YAML: ${e.message}`;
      return 'Invalid YAML';
    }
  },
};

export default tool;
