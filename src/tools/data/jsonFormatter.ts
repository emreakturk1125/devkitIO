import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'jsonFormatter',
  name: 'JSON Formatter',
  description: 'Format and beautify JSON data',
  category: 'formatters',
  keywords: ['json', 'format', 'beautify', 'pretty'],
  inputType: 'json',
  outputType: 'json',
  autoTransform: true,
  relatedToolIds: ['jsonValidator', 'jsonMinifier', 'jsonToClass', 'jsonToTypeScript'],
  longDescription: 'JSON Formatter is a secure, client-side tool that takes messy, unformatted, or minified JSON data and converts it into a readable, beautifully indented structure. It helps developers quickly inspect and debug API responses or configuration files.',
  howToUse: 'Simply paste your JSON into the input editor. The tool will automatically format it. You can adjust the indentation level (2 spaces, 4 spaces, or tabs) and optionally sort the object keys alphabetically using the options panel.',
  features: [
    'Instant, automatic formatting as you type or paste',
    'Customizable indentation (spaces or tabs)',
    'Alphabetical key sorting for easier visual comparison',
    'Syntax highlighting and error detection for invalid JSON',
    '100% secure: runs entirely in your browser without uploading data'
  ],
  useCases: [
    'Debugging complex JSON payloads from API endpoints',
    'Beautifying minified JSON code for readability',
    'Standardizing JSON configuration files before committing to version control',
    'Finding syntax errors in broken JSON strings'
  ],
  faq: [
    {
      q: 'What is a JSON Formatter?',
      a: 'A JSON Formatter is a tool that takes unformatted or minified JSON text and adds proper indentation, line breaks, and spacing, making it easy for humans to read and understand.'
    },
    {
      q: 'How do I format minified JSON?',
      a: 'Just paste the minified JSON string into the input area. Our tool automatically detects and formats it into a readable structure instantly.'
    }
  ],
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
    return trimmed.startsWith('{') || trimmed.startsWith('[');
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';
    
    try {
      const data = JSON.parse(input);
      const indentStr = options?.indentation === 'tab' ? '\t' : (options?.indentation === '4' ? 4 : 2);
      const sortKeys = options?.sortKeys === true;

      const sortObject = (obj: unknown): unknown => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sortObject);
        const sorted: Record<string, unknown> = {};
        Object.keys(obj).sort().forEach(key => {
          sorted[key] = sortObject((obj as Record<string, unknown>)[key]);
        });
        return sorted;
      };

      const finalData = sortKeys ? sortObject(data) : data;
      return JSON.stringify(finalData, null, indentStr);
    } catch (e) {
      if (e instanceof Error) return `Invalid JSON: ${e.message}`;
      return 'Invalid JSON';
    }
  },
};

export default tool;
