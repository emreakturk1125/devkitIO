import type { ToolDefinition } from '@/types/tool';

const tool: ToolDefinition = {
  id: 'sqlFormatter',
  name: 'SQL Formatter',
  description: 'Format and beautify SQL queries',
  category: 'sql',
  keywords: ['sql', 'format', 'beautify', 'pretty'],
  inputType: 'sql',
  outputType: 'sql',
  autoTransform: false,
  options: [
    {
      id: 'dialect',
      label: 'Dialect',
      type: 'select',
      defaultValue: 'sql',
      options: [
        { label: 'Standard SQL', value: 'sql' },
        { label: 'T-SQL', value: 'tsql' },
        { label: 'PostgreSQL', value: 'postgresql' },
        { label: 'MySQL', value: 'mysql' },
        { label: 'SQLite', value: 'sqlite' },
        { label: 'PL/SQL', value: 'plsql' },
      ],
    },
    {
      id: 'keywordCase',
      label: 'Keyword Case',
      type: 'select',
      defaultValue: 'upper',
      options: [
        { label: 'Uppercase', value: 'upper' },
        { label: 'Lowercase', value: 'lower' },
        { label: 'Preserve', value: 'preserve' },
      ],
    },
    {
      id: 'tabWidth',
      label: 'Tab Width',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '2 Spaces', value: '2' },
        { label: '4 Spaces', value: '4' },
      ],
    },
  ],
  detect: (input: string) => {
    const uppercaseInput = input.toUpperCase();
    return /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/.test(uppercaseInput);
  },
  process: async (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';
    try {
      const { format } = await import('sql-formatter');
      const validDialects = ['sql', 'tsql', 'postgresql', 'mysql', 'sqlite', 'plsql'] as const;
      type SqlDialect = typeof validDialects[number];
      const dialect = (validDialects.includes((options?.dialect as string) as SqlDialect)
        ? options?.dialect
        : 'sql') as SqlDialect;
      const keywordCase = (options?.keywordCase as 'upper' | 'lower' | 'preserve') || 'upper';
      const tabWidth = parseInt((options?.tabWidth as string) || '2', 10);
      
      return format(input, {
        language: dialect,
        keywordCase: keywordCase,
        tabWidth: tabWidth,
      });
    } catch (error) {
      if (error instanceof Error) return `Error formatting SQL: ${error.message}`;
      return 'Error formatting SQL';
    }
  },
};

export default tool;
