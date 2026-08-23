import type { ToolDefinition } from '@/types/tool';

type ChangeType = 'added' | 'removed' | 'changed';

interface Change {
  type: ChangeType;
  path: string;
  from?: string;
  to?: string;
}

const MISSING = Symbol('missing');

function stringifyValue(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function walk(left: unknown, right: unknown, path: string, changes: Change[]): void {
  if (left === MISSING) {
    changes.push({ type: 'added', path: path || '(root)', to: stringifyValue(right) });
    return;
  }
  if (right === MISSING) {
    changes.push({ type: 'removed', path: path || '(root)', from: stringifyValue(left) });
    return;
  }

  if (Object.is(left, right)) return;

  if (Array.isArray(left) && Array.isArray(right)) {
    const max = Math.max(left.length, right.length);
    for (let i = 0; i < max; i++) {
      const childPath = path ? `${path}[${i}]` : `[${i}]`;
      const l = i < left.length ? left[i] : MISSING;
      const r = i < right.length ? right[i] : MISSING;
      walk(l, r, childPath, changes);
    }
    return;
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    const sorted = Array.from(keys).sort((a, b) => a.localeCompare(b));
    for (const key of sorted) {
      const childPath = path ? `${path}.${key}` : key;
      const hasL = Object.prototype.hasOwnProperty.call(left, key);
      const hasR = Object.prototype.hasOwnProperty.call(right, key);
      walk(hasL ? left[key] : MISSING, hasR ? right[key] : MISSING, childPath, changes);
    }
    return;
  }

  if (stringifyValue(left) !== stringifyValue(right)) {
    changes.push({
      type: 'changed',
      path: path || '(root)',
      from: stringifyValue(left),
      to: stringifyValue(right),
    });
  }
}

function formatGroup(title: string, items: Change[], line: (c: Change) => string): string[] {
  if (items.length === 0) return [];
  return [`${title} (${items.length})`, ...items.map(line), ''];
}

const tool: ToolDefinition = {
  id: 'jsonDiff',
  name: 'JSON Diff',
  description: 'Compare two JSON documents and list added, removed and changed values',
  category: 'data',
  keywords: ['json', 'diff', 'compare', 'difference', 'patch'],
  inputType: 'dual',
  outputType: 'text',
  autoTransform: true,
  process: (input: string, options?: Record<string, unknown>) => {
    const secondaryInput = (options?.secondaryInput as string) || '';
    if (!input.trim() && !secondaryInput.trim()) return '';

    let left: unknown;
    let right: unknown;

    try {
      left = input.trim() ? JSON.parse(input) : null;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid JSON';
      return `Invalid JSON (original): ${message}`;
    }

    try {
      right = secondaryInput.trim() ? JSON.parse(secondaryInput) : null;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid JSON';
      return `Invalid JSON (modified): ${message}`;
    }

    try {
      const changes: Change[] = [];
      walk(left, right, '', changes);

      if (changes.length === 0) return 'No differences';

      const added = changes.filter((c) => c.type === 'added');
      const removed = changes.filter((c) => c.type === 'removed');
      const changed = changes.filter((c) => c.type === 'changed');

      const lines = [
        ...formatGroup('Added', added, (c) => `  + ${c.path}: ${c.to}`),
        ...formatGroup('Removed', removed, (c) => `  - ${c.path}: ${c.from}`),
        ...formatGroup('Changed', changed, (c) => `  ~ ${c.path}: ${c.from} → ${c.to}`),
      ];

      return lines.join('\n').trimEnd();
    } catch (e) {
      if (e instanceof Error) return `Error comparing JSON: ${e.message}`;
      return 'Error comparing JSON';
    }
  },
};

export default tool;
