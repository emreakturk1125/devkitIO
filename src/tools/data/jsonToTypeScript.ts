import type { ToolDefinition } from '@/types/tool';

function pascalCase(s: string): string {
  const cleaned = s
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, c: string) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (c) => c.toUpperCase());
  return cleaned.length > 0 ? cleaned : 'Item';
}

function isValidIdent(s: string): boolean {
  return /^[A-Za-z_$][\w$]*$/.test(s);
}

function formatPropName(key: string): string {
  return isValidIdent(key) ? key : JSON.stringify(key);
}

function mergeObjects(objs: Record<string, unknown>[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const obj of objs) {
    for (const [k, v] of Object.entries(obj)) {
      if (!(k in result) || result[k] === null) {
        result[k] = v;
      }
    }
  }
  return result;
}

function generate(data: unknown, rootName: string, indent: string): string {
  const interfaces: Array<{ name: string; obj: Record<string, unknown> }> = [];
  const usedNames = new Set<string>();

  function unique(base: string): string {
    const root = isValidIdent(base) && base.length > 0 ? base : 'Item';
    if (!usedNames.has(root)) {
      usedNames.add(root);
      return root;
    }
    let i = 2;
    while (usedNames.has(`${root}${i}`)) i++;
    const name = `${root}${i}`;
    usedNames.add(name);
    return name;
  }

  function infer(value: unknown, hint: string): string {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') return 'string';

    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';

      const objects = value.filter(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' && item !== null && !Array.isArray(item),
      );

      if (objects.length === value.length) {
        const merged = mergeObjects(objects);
        const hintName = pascalCase(hint.replace(/s$/i, '') || hint);
        const name = unique(hintName === rootName ? `${hintName}Item` : hintName);
        interfaces.push({ name, obj: merged });
        return `${name}[]`;
      }

      const itemTypes = Array.from(new Set(value.map((item) => infer(item, hint))));
      if (itemTypes.length === 1) return `${itemTypes[0]}[]`;
      return `(${itemTypes.join(' | ')})[]`;
    }

    if (typeof value === 'object') {
      const name = unique(pascalCase(hint));
      interfaces.push({ name, obj: value as Record<string, unknown> });
      return name;
    }

    return 'unknown';
  }

  function renderAll(): string {
    const blocks: string[] = [];
    for (let i = 0; i < interfaces.length; i++) {
      const current = interfaces[i];
      const lines = [`interface ${current.name} {`];
      for (const [key, value] of Object.entries(current.obj)) {
        lines.push(`${indent}${formatPropName(key)}: ${infer(value, key)};`);
      }
      lines.push('}');
      blocks.push(lines.join('\n'));
    }
    return blocks.join('\n\n');
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return `type ${rootName} = unknown[];`;

    const objects = data.filter(
      (item): item is Record<string, unknown> =>
        typeof item === 'object' && item !== null && !Array.isArray(item),
    );

    if (objects.length === data.length) {
      usedNames.add(rootName);
      const itemName = unique('Item');
      interfaces.push({ name: itemName, obj: mergeObjects(objects) });
      const body = renderAll();
      return `type ${rootName} = ${itemName}[];\n\n${body}`;
    }

    const itemTypes = Array.from(new Set(data.map((item) => infer(item, 'Item'))));
    const union = itemTypes.length === 1 ? itemTypes[0] : `(${itemTypes.join(' | ')})`;
    const body = renderAll();
    const alias = `type ${rootName} = ${union}[];`;
    return body ? `${alias}\n\n${body}` : alias;
  }

  if (typeof data === 'object' && data !== null) {
    usedNames.add(rootName);
    interfaces.push({ name: rootName, obj: data as Record<string, unknown> });
    return renderAll();
  }

  return `type ${rootName} = ${infer(data, rootName)};`;
}

const tool: ToolDefinition = {
  id: 'jsonToTypeScript',
  name: 'JSON to TypeScript',
  description: 'Generate TypeScript interfaces from JSON',
  category: 'data',
  keywords: ['json', 'typescript', 'interface', 'type', 'convert', 'ts', 'dto'],
  inputType: 'json',
  outputType: 'code',
  autoTransform: true,
  options: [
    {
      id: 'rootName',
      label: 'Root Interface Name',
      type: 'text',
      defaultValue: 'Root',
      placeholder: 'Root',
    },
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
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    return trimmed.startsWith('{') || trimmed.startsWith('[');
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const data = JSON.parse(input);
      const rootName = ((options?.rootName as string) || 'Root').trim() || 'Root';
      const indent =
        options?.indentation === 'tab'
          ? '\t'
          : ' '.repeat(options?.indentation === '4' ? 4 : 2);
      return generate(data, isValidIdent(rootName) ? rootName : 'Root', indent);
    } catch (e) {
      if (e instanceof Error) return `Invalid JSON: ${e.message}`;
      return 'Invalid JSON';
    }
  },
};

export default tool;
