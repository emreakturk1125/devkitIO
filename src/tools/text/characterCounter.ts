import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'characterCounter',
  name: 'Character Counter',
  description: 'Count characters with optional space and newline handling',
  category: 'text',
  keywords: ['character', 'char', 'count', 'counter', 'length', 'text', 'stats'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    {
      id: 'includeSpaces',
      label: 'Include Spaces',
      type: 'boolean',
      defaultValue: true,
    },
    {
      id: 'includeNewlines',
      label: 'Include Newlines',
      type: 'boolean',
      defaultValue: false,
    },
  ],
  process: (input: string, options?: Record<string, unknown>) => {
    const includeSpaces = options?.includeSpaces === true || options?.includeSpaces === undefined;
    const includeNewlines = options?.includeNewlines === true;

    // CodeMirror may add a trailing newline — strip it for accurate counting
    const text = input.endsWith('\n') ? input.slice(0, -1) : input;

    const spaces = (text.match(/[ \t]/g) ?? []).length;
    const newlineChars = (text.match(/\r?\n/g) ?? []).length;
    const letters = (text.match(/\p{L}/gu) ?? []).length;
    const digits = (text.match(/\p{N}/gu) ?? []).length;

    // Base = visible characters (excluding newlines)
    const visibleTotal = text.length - newlineChars;
    let count = visibleTotal;

    if (includeNewlines) count += newlineChars;
    if (!includeSpaces) count -= spaces;

    const lines = text === '' ? 0 : text.split('\n').length;

    return [
      `Characters:          ${count}`,
      ``,
      `--- Details ---`,
      `Without spaces:      ${visibleTotal - spaces}`,
      `Letters:             ${letters}`,
      `Digits:              ${digits}`,
      `Spaces / Tabs:       ${spaces}`,
      `Lines:               ${lines}`,
      `Newline chars:       ${newlineChars}`,
    ].join('\n');
  },
};

export default tool;
