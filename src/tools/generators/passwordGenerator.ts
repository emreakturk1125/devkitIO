import type { ToolDefinition } from '@/types/tool';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?';

function randomInt(max: number): number {
  if (max <= 0) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function shuffle(chars: string[]): string[] {
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
  }
  return chars;
}

function pick(pool: string): string {
  return pool.charAt(randomInt(pool.length));
}

const tool: ToolDefinition = {
  id: 'passwordGenerator',
  name: 'Password Generator',
  description: 'Generate random passwords with length and character-set options',
  category: 'generators',
  keywords: ['password', 'generate', 'random', 'secret', 'security'],
  inputType: 'text',
  outputType: 'text',
  autoTransform: false,
  requiresInput: false,
  options: [
    { id: 'count', label: 'Count', type: 'number', defaultValue: 1 },
    { id: 'length', label: 'Length', type: 'number', defaultValue: 16 },
    { id: 'uppercase', label: 'Uppercase', type: 'boolean', defaultValue: true },
    { id: 'lowercase', label: 'Lowercase', type: 'boolean', defaultValue: true },
    { id: 'numbers', label: 'Numbers', type: 'boolean', defaultValue: true },
    { id: 'symbols', label: 'Symbols', type: 'boolean', defaultValue: true },
  ],
  process: (_input: string, options?: Record<string, unknown>) => {
    try {
      const lengthRaw = parseInt(String(options?.length ?? '16'), 10);
      const countRaw = parseInt(String(options?.count ?? '1'), 10);
      const length = Number.isNaN(lengthRaw) ? 16 : Math.max(4, Math.min(256, lengthRaw));
      const count = Number.isNaN(countRaw) ? 1 : Math.max(1, Math.min(100, countRaw));

      const pools: string[] = [];
      if (options?.uppercase !== false) pools.push(UPPER);
      if (options?.lowercase !== false) pools.push(LOWER);
      if (options?.numbers !== false) pools.push(NUMBERS);
      if (options?.symbols !== false) pools.push(SYMBOLS);

      if (pools.length === 0) {
        return 'Select at least one character set.';
      }

      const all = pools.join('');
      const passwords: string[] = [];

      for (let n = 0; n < count; n++) {
        const chars: string[] = pools.map(pick);
        while (chars.length < length) {
          chars.push(pick(all));
        }
        passwords.push(shuffle(chars).slice(0, length).join(''));
      }

      return passwords.join('\n');
    } catch (e) {
      if (e instanceof Error) return `Error generating password: ${e.message}`;
      return 'Error generating password';
    }
  },
};

export default tool;
