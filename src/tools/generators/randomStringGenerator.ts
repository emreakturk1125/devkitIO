import type { ToolDefinition } from '@/types/tool';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const HEX = '0123456789abcdef';
const ALPHANUMERIC = ALPHA + NUMBERS;

function randomInt(max: number): number {
  if (max <= 0) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function charsetFor(kind: string): string {
  switch (kind) {
    case 'letters':
      return ALPHA;
    case 'numbers':
      return NUMBERS;
    case 'hex':
      return HEX;
    case 'alphanumeric':
    default:
      return ALPHANUMERIC;
  }
}

const tool: ToolDefinition = {
  id: 'randomStringGenerator',
  name: 'Random String Generator',
  description: 'Generate random strings with length and charset options',
  category: 'generators',
  keywords: ['random', 'string', 'generate', 'alphanumeric', 'token', 'nonce'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: false,
  requiresInput: false,
  options: [
    { id: 'count', label: 'Count', type: 'number', defaultValue: 1 },
    { id: 'length', label: 'Length', type: 'number', defaultValue: 16 },
    {
      id: 'charset',
      label: 'Charset',
      type: 'select',
      defaultValue: 'alphanumeric',
      options: [
        { label: 'Alphanumeric', value: 'alphanumeric' },
        { label: 'Letters', value: 'letters' },
        { label: 'Numbers', value: 'numbers' },
        { label: 'Hex', value: 'hex' },
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
      const lengthRaw = parseInt(String(options?.length ?? '16'), 10);
      const countRaw = parseInt(String(options?.count ?? '1'), 10);
      const length = Number.isNaN(lengthRaw) ? 16 : Math.max(1, Math.min(1024, lengthRaw));
      const count = Number.isNaN(countRaw) ? 1 : Math.max(1, Math.min(1000, countRaw));
      const pool = charsetFor((options?.charset as string) || 'alphanumeric');
      const separatorType = (options?.separator as string) || 'newline';

      let separator = '\n';
      if (separatorType === 'comma') separator = ',';
      if (separatorType === 'space') separator = ' ';

      const values: string[] = [];
      for (let n = 0; n < count; n++) {
        let result = '';
        for (let i = 0; i < length; i++) {
          result += pool.charAt(randomInt(pool.length));
        }
        values.push(result);
      }

      return values.join(separator);
    } catch (e) {
      if (e instanceof Error) return `Error generating string: ${e.message}`;
      return 'Error generating string';
    }
  },
};

export default tool;
