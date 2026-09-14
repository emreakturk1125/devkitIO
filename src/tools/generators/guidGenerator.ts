import type { ToolDefinition } from '@/types/tool';

type GuidStyle = 'D' | 'N' | 'B' | 'P';

function formatGuid(uuid: string, style: GuidStyle, casing: 'lowercase' | 'uppercase'): string {
  const value = casing === 'uppercase' ? uuid.toUpperCase() : uuid.toLowerCase();
  const bare = value.replace(/-/g, '');

  switch (style) {
    case 'N':
      return bare;
    case 'B':
      return `{${value}}`;
    case 'P':
      return `(${value})`;
    case 'D':
    default:
      return value;
  }
}

const tool: ToolDefinition = {
  id: 'guidGenerator',
  name: 'GUID Generator',
  description: 'Generate random GUIDs (.NET-style formats)',
  category: 'generators',
  keywords: ['guid', 'uuid', 'generate', 'random', 'dotnet', 'csharp'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: false,
  requiresInput: false,
  relatedToolIds: ['uuidGenerator', 'randomStringGenerator'],
  longDescription: 'GUID Generator produces standard Globally Unique Identifiers with customizable .NET formats and letter casing. Generate single identifiers or batch generate up to 10,000 values in seconds directly within your browser.',
  howToUse: 'Choose the quantity of GUIDs needed, select your preferred format style (hyphenated, digits-only, braces, or parentheses), and pick uppercase or lowercase casing. The generated values appear immediately in the output area ready to copy.',
  features: [
    'Supports standard .NET formats: D (hyphenated), N (digits only), B (braced), P (parenthesized)',
    'Configurable letter casing (uppercase or lowercase)',
    'Batch generation up to 10,000 GUIDs at once',
    'Multiple delimiter options (newline, comma, or space)',
    'Fast, client-side generation using standard crypto algorithms'
  ],
  useCases: [
    'Creating mock primary keys for database seeds and test fixtures',
    'Generating unique correlation IDs for logging and distributed tracing',
    'Producing consistent format GUIDs for C# / .NET application development'
  ],
  options: [
    { id: 'count', label: 'Count', type: 'number', defaultValue: 1 },
    {
      id: 'style',
      label: 'Format',
      type: 'select',
      defaultValue: 'D',
      options: [
        { label: 'D — 00000000-0000-0000-0000-000000000000', value: 'D' },
        { label: 'N — 00000000000000000000000000000000', value: 'N' },
        { label: 'B — {00000000-0000-0000-0000-000000000000}', value: 'B' },
        { label: 'P — (00000000-0000-0000-0000-000000000000)', value: 'P' },
      ],
    },
    {
      id: 'casing',
      label: 'Case',
      type: 'select',
      defaultValue: 'uppercase',
      options: [
        { label: 'Uppercase', value: 'uppercase' },
        { label: 'Lowercase', value: 'lowercase' },
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
    const count = parseInt(String(options?.count ?? '1'), 10);
    const style = ((options?.style as string) || 'D') as GuidStyle;
    const casing = ((options?.casing as string) || 'uppercase') as 'lowercase' | 'uppercase';
    const separatorType = (options?.separator as string) || 'newline';

    let separator = '\n';
    if (separatorType === 'comma') separator = ',';
    if (separatorType === 'space') separator = ' ';

    const safeCount = Number.isNaN(count) ? 1 : Math.max(1, Math.min(10000, count));
    const guids: string[] = [];

    for (let i = 0; i < safeCount; i++) {
      guids.push(formatGuid(crypto.randomUUID(), style, casing));
    }

    return guids.join(separator);
  },
};

export default tool;
