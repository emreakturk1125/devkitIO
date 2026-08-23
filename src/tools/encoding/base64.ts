import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'base64',
  name: 'Base64 Encoder/Decoder',
  description: 'Encode or decode Base64 strings',
  category: 'encoding',
  keywords: ['base64', 'encode', 'decode'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    {
      id: 'mode',
      label: 'Mode',
      type: 'select',
      defaultValue: 'encode',
      options: [
        { label: 'Encode', value: 'encode' },
        { label: 'Decode', value: 'decode' },
      ],
    },
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    if (trimmed.length === 0 || trimmed.length < 4) return false;
    return /^[A-Za-z0-9+/]+={0,2}$/.test(trimmed);
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input) return '';
    const mode = (options?.mode as string) || 'encode';

    try {
      if (mode === 'encode') {
        // UTF-8 safe browser encoding
        return btoa(
          Array.from(new TextEncoder().encode(input))
            .map((b) => String.fromCharCode(b))
            .join('')
        );
      } else {
        // UTF-8 safe browser decoding
        const binaryStr = atob(input.trim());
        const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
        return new TextDecoder().decode(bytes);
      }
    } catch (e) {
      if (e instanceof Error) return `Error: ${e.message}`;
      return 'Error processing Base64';
    }
  },
};

export default tool;
