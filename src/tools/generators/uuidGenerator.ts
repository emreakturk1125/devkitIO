import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'uuidGenerator',
  name: 'UUID Generator',
  description: 'Generate RFC 4122 UUID v4 values',
  category: 'generators',
  keywords: ['uuid', 'guid', 'generate', 'random', 'v4', 'rfc4122'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: false,
  requiresInput: false,
  options: [
    { id: 'count', label: 'Count', type: 'number', defaultValue: 1 },
    {
      id: 'format',
      label: 'Format',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'No Hyphens', value: 'nohyphens' },
      ],
    },
    {
      id: 'casing',
      label: 'Case',
      type: 'select',
      defaultValue: 'lowercase',
      options: [
        { label: 'Lowercase', value: 'lowercase' },
        { label: 'Uppercase', value: 'uppercase' },
      ],
    },
    {
      id: 'separator',
      label: 'Separator',
      type: 'select',
      defaultValue: 'newline',
      options: [
        { label: 'Newline', value: 'newline' },
        { label: 'Comma', value: 'comma' },
        { label: 'Space', value: 'space' },
      ],
    },
  ],
  process: (_input: string, options?: Record<string, unknown>) => {
    try {
      const count = parseInt(String(options?.count ?? '1'), 10);
      const format = (options?.format as string) || 'standard';
      const casing = ((options?.casing as string) || 'lowercase') as 'lowercase' | 'uppercase';
      const separatorType = (options?.separator as string) || 'newline';

      let separator = '\n';
      if (separatorType === 'comma') separator = ',';
      if (separatorType === 'space') separator = ' ';

      const safeCount = Number.isNaN(count) ? 1 : Math.max(1, Math.min(10000, count));
      const values: string[] = [];

      for (let i = 0; i < safeCount; i++) {
        let uuid: string = crypto.randomUUID();
        if (format === 'nohyphens') uuid = uuid.replace(/-/g, '');
        uuid = casing === 'uppercase' ? uuid.toUpperCase() : uuid.toLowerCase();
        values.push(uuid);
      }

      return values.join(separator);
    } catch (e) {
      if (e instanceof Error) return `Error generating UUID: ${e.message}`;
      return 'Error generating UUID';
    }
  },
};

export default tool;
