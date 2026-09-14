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
  longDescription: 'The Base64 Encoder/Decoder is a secure tool to convert text into Base64 format and vice versa. It properly handles UTF-8 characters and emojis, making it safe for all modern web encoding needs.',
  howToUse: 'Type or paste your text into the input field. Select either "Encode" or "Decode" from the options panel. The tool will automatically transform your text instantly. For decoding, ensure the input is a valid Base64 string.',
  features: [
    'Bi-directional conversion (Encode to Base64, or Decode from Base64)',
    'Full UTF-8 support (safely encodes and decodes special characters and emojis)',
    'Real-time automatic transformation',
    'Local processing in your browser ensures no data leaves your device'
  ],
  useCases: [
    'Encoding credentials for Basic HTTP Authentication',
    'Embedding small text assets or scripts safely in URLs or JSON',
    'Decoding Base64 strings found in logs, API responses, or debug traces',
    'Verifying that an encoded string contains the expected text'
  ],
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
