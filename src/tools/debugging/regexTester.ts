import type { ToolDefinition } from '@/types/tool';

function buildFlags(options?: Record<string, unknown>): string {
  let flags = '';
  if (options?.global !== false) flags += 'g';
  if (options?.ignoreCase === true) flags += 'i';
  if (options?.multiline === true) flags += 'm';
  if (options?.dotAll === true) flags += 's';
  return flags;
}

function formatMatch(match: RegExpExecArray, index: number): string {
  const start = match.index;
  const text = match[0];
  const end = start + text.length;
  const lines = [`[${index}] "${text}" at ${start}-${end}`];

  if (match.length > 1) {
    for (let i = 1; i < match.length; i++) {
      const value = match[i];
      lines.push(`    group ${i}: ${value === undefined ? '(undefined)' : JSON.stringify(value)}`);
    }
  }

  const named = match.groups;
  if (named && Object.keys(named).length > 0) {
    for (const [name, value] of Object.entries(named)) {
      lines.push(`    ${name}: ${value === undefined ? '(undefined)' : JSON.stringify(value)}`);
    }
  }

  return lines.join('\n');
}

const tool: ToolDefinition = {
  id: 'regexTester',
  name: 'Regex Tester',
  description: 'Test a regular expression against text and list matches',
  category: 'debugging',
  keywords: ['regex', 'regexp', 'regular', 'expression', 'match', 'test', 'pattern'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    {
      id: 'pattern',
      label: 'Pattern',
      type: 'text',
      defaultValue: '',
      placeholder: 'e.g. \\w+',
    },
    { id: 'global', label: 'Global', type: 'boolean', defaultValue: true },
    { id: 'ignoreCase', label: 'Ignore Case', type: 'boolean', defaultValue: false },
    { id: 'multiline', label: 'Multiline', type: 'boolean', defaultValue: false },
    { id: 'dotAll', label: 'Dot All', type: 'boolean', defaultValue: false },
  ],
  process: (input: string, options?: Record<string, unknown>) => {
    const pattern = String(options?.pattern ?? '');
    if (!pattern) return 'Enter a regular expression in Pattern.';

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, buildFlags(options));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid regular expression';
      return `Invalid regex: ${message}`;
    }

    try {
      const matches: RegExpExecArray[] = [];
      if (regex.global) {
        let match = regex.exec(input);
        let guard = 0;
        while (match !== null && guard < 10000) {
          matches.push(match);
          if (match[0] === '') {
            regex.lastIndex += 1;
          }
          match = regex.exec(input);
          guard++;
        }
      } else {
        const match = regex.exec(input);
        if (match) matches.push(match);
      }

      if (matches.length === 0) return 'No matches';

      const header = `Matches: ${matches.length}`;
      const body = matches.map((m, i) => formatMatch(m, i)).join('\n');
      return `${header}\n\n${body}`;
    } catch (e) {
      if (e instanceof Error) return `Error testing regex: ${e.message}`;
      return 'Error testing regex';
    }
  },
};

export default tool;
