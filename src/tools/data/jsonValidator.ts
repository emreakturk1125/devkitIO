import type { ToolDefinition } from '@/types/tool';

function locationFromPosition(input: string, position: number): { line: number; column: number } {
  const safePos = Math.max(0, Math.min(position, input.length));
  const upTo = input.slice(0, safePos);
  const lines = upTo.split(/\r?\n/);
  return {
    line: lines.length,
    column: (lines[lines.length - 1]?.length ?? 0) + 1,
  };
}

function describeValue(data: unknown): string[] {
  if (data === null) return ['Type: null'];
  if (Array.isArray(data)) {
    return [`Type: array`, `Length: ${data.length}`];
  }
  if (typeof data === 'object') {
    const keys = Object.keys(data as Record<string, unknown>);
    return [`Type: object`, `Properties: ${keys.length}`];
  }
  return [`Type: ${typeof data}`];
}

const tool: ToolDefinition = {
  id: 'jsonValidator',
  name: 'JSON Validator',
  description: 'Validate JSON and report parse errors with line and column',
  category: 'data',
  keywords: ['json', 'validate', 'validator', 'lint', 'check', 'parse'],
  inputType: 'json',
  outputType: 'text',
  autoTransform: true,
  detect: (input: string) => {
    const trimmed = input.trim();
    return trimmed.startsWith('{') || trimmed.startsWith('[');
  },
  process: (input: string) => {
    if (!input.trim()) return '';

    try {
      const data = JSON.parse(input);
      return ['Valid JSON', '', ...describeValue(data)].join('\n');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid JSON';
      const lineColInMessage = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
      const positionInMessage = message.match(/position\s+(\d+)/i);

      let line: number | null = null;
      let column: number | null = null;
      let position: number | null = null;

      if (lineColInMessage) {
        line = parseInt(lineColInMessage[1], 10);
        column = parseInt(lineColInMessage[2], 10);
      }

      if (positionInMessage) {
        position = parseInt(positionInMessage[1], 10);
        if (line === null || column === null) {
          const loc = locationFromPosition(input, position);
          line = loc.line;
          column = loc.column;
        }
      }

      const lines = ['Invalid JSON', '', `Message: ${message}`];
      if (line !== null) lines.push(`Line: ${line}`);
      if (column !== null) lines.push(`Column: ${column}`);
      if (position !== null) lines.push(`Position: ${position}`);
      return lines.join('\n');
    }
  },
};

export default tool;
