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
  relatedToolIds: ['jwtDecoder'],
  faq: [
    {
      q: 'Does this tool support UTF-8 characters like emojis?',
      a: 'Yes, unlike standard browser atob/btoa functions which fail on non-ASCII characters, our tool uses TextEncoder and TextDecoder to safely process full UTF-8 strings including emojis.'
    },
    {
      q: 'What happens if I try to decode invalid Base64?',
      a: 'The tool will catch the error and display a clear error message in the output panel indicating that the input is not a valid Base64 string.'
    }
  ],
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
