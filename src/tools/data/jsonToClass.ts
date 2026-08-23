import type { ToolDefinition } from '@/types/tool';

// ─── JSON-to-Class Converter ──────────────────────────────────────────────
// Takes a JSON object and generates a class / interface definition in
// C#, TypeScript or Java.

type Language = 'csharp' | 'typescript' | 'java';

// ── Type Inference ────────────────────────────────────────────────────────

function inferType(value: unknown, lang: Language, className: string, nested: Map<string, unknown>): string {
  if (value === null || value === undefined) {
    switch (lang) {
      case 'csharp': return 'object?';
      case 'typescript': return 'any';
      case 'java': return 'Object';
    }
  }

  if (typeof value === 'boolean') {
    switch (lang) {
      case 'csharp': return 'bool';
      case 'typescript': return 'boolean';
      case 'java': return 'boolean';
    }
  }

  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      switch (lang) {
        case 'csharp': return 'int';
        case 'typescript': return 'number';
        case 'java': return 'int';
      }
    }
    switch (lang) {
      case 'csharp': return 'double';
      case 'typescript': return 'number';
      case 'java': return 'double';
    }
  }

  if (typeof value === 'string') {
    // Detect date strings
    if (/^\d{4}-\d{2}-\d{2}(T|\s)/.test(value)) {
      switch (lang) {
        case 'csharp': return 'DateTime';
        case 'typescript': return 'string';
        case 'java': return 'LocalDateTime';
      }
    }
    // Detect GUIDs
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
      switch (lang) {
        case 'csharp': return 'Guid';
        case 'typescript': return 'string';
        case 'java': return 'UUID';
      }
    }
    switch (lang) {
      case 'csharp': return 'string';
      case 'typescript': return 'string';
      case 'java': return 'String';
    }
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      switch (lang) {
        case 'csharp': return 'List<object>';
        case 'typescript': return 'any[]';
        case 'java': return 'List<Object>';
      }
    }
    const itemType = inferType(value[0], lang, className, nested);
    switch (lang) {
      case 'csharp': return `List<${itemType}>`;
      case 'typescript': return `${itemType}[]`;
      case 'java': return `List<${boxJavaType(itemType)}>`;
    }
  }

  if (typeof value === 'object') {
    // Nested object → generate a nested class
    const nestedName = pascalCase(className);
    nested.set(nestedName, value);
    return nestedName;
  }

  switch (lang) {
    case 'csharp': return 'object';
    case 'typescript': return 'any';
    case 'java': return 'Object';
  }

  return 'object';
}

function boxJavaType(t: string): string {
  const map: Record<string, string> = {
    int: 'Integer',
    double: 'Double',
    boolean: 'Boolean',
    float: 'Float',
    long: 'Long',
  };
  return map[t] ?? t;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function pascalCase(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, c: string) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (c) => c.toUpperCase());
}

function camelCase(s: string): string {
  const p = pascalCase(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

// ── Generators ────────────────────────────────────────────────────────────

function generateCSharp(
  obj: Record<string, unknown>,
  className: string,
  indent: string,
): string {
  const nested = new Map<string, unknown>();
  const lines: string[] = [];

  lines.push(`public class ${pascalCase(className)}`);
  lines.push('{');

  const entries = Object.entries(obj);
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    const propName = pascalCase(key);
    const propType = inferType(value, 'csharp', propName, nested);
    lines.push(`${indent}public ${propType} ${propName} { get; set; }`);
    if (i < entries.length - 1) lines.push('');
  }

  lines.push('}');

  // Generate nested classes
  for (const [name, val] of nested) {
    lines.push('');
    lines.push(generateCSharp(val as Record<string, unknown>, name, indent));
  }

  return lines.join('\n');
}

function generateTypeScript(
  obj: Record<string, unknown>,
  className: string,
  indent: string,
  useInterface: boolean,
): string {
  const nested = new Map<string, unknown>();
  const lines: string[] = [];
  const keyword = useInterface ? 'interface' : 'class';

  lines.push(`export ${keyword} ${pascalCase(className)} {`);

  const entries = Object.entries(obj);
  for (const [key, value] of entries) {
    const propName = camelCase(key);
    const propType = inferType(value, 'typescript', pascalCase(key), nested);
    if (useInterface) {
      lines.push(`${indent}${propName}: ${propType};`);
    } else {
      lines.push(`${indent}${propName}: ${propType};`);
    }
  }

  lines.push('}');

  // Generate nested interfaces / classes
  for (const [name, val] of nested) {
    lines.push('');
    lines.push(generateTypeScript(val as Record<string, unknown>, name, indent, useInterface));
  }

  return lines.join('\n');
}

function generateJava(
  obj: Record<string, unknown>,
  className: string,
  indent: string,
): string {
  const nested = new Map<string, unknown>();
  const lines: string[] = [];

  lines.push(`public class ${pascalCase(className)} {`);
  lines.push('');

  const entries = Object.entries(obj);

  // Fields
  for (const [key, value] of entries) {
    const fieldName = camelCase(key);
    const fieldType = inferType(value, 'java', pascalCase(key), nested);
    lines.push(`${indent}private ${fieldType} ${fieldName};`);
  }

  lines.push('');

  // Getters & Setters
  for (const [key, value] of entries) {
    const fieldName = camelCase(key);
    const methodName = pascalCase(key);
    const fieldType = inferType(value, 'java', pascalCase(key), new Map());
    lines.push(`${indent}public ${fieldType} get${methodName}() {`);
    lines.push(`${indent}${indent}return this.${fieldName};`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}public void set${methodName}(${fieldType} ${fieldName}) {`);
    lines.push(`${indent}${indent}this.${fieldName} = ${fieldName};`);
    lines.push(`${indent}}`);
    lines.push('');
  }

  lines.push('}');

  // Generate nested classes
  for (const [name, val] of nested) {
    lines.push('');
    lines.push(generateJava(val as Record<string, unknown>, name, indent));
  }

  return lines.join('\n');
}

// ─── Tool Definition ──────────────────────────────────────────────────────

const tool: ToolDefinition = {
  id: 'jsonToClass',
  name: 'JSON to Class',
  description: 'Generate C#, TypeScript or Java class definitions from JSON',
  category: 'data',
  keywords: [
    'json', 'class', 'generate', 'csharp', 'c#', 'typescript', 'java',
    'model', 'dto', 'interface', 'pojo', 'poco', 'schema', 'convert',
  ],
  inputType: 'json',
  outputType: 'code',
  autoTransform: true,
  options: [
    {
      id: 'language',
      label: 'Target Language',
      type: 'select',
      defaultValue: 'csharp',
      options: [
        { label: 'C#', value: 'csharp' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Java', value: 'java' },
      ],
    },
    {
      id: 'className',
      label: 'Root Class Name',
      type: 'text',
      defaultValue: 'Root',
      placeholder: 'Root',
    },
    {
      id: 'indentation',
      label: 'Indentation',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '2 Spaces', value: '2' },
        { label: '4 Spaces', value: '4' },
        { label: 'Tab', value: 'tab' },
      ],
    },
    {
      id: 'useInterface',
      label: 'Use Interface (TS only)',
      type: 'boolean',
      defaultValue: true,
    },
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    return trimmed.startsWith('{') && trimmed.endsWith('}');
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const data = JSON.parse(input);

      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        // If it's an array, use the first element
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
          return processObject(data[0] as Record<string, unknown>, options);
        }
        return '// Input must be a JSON object (or an array of objects).';
      }

      return processObject(data as Record<string, unknown>, options);
    } catch (e) {
      if (e instanceof Error) return `Invalid JSON: ${e.message}`;
      return 'Invalid JSON';
    }
  },
};

function processObject(
  obj: Record<string, unknown>,
  options?: Record<string, unknown>,
): string {
  const lang = ((options?.language as string) ?? 'csharp') as Language;
  const className = ((options?.className as string) ?? 'Root') || 'Root';
  const useInterface = options?.useInterface !== false;
  const indent =
    options?.indentation === 'tab'
      ? '\t'
      : ' '.repeat(options?.indentation === '2' ? 2 : 4);

  switch (lang) {
    case 'csharp':
      return generateCSharp(obj, className, indent);
    case 'typescript':
      return generateTypeScript(obj, className, indent, useInterface);
    case 'java':
      return generateJava(obj, className, indent);
  }
}

export default tool;
