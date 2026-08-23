import type { ToolDefinition } from '@/types/tool';

// ─── Lightweight XML Formatter ────────────────────────────────────────────
// Pure‑JS implementation — no external dependency needed for pretty‑printing.

function formatXml(
  xmlStr: string,
  indent: string,
  sortAttributes: boolean,
): string {
  // Normalise line endings
  let xml = xmlStr.replace(/\r\n?/g, '\n').trim();

  // Remove existing whitespace between tags for a clean re-indent
  xml = xml.replace(/>\s+</g, '><');

  const output: string[] = [];
  let depth = 0;
  let i = 0;

  while (i < xml.length) {
    // ── XML Declaration / Processing Instructions ──────────────────
    if (xml.startsWith('<?', i)) {
      const end = xml.indexOf('?>', i);
      if (end === -1) throw new Error('Unterminated processing instruction');
      output.push(indent.repeat(depth) + xml.slice(i, end + 2));
      i = end + 2;
      continue;
    }

    // ── Comments ───────────────────────────────────────────────────
    if (xml.startsWith('<!--', i)) {
      const end = xml.indexOf('-->', i);
      if (end === -1) throw new Error('Unterminated comment');
      output.push(indent.repeat(depth) + xml.slice(i, end + 3));
      i = end + 3;
      continue;
    }

    // ── CDATA ──────────────────────────────────────────────────────
    if (xml.startsWith('<![CDATA[', i)) {
      const end = xml.indexOf(']]>', i);
      if (end === -1) throw new Error('Unterminated CDATA section');
      output.push(indent.repeat(depth) + xml.slice(i, end + 3));
      i = end + 3;
      continue;
    }

    // ── DOCTYPE ────────────────────────────────────────────────────
    if (xml.startsWith('<!DOCTYPE', i) || xml.startsWith('<!doctype', i)) {
      const end = xml.indexOf('>', i);
      if (end === -1) throw new Error('Unterminated DOCTYPE');
      output.push(indent.repeat(depth) + xml.slice(i, end + 1));
      i = end + 1;
      continue;
    }

    // ── Closing tag ────────────────────────────────────────────────
    if (xml.startsWith('</', i)) {
      const end = xml.indexOf('>', i);
      if (end === -1) throw new Error('Unterminated closing tag');
      depth = Math.max(0, depth - 1);
      output.push(indent.repeat(depth) + xml.slice(i, end + 1));
      i = end + 1;
      continue;
    }

    // ── Opening / self‑closing tag ─────────────────────────────────
    if (xml[i] === '<') {
      const end = xml.indexOf('>', i);
      if (end === -1) throw new Error('Unterminated tag');
      let tag = xml.slice(i, end + 1);
      const selfClosing = tag.endsWith('/>');

      // Optional: sort attributes alphabetically
      if (sortAttributes) {
        tag = sortTagAttributes(tag);
      }

      output.push(indent.repeat(depth) + tag);
      if (!selfClosing) depth++;
      i = end + 1;
      continue;
    }

    // ── Text content ───────────────────────────────────────────────
    const nextTag = xml.indexOf('<', i);
    const text = nextTag === -1 ? xml.slice(i) : xml.slice(i, nextTag);
    if (text.trim()) {
      output.push(indent.repeat(depth) + text.trim());
    }
    i = nextTag === -1 ? xml.length : nextTag;
  }

  return output.join('\n');
}

/**
 * Sort attributes inside an XML tag alphabetically.
 */
function sortTagAttributes(tag: string): string {
  // Match tag name and attributes
  const match = tag.match(/^<(\/?[\w:.-]+)([\s\S]*?)(\s*\/?>)$/);
  if (!match) return tag;

  const [, tagName, attrStr, close] = match;
  const attrs: Array<[string, string]> = [];

  // Extract attribute="value" pairs
  const attrRe = /([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(attrStr)) !== null) {
    attrs.push([m[1], m[2] ?? m[3]]);
  }

  if (attrs.length === 0) return tag;

  attrs.sort((a, b) => a[0].localeCompare(b[0]));
  const sortedAttrs = attrs.map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<${tagName} ${sortedAttrs}${close}`;
}

// ─── Tool Definition ──────────────────────────────────────────────────────

const tool: ToolDefinition = {
  id: 'xmlFormatter',
  name: 'XML Formatter',
  description: 'Format, beautify and validate XML data',
  category: 'data',
  keywords: ['xml', 'format', 'beautify', 'pretty', 'markup', 'xslt', 'svg', 'xhtml'],
  inputType: 'xml',
  outputType: 'xml',
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
      id: 'sortAttributes',
      label: 'Sort Attributes',
      type: 'boolean',
      defaultValue: false,
    },
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    return (
      trimmed.startsWith('<?xml') ||
      trimmed.startsWith('<!DOCTYPE') ||
      (trimmed.startsWith('<') &&
        !trimmed.startsWith('{') &&
        trimmed.endsWith('>') &&
        /<\/[\w:.-]+>\s*$/.test(trimmed))
    );
  },
  process: (input: string, options?: Record<string, unknown>) => {
    if (!input.trim()) return '';

    const indentStr =
      options?.indentation === 'tab'
        ? '\t'
        : ' '.repeat(options?.indentation === '4' ? 4 : 2);

    const sortAttributes = options?.sortAttributes === true;

    try {
      return formatXml(input, indentStr, sortAttributes);
    } catch (e) {
      if (e instanceof Error) return `Invalid XML: ${e.message}`;
      return 'Invalid XML';
    }
  },
};

export default tool;
