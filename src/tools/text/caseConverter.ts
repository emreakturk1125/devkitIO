import type { ToolDefinition } from '@/types/tool';

type CaseMode =
  | 'lowercase'
  | 'uppercase'
  | 'title'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant';

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toTitle(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function convertLine(input: string, mode: CaseMode): string {
  if (!input) return input;

  if (mode === 'lowercase') return input.toLowerCase();
  if (mode === 'uppercase') return input.toUpperCase();

  const words = splitWords(input);
  if (words.length === 0) return input;

  switch (mode) {
    case 'title':
      return words.map(toTitle).join(' ');
    case 'camel':
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : toTitle(w)))
        .join('');
    case 'pascal':
      return words.map(toTitle).join('');
    case 'snake':
      return words.map((w) => w.toLowerCase()).join('_');
    case 'kebab':
      return words.map((w) => w.toLowerCase()).join('-');
    case 'constant':
      return words.map((w) => w.toUpperCase()).join('_');
    default:
      return input;
  }
}

const tool: ToolDefinition = {
  id: 'caseConverter',
  name: 'Case Converter',
  description: 'Convert text between common identifier and letter-case styles',
  category: 'text',
  keywords: [
    'case', 'convert', 'camel', 'pascal', 'snake', 'kebab', 'upper', 'lower',
    'title', 'constant', 'text',
  ],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    {
      id: 'mode',
      label: 'Target Case',
      type: 'select',
      defaultValue: 'camel',
      options: [
        { label: 'lowercase', value: 'lowercase' },
        { label: 'UPPERCASE', value: 'uppercase' },
        { label: 'Title Case', value: 'title' },
        { label: 'camelCase', value: 'camel' },
        { label: 'PascalCase', value: 'pascal' },
        { label: 'snake_case', value: 'snake' },
        { label: 'kebab-case', value: 'kebab' },
        { label: 'CONSTANT_CASE', value: 'constant' },
      ],
    },
  ],
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input) return '';

    try {
      const mode = ((options?.mode as string) || 'camel') as CaseMode;
      const lines = input.split(/\r?\n/);
      return lines.map((line) => convertLine(line, mode)).join('\n');
    } catch (e) {
      if (e instanceof Error) return `Error converting case: ${e.message}`;
      return 'Error converting case';
    }
  },
};

export default tool;
