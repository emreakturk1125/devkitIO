import type { ToolDefinition } from '@/types/tool';

interface SqlColumn {
  name: string;
  sqlType: string;
  nullable: boolean;
}

function pascalCase(s: string): string {
  const cleaned = s
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, c: string) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (c) => c.toUpperCase());
  return cleaned.length > 0 ? cleaned : 'Root';
}

function unquoteIdent(raw: string): string {
  const s = raw.trim();
  if (
    (s.startsWith('[') && s.endsWith(']')) ||
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith('`') && s.endsWith('`')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

function splitTopLevel(sql: string, delimiter: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';

  for (const ch of sql) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);

    if (ch === delimiter && depth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function mapSqlType(sqlType: string, nullable: boolean): string {
  const t = sqlType.trim().toLowerCase();
  let csharp = 'string';

  if (/\buniqueidentifier\b/.test(t)) csharp = 'Guid';
  else if (/\bbit\b/.test(t)) csharp = 'bool';
  else if (/\bbigint\b/.test(t)) csharp = 'long';
  else if (/\b(int|integer)\b/.test(t)) csharp = 'int';
  else if (/\bsmallint\b/.test(t)) csharp = 'short';
  else if (/\btinyint\b/.test(t)) csharp = 'byte';
  else if (/\b(decimal|numeric|money|smallmoney)\b/.test(t)) csharp = 'decimal';
  else if (/\b(float|double)\b/.test(t)) csharp = 'double';
  else if (/\breal\b/.test(t)) csharp = 'float';
  else if (/\bdatetimeoffset\b/.test(t)) csharp = 'DateTimeOffset';
  else if (/\b(datetime2|datetime|smalldatetime|date)\b/.test(t)) csharp = 'DateTime';
  else if (/\btime\b/.test(t)) csharp = 'TimeSpan';
  else if (/\b(varbinary|binary|image|rowversion|timestamp)\b/.test(t)) csharp = 'byte[]';
  else csharp = 'string';

  if (nullable && csharp !== 'string' && csharp !== 'byte[]') {
    return `${csharp}?`;
  }
  if (nullable && csharp === 'string') {
    return 'string?';
  }
  return csharp;
}

function isConstraint(def: string): boolean {
  return /^(CONSTRAINT|PRIMARY\s+KEY|UNIQUE|FOREIGN\s+KEY|CHECK|INDEX|KEY)\b/i.test(def.trim());
}

function parseColumn(def: string): SqlColumn | null {
  const trimmed = def.trim();
  if (!trimmed || isConstraint(trimmed)) return null;

  const match = trimmed.match(
    /^(\[[^\]]+\]|"[^"]+"|`[^`]+`|[A-Za-z_][\w$]*)\s+([A-Za-z_][\w$]*(?:\s*\([^)]*\))?)/,
  );
  if (!match) return null;

  const name = unquoteIdent(match[1]);
  const sqlType = match[2].replace(/\s+/g, '');
  const nullable = !/\bNOT\s+NULL\b/i.test(trimmed);

  return { name, sqlType, nullable };
}

function extractTableName(sql: string): string | null {
  const match = sql.match(
    /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?((?:\[[^\]]+\]|"[^"]+"|`[^`]+`|[A-Za-z_][\w$]*)(?:\s*\.\s*(?:\[[^\]]+\]|"[^"]+"|`[^`]+`|[A-Za-z_][\w$]*))?)/i,
  );
  if (!match) return null;
  const parts = match[1].split('.').map((p) => unquoteIdent(p.trim()));
  return parts[parts.length - 1] || null;
}

function extractColumnBody(sql: string): string | null {
  const createIdx = sql.search(/CREATE\s+TABLE/i);
  if (createIdx === -1) return sql;

  const open = sql.indexOf('(', createIdx);
  if (open === -1) return null;

  let depth = 0;
  for (let i = open; i < sql.length; i++) {
    if (sql[i] === '(') depth++;
    else if (sql[i] === ')') {
      depth--;
      if (depth === 0) return sql.slice(open + 1, i);
    }
  }
  return sql.slice(open + 1);
}

function parseSql(input: string): { tableName: string; columns: SqlColumn[] } | { error: string } {
  const sql = input.replace(/\r\n?/g, '\n').trim();
  if (!sql) return { error: 'Empty input' };

  const tableName = extractTableName(sql) ?? 'Root';
  const body = extractColumnBody(sql);
  if (!body) {
    return { error: 'Could not parse SQL. Provide a CREATE TABLE statement or a column list.' };
  }

  const parts = splitTopLevel(body, ',');
  const columns = parts.map(parseColumn).filter((c): c is SqlColumn => c !== null);

  if (columns.length === 0) {
    return { error: 'No columns could be parsed from the SQL input.' };
  }

  return { tableName, columns };
}

const tool: ToolDefinition = {
  id: 'sqlToCSharpClass',
  name: 'SQL to C# Class',
  description: 'Generate a C# class from a CREATE TABLE statement or column list',
  category: 'sql',
  keywords: ['sql', 'csharp', 'c#', 'class', 'entity', 'dto', 'table', 'model', 'poco'],
  inputType: 'sql',
  outputType: 'code',
  autoTransform: true,
  options: [
    {
      id: 'className',
      label: 'Root Class Name',
      type: 'text',
      defaultValue: '',
      placeholder: 'From table name',
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
  ],
  detect: (input: string) => {
    const upper = input.toUpperCase();
    return /\bCREATE\s+TABLE\b/.test(upper) || /\b(INT|NVARCHAR|VARCHAR|DATETIME|BIGINT)\b/.test(upper);
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    try {
      const parsed = parseSql(input);
      if ('error' in parsed) return parsed.error;

      const override = ((options?.className as string) || '').trim();
      const className = pascalCase(override || parsed.tableName);
      const indent =
        options?.indentation === 'tab'
          ? '\t'
          : ' '.repeat(options?.indentation === '2' ? 2 : 4);

      const lines = [`public class ${className}`, '{'];
      for (let i = 0; i < parsed.columns.length; i++) {
        const col = parsed.columns[i];
        const propType = mapSqlType(col.sqlType, col.nullable);
        const propName = pascalCase(col.name);
        lines.push(`${indent}public ${propType} ${propName} { get; set; }`);
        if (i < parsed.columns.length - 1) lines.push('');
      }
      lines.push('}');
      return lines.join('\n');
    } catch (e) {
      if (e instanceof Error) return `Error converting SQL: ${e.message}`;
      return 'Error converting SQL';
    }
  },
};

export default tool;
