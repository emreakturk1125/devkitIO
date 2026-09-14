import type { ToolDefinition } from '@/types/tool';

const TIMESTAMP_CLAIMS = new Set(['exp', 'iat', 'nbf', 'auth_time']);

function base64UrlDecode(input: string): string {
  let b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4;
  if (pad) b64 += '='.repeat(4 - pad);

  const binaryStr = atob(b64);
  const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function prettyJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

function formatTimestamp(value: unknown): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const millis = value > 1e12 ? value : value * 1000;
  const date = new Date(millis);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function collectTimestamps(raw: string): string[] {
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    const lines: string[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (!TIMESTAMP_CLAIMS.has(key)) continue;
      const iso = formatTimestamp(value);
      if (iso) lines.push(`${key}: ${value} → ${iso}`);
    }
    return lines;
  } catch {
    return [];
  }
}

const tool: ToolDefinition = {
  id: 'jwtDecoder',
  name: 'JWT Decoder',
  description: 'Decode a JWT header and payload without verifying the signature',
  category: 'encoding',
  keywords: ['jwt', 'token', 'decode', 'json', 'web', 'bearer', 'header', 'payload'],
  inputType: 'text',
  outputType: 'code',
  autoTransform: true,
  relatedToolIds: ['base64', 'jsonFormatter'],
  longDescription: 'JWT Decoder is an offline-capable browser utility that unpacks JSON Web Tokens to display their header and payload in human-readable JSON format. It automatically parses standard timestamp claims such as expiration and issued-at times into ISO UTC strings.',
  howToUse: 'Paste an encoded JWT string into the input panel. The tool immediately decodes the header and payload sections, highlights decoded JSON structures, and lists human-readable date translations for standard Unix timestamp claims.',
  features: [
    'Instant parsing of JWT Header and Payload sections',
    'Automatic translation of Unix epoch claims (exp, iat, nbf, auth_time) to ISO dates',
    'Syntax-highlighted, formatted JSON view for nested claims',
    'Handles URL-safe Base64 encoding and padding variations',
    '100% private and client-side: secret tokens and credentials are never transmitted over the network'
  ],
  useCases: [
    'Verifying token expiration times and audience claims during auth debugging',
    'Inspecting custom role, permission, and user claims in OAuth2 / OIDC tokens',
    'Checking token algorithm and key IDs (kid) without requiring server-side tools'
  ],
  detect: (input: string) => {
    const trimmed = input.trim();
    return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(trimmed);
  },
  process: (input: string) => {
    if (!input.trim()) return '';

    try {
      const parts = input.trim().split('.');
      if (parts.length < 2 || parts.length > 3) {
        return 'Invalid JWT: expected 2 or 3 parts separated by dots.';
      }

      const [headerPart, payloadPart, signaturePart] = parts;

      let headerJson: string;
      let payloadJson: string;

      try {
        headerJson = base64UrlDecode(headerPart);
      } catch {
        return 'Invalid JWT: header is not valid Base64URL.';
      }

      try {
        payloadJson = base64UrlDecode(payloadPart);
      } catch {
        return 'Invalid JWT: payload is not valid Base64URL.';
      }

      const sections = [
        '=== Header ===',
        prettyJson(headerJson),
        '',
        '=== Payload ===',
        prettyJson(payloadJson),
      ];

      const timestamps = collectTimestamps(payloadJson);
      if (timestamps.length > 0) {
        sections.push('', '--- Claim timestamps (UTC) ---', ...timestamps);
      }

      sections.push('', '=== Signature ===');
      if (signaturePart) {
        sections.push('Present (not verified)');
      } else {
        sections.push('Missing');
      }

      return sections.join('\n');
    } catch (e) {
      if (e instanceof Error) return `Invalid JWT: ${e.message}`;
      return 'Invalid JWT';
    }
  },
};

export default tool;
