import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'jsonMinifier',
  name: 'JSON Minifier',
  description: 'Minify JSON data',
  category: 'data',
  keywords: ['json', 'minify', 'compress'],
  inputType: 'json',
  outputType: 'json',
  autoTransform: true,
  detect: (input: string) => {
    try {
      JSON.parse(input);
      return /\s/.test(input.trim());
    } catch {
      return false;
    }
  },
  process: (input: string) => {
    if (!input.trim()) return '';
    try {
      return JSON.stringify(JSON.parse(input));
    } catch (e) {
      if (e instanceof Error) return `Invalid JSON: ${e.message}`;
      return 'Invalid JSON';
    }
  },
};

export default tool;
