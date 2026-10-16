export interface TextPart {
  kind: 'text' | 'link';
  text: string;
  href?: string;
}

const LINK_RE = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;

export function parseRichText(input: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of input.matchAll(LINK_RE)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ kind: 'text', text: input.slice(last, index) });
    parts.push({ kind: 'link', text: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < input.length) parts.push({ kind: 'text', text: input.slice(last) });
  if (parts.length === 0) parts.push({ kind: 'text', text: input });
  return parts;
}

/** Appends up to two sibling-tool links when the paragraph has none yet. */
export function withSiblingLinks(
  text: string,
  related: { name: string; href: string }[],
): string {
  if (related.length === 0 || text.includes('](')) return text;
  const links = related.slice(0, 2).map((item) => `[${item.name}](${item.href})`);
  const sentence =
    links.length === 1
      ? ` Continue with ${links[0]}.`
      : ` Continue with ${links[0]} and ${links[1]}.`;
  return text.replace(/\s*$/, '') + sentence;
}
