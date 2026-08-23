import type { ToolDefinition } from '@/types/tool';

// ─── Class-to-JSON Converter ──────────────────────────────────────────────
// Parses C#, TypeScript / JavaScript and Java class / interface definitions
// and produces a representative JSON object with sensible default values.

interface ParsedProperty {
  name: string;
  type: string;
  nullable: boolean;
}

// ── Type → default-value mapping ──────────────────────────────────────────

function defaultValueForType(type: string, nullable: boolean): unknown {
  if (nullable) return null;

  const t = type.toLowerCase().replace(/\?$/, '').trim();

  // Booleans
  if (['bool', 'boolean'].includes(t)) return false;

  // Integers
  if (['int', 'int32', 'int64', 'long', 'short', 'byte', 'sbyte', 'uint', 'ushort', 'ulong', 'number', 'integer', 'bigint'].includes(t))
    return 0;

  // Floating point
  if (['float', 'double', 'decimal', 'single'].includes(t)) return 0.0;

  // Strings / chars
  if (['string', 'char', 'guid', 'uuid'].includes(t)) return '';

  // Date / time
  if (['datetime', 'datetimeoffset', 'date', 'timespan', 'timestamp'].includes(t))
    return new Date().toISOString();

  // Collections / arrays
  if (/^(list|ienumerable|icollection|ilist|hashset|array|set)\s*</.test(t) || t.endsWith('[]'))
    return [];

  // Dictionaries / maps
  if (/^(dictionary|idictionary|map|hashmap|sorteddictionary|concurrentdictionary)\s*</.test(t))
    return {};

  // Generic object / dynamic / any
  if (['object', 'dynamic', 'any', 'unknown', 'jobject', 'jsonobject'].includes(t))
    return {};

  // Fallback – treat as nested object
  return {};
}

// ── C# Parser ─────────────────────────────────────────────────────────────

function parseCSharp(input: string): ParsedProperty[] {
  const props: ParsedProperty[] = [];

  // Match: public Type? Name { get; set; }
  const propRe = /(?:public|protected|internal|private)\s+([^\s]+(?:\s*<[^>]+>)?(?:\s*\[\s*\])?)\s*\??\s+(\w+)\s*\{[^}]*\}/g;
  let m: RegExpExecArray | null;

  while ((m = propRe.exec(input)) !== null) {
    const rawType = m[1].trim();
    const name = m[2];
    const nullable = rawType.endsWith('?') || /\?\s*$/.test(m[0].split(name)[0]);
    props.push({ name, type: rawType.replace(/\?$/, ''), nullable });
  }

  return props;
}

// ── TypeScript / JavaScript Parser ────────────────────────────────────────

function parseTypeScript(input: string): ParsedProperty[] {
  const props: ParsedProperty[] = [];

  // Match:  name?: Type;  or  name: Type;
  const propRe = /(\w+)\s*(\?)?\s*:\s*([^;,\n}]+)/g;
  let m: RegExpExecArray | null;

  while ((m = propRe.exec(input)) !== null) {
    const name = m[1];
    const nullable = m[2] === '?' || m[3].trim().includes('null');
    const rawType = m[3].trim().replace(/\s*\|\s*null/gi, '').replace(/\s*\|\s*undefined/gi, '');
    props.push({ name, type: rawType, nullable });
  }

  return props;
}

// ── Java Parser ───────────────────────────────────────────────────────────

function parseJava(input: string): ParsedProperty[] {
  const props: ParsedProperty[] = [];

  // Match: private Type name;
  const propRe = /(?:public|protected|private)\s+([^\s]+(?:\s*<[^>]+>)?(?:\s*\[\s*\])?)\s+(\w+)\s*[;=]/g;
  let m: RegExpExecArray | null;

  while ((m = propRe.exec(input)) !== null) {
    const rawType = m[1].trim();
    const name = m[2];
    // Exclude method declarations (they have parentheses after the name in original text)
    const afterName = input.slice(m.index + m[0].length).trimStart();
    if (afterName.startsWith('(')) continue;
    props.push({ name, type: rawType, nullable: false });
  }

  return props;
}

// ── Language Detection ────────────────────────────────────────────────────

type Language = 'csharp' | 'typescript' | 'java';

function detectLanguage(input: string): Language {
  // C# indicators
  if (/\{\s*get\s*;/i.test(input) || /\bnamespace\s+\w/i.test(input) || /\busing\s+System/i.test(input))
    return 'csharp';

  // TypeScript / JS indicators
  if (/\binterface\s+\w/i.test(input) && /:\s*\w+/.test(input) && !/\{\s*get\s*;/.test(input))
    return 'typescript';
  if (/\btype\s+\w+\s*=/.test(input)) return 'typescript';
  if (/\bexport\s+(class|interface|type)\b/.test(input)) return 'typescript';

  // Java indicators
  if (/\bimport\s+java\b/.test(input) || /\bpackage\s+[\w.]+\s*;/.test(input))
    return 'java';

  // Heuristic: { get; set; } is very C#
  if (/\bget\b.*\bset\b/.test(input)) return 'csharp';

  // Heuristic: semicolon-terminated field with access modifier → Java
  if (/(?:public|private|protected)\s+\w+\s+\w+\s*;/.test(input)) return 'java';

  // Default to TypeScript (broadest property syntax)
  return 'typescript';
}

function parse(input: string, lang: Language): ParsedProperty[] {
  switch (lang) {
    case 'csharp':
      return parseCSharp(input);
    case 'typescript':
      return parseTypeScript(input);
    case 'java':
      return parseJava(input);
  }
}

// ── Build JSON ────────────────────────────────────────────────────────────

function buildJson(props: ParsedProperty[], indent: number | string): string {
  if (props.length === 0) return '{}';

  const obj: Record<string, unknown> = {};
  for (const p of props) {
    // camelCase by default (convention for JSON)
    const key = p.name.charAt(0).toLowerCase() + p.name.slice(1);
    obj[key] = defaultValueForType(p.type, p.nullable);
  }

  return JSON.stringify(obj, null, indent);
}

// ─── Tool Definition ──────────────────────────────────────────────────────

const tool: ToolDefinition = {
  id: 'classToJson',
  name: 'Class to JSON',
  description: 'Convert C#, TypeScript or Java class / interface definitions to JSON',
  category: 'data',
  keywords: [
    'class', 'json', 'convert', 'csharp', 'c#', 'typescript', 'java',
    'model', 'dto', 'interface', 'pojo', 'poco', 'schema',
  ],
  inputType: 'code',
  outputType: 'json',
  autoTransform: true,
  options: [
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
    {
      id: 'language',
      label: 'Language',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto Detect', value: 'auto' },
        { label: 'C#', value: 'csharp' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Java', value: 'java' },
      ],
    },
    {
      id: 'preserveCase',
      label: 'Preserve Property Case',
      type: 'boolean',
      defaultValue: false,
    },
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    // Detect class / interface definitions
    return (
      /\b(class|interface|type)\s+\w+/.test(trimmed) &&
      (/{/.test(trimmed)) &&
      !trimmed.startsWith('{') &&
      !trimmed.startsWith('[')
    );
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const langOpt = (options?.language as string) ?? 'auto';
      const lang: Language = langOpt === 'auto' ? detectLanguage(input) : (langOpt as Language);
      const preserveCase = options?.preserveCase === true;

      const indent =
        options?.indentation === 'tab'
          ? '\t'
          : Number(options?.indentation === '4' ? 4 : 2);

      let props = parse(input, lang);

      if (props.length === 0) {
        return '// No properties found. Ensure the input contains a valid class or interface definition.';
      }

      if (preserveCase) {
        // Keep original property names instead of camelCasing
        const obj: Record<string, unknown> = {};
        for (const p of props) {
          obj[p.name] = defaultValueForType(p.type, p.nullable);
        }
        return JSON.stringify(obj, null, indent);
      }

      return buildJson(props, indent);
    } catch (e) {
      if (e instanceof Error) return `Error: ${e.message}`;
      return 'Error: Failed to parse class definition';
    }
  },
};

export default tool;
