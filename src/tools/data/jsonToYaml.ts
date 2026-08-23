import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'jsonToYaml',
  name: 'JSON to YAML',
  description: 'Convert JSON data to YAML',
  category: 'data',
  keywords: ['json', 'yaml', 'yml', 'convert', 'transform'],
  inputType: 'json',
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
      ],
    },
    { id: 'sortKeys', label: 'Sort Keys', type: 'boolean', defaultValue: false },
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    return trimmed.startsWith('{') || trimmed.startsWith('[');
  },
  process: async (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const data = JSON.parse(input);
      const yaml = await import('js-yaml');
      const indentSize = options?.indentation === '4' ? 4 : 2;

      return yaml.dump(data, {
        indent: indentSize,
        sortKeys: options?.sortKeys === true,
        lineWidth: -1,
        noRefs: true,
      });
    } catch (e) {
      if (e instanceof Error) return `Invalid JSON: ${e.message}`;
      return 'Invalid JSON';
    }
  },
};

export default tool;
