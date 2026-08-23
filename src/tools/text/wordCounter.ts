import type { ToolDefinition } from '@/types/tool';

function countWords(input: string, mode: string): number {
  const trimmed = input.trim();
  if (!trimmed) return 0;

  if (mode === 'whitespace') {
    return trimmed.split(/\s+/).filter(Boolean).length;
  }

  // Unicode-aware: letters/numbers sequences (handles TR chars too)
  const matches = trimmed.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu);
  return matches?.length ?? 0;
}

const tool: ToolDefinition = {
  id: 'wordCounter',
  name: 'Word Counter',
  description: 'Count words, lines and sentences in text',
  category: 'text',
  keywords: ['word', 'count', 'counter', 'words', 'text', 'stats', 'statistics'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: true,
  options: [
    {
      id: 'mode',
      label: 'Word Mode',
      type: 'select',
      defaultValue: 'unicode',
      options: [
        { label: 'Unicode Words', value: 'unicode' },
        { label: 'Whitespace Split', value: 'whitespace' },
      ],
    },
  ],
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input) {
      return [
        'Words: 0',
        'Lines: 0',
        'Non-empty Lines: 0',
        'Sentences: 0',
        'Paragraphs: 0',
      ].join('\n');
    }

    const mode = (options?.mode as string) || 'unicode';
    const words = countWords(input, mode);
    const lines = input.split(/\r?\n/);
    const lineCount = lines.length;
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0).length;
    const paragraphs = input
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean).length;
    const sentences =
      input
        .trim()
        .match(/[^.!?…]+[.!?…]+|[^.!?…]+$/gu)
        ?.filter((s) => s.trim().length > 0).length ?? 0;

    return [
      `Words: ${words}`,
      `Lines: ${lineCount}`,
      `Non-empty Lines: ${nonEmptyLines}`,
      `Sentences: ${sentences}`,
      `Paragraphs: ${paragraphs}`,
    ].join('\n');
  },
};

export default tool;
