export interface CodeToken {
  text: string;
  kind: 'text' | 'string' | 'keyword' | 'number' | 'punct';
}

const TOKEN_RE =
  /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(?:SELECT|FROM|WHERE|AND|OR|JOIN|LEFT|RIGHT|INNER|OUTER|GROUP|ORDER|BY|AS|IN|ON|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|NULL|NOT|TRUE|FALSE|DISTINCT|LIMIT|UNION|CASE|WHEN|THEN|END|const|let|var|function|return|if|else|class|public|private|protected|import|export|new|typeof|interface|type|string|number|boolean|async|await)\b|\b\d+(?:\.\d+)?\b|[{}()[\],;:.<>]/gi;

export function tokenizeCode(source: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  const re = new RegExp(TOKEN_RE.source, 'gi');
  let last = 0;
  for (const match of source.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ text: source.slice(last, index), kind: 'text' });
    const raw = match[0];
    let kind: CodeToken['kind'] = 'punct';
    if (match[1]) kind = 'string';
    else if (/^\d/.test(raw)) kind = 'number';
    else if (/[A-Za-z]/.test(raw)) kind = 'keyword';
    tokens.push({ text: raw, kind });
    last = index + raw.length;
  }
  if (last < source.length) tokens.push({ text: source.slice(last), kind: 'text' });
  if (tokens.length === 0) tokens.push({ text: source, kind: 'text' });
  return tokens;
}
