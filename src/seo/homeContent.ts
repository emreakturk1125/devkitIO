/**
 * Home page copy shared by the React app and `scripts/prerender-seo.mjs`.
 * Pure data module (no imports) so Node can load it with type stripping.
 */

export interface HomeFaqItem {
  q: string;
  a: string;
}

export function homeAboutParagraphs(toolCount: number, categoryCount: number): string[] {
  return [
    `DevKit is a free set of ${toolCount} browser-based developer tools in ${categoryCount} categories: JSON, XML and YAML formatting and conversion, SQL formatting and generators, JavaScript, TypeScript, HTML and CSS formatters, Base64 and JWT decoding, GUID, UUID and password generators, text and list utilities, a diff checker, a regex tester and an HTTP status lookup.`,
    'Pick a category or tool, paste or type your input into the editor, and read the result in the output panel. Most tools update as you type; the SQL, JavaScript, TypeScript, HTML, CSS and jQuery formatters run when you press Transform.',
    'The tools run in your browser with JavaScript, and the code does not send your input to a server. Press Ctrl+K (or \u2318K) to search all tools.',
  ];
}

export const homeFaq: HomeFaqItem[] = [
  {
    q: 'Is DevKit free?',
    a: 'Yes. Every tool is free to use and does not require an account or an installation.',
  },
  {
    q: 'Is my input uploaded anywhere?',
    a: 'No. The tools run in your browser and the code does not send your input to a server. The page loads its web fonts from Google Fonts.',
  },
  {
    q: 'Which tool should I start with?',
    a: 'Common starting points are the JSON Formatter, SQL Formatter, Base64 Encoder/Decoder, GUID Generator and Diff Compare. Use search (Ctrl+K) to find any other tool by name.',
  },
];

export interface CategorySeoContent {
  overview: string[];
  faq: HomeFaqItem[];
}

export const categorySeoContent: Record<string, CategorySeoContent> = {
  json: {
    overview: [
      'The JSON & Data Conversion suite helps backend, frontend, and DevOps engineers inspect, validate, minify, compare, and transform structured data payloads directly in the browser. Whether you are debugging a REST API response, converting JSON into strongly-typed C#, TypeScript, or Java models, or translating configs between JSON, XML, and YAML, every operation runs locally on your machine.',
      'Unlike server-based converters that log or store pasted payloads, DevKit processes your JSON in memory using standard browser APIs. You can safely format production configurations, inspect nested object hierarchies, sort keys alphabetically for clean Git diffs, and pinpoint syntax errors down to the exact line and column.',
    ],
    faq: [
      {
        q: 'Are my JSON payloads uploaded to a server?',
        a: 'No. All JSON formatting, validation, diffing, and class generation happen 100% locally in your browser. Sensitive API responses and config files never leave your device.',
      },
      {
        q: 'Can I generate C#, TypeScript, and Java models from nested JSON?',
        a: 'Yes. Both the JSON to Class and JSON to TypeScript tools recursively inspect nested objects and arrays to emit clean, strongly-typed classes and interfaces.',
      },
      {
        q: 'How do I compare two JSON files while ignoring key order?',
        a: 'Use the JSON Diff tool. It parses both JSON documents semantically, ignoring whitespace and property ordering, and lists added, removed, and changed JSON paths.',
      },
    ],
  },
  formatters: {
    overview: [
      'The Code Formatters collection brings Prettier and dedicated markup parsers directly into your browser for instant code beautification. Format minified or inconsistently indented JavaScript, TypeScript (.ts/.tsx), jQuery, HTML, CSS, XML, and YAML without setting up a local Node.js project or IDE plugin.',
      'Each formatter lets you customize indentation width (2 spaces, 4 spaces, or tabs), quote styles, semicolon rules, and attribute or key sorting so the output matches your team’s coding standards.',
    ],
    faq: [
      {
        q: 'Which formatting engine powers these code beautifiers?',
        a: 'JavaScript, TypeScript, jQuery, HTML, and CSS formatters run Prettier directly in your browser. XML and YAML formatters use dedicated client-side parsers with syntax validation.',
      },
      {
        q: 'Can I format React JSX and TSX components?',
        a: 'Yes. Both the JavaScript Formatter and TypeScript Formatter support embedded JSX/TSX syntax along with modern ESNext features.',
      },
      {
        q: 'Does formatting modify my code logic?',
        a: 'No. Code formatters only normalize whitespace, indentation, line wraps, quotes, and semicolons while keeping the abstract syntax tree (AST) behavior identical.',
      },
    ],
  },
  sql: {
    overview: [
      'The SQL Tools suite streamlines daily database query authoring and backend ORM scaffolding. Beautify complex SELECT queries with nested JOINs and CTEs across T-SQL (SQL Server), PostgreSQL, MySQL, SQLite, and PL/SQL, or turn raw spreadsheet ID columns into ready-to-run WHERE IN clauses.',
      'When scaffolding data access layers in .NET, the SQL to C# Class converter parses CREATE TABLE schemas and maps SQL data types and NULL constraints into clean C# POCO properties.',
    ],
    faq: [
      {
        q: 'Which SQL dialects are supported by the SQL Formatter?',
        a: 'You can format Standard SQL, T-SQL (Microsoft SQL Server), PostgreSQL, MySQL, SQLite, and Oracle PL/SQL with configurable keyword casing and indentation.',
      },
      {
        q: 'How fast can I build a SQL IN clause from Excel data?',
        a: 'Paste your column of IDs or strings into the SQL IN Generator. It automatically removes duplicates, trims spaces, and wraps string values in single quotes.',
      },
      {
        q: 'Are database schemas or queries sent over the network?',
        a: 'Never. All SQL parsing, formatting, and C# class generation execute locally inside your browser tab.',
      },
    ],
  },
  text: {
    overview: [
      'The Text & List Utilities category replaces repetitive multi-cursor editor macros and spreadsheet formulas with instant, single-purpose browser tools. Convert vertical columns to comma-separated lists, wrap lines in quotes, deduplicate log entries, sort lines numerically or alphabetically, and clean up stray whitespace.',
      'For writers and developers working with strict character limits or naming conventions, the Case Converter, Word Counter, and Character Counter provide real-time Unicode-aware transformations and metrics.',
    ],
    faq: [
      {
        q: 'Does Remove Duplicates keep the original line order?',
        a: 'Yes. It preserves the first occurrence of every unique line in its original order and supports optional case-insensitive matching and whitespace trimming.',
      },
      {
        q: 'Can Sort Lines sort numbers by numerical value instead of alphabetically?',
        a: 'Yes. Enable Numeric Sort so that values like 2, 10, and 100 are ordered mathematically rather than lexicographically.',
      },
      {
        q: 'Which naming conventions does the Case Converter support?',
        a: 'It converts between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, UPPERCASE, and lowercase with automatic word boundary detection.',
      },
    ],
  },
  encoding: {
    overview: [
      'The Encoding & Token utilities help developers safely encode, decode, and inspect web payloads and authentication tokens. Encode or decode UTF-8 Base64 strings without corrupting multi-byte Unicode characters or emojis, and unpack JSON Web Tokens (JWT) to inspect headers, claims, and expiration timestamps.',
      'Because security tokens and encoded payloads often contain production credentials or session data, running these tools 100% client-side ensures your secrets are never exposed to third-party servers.',
    ],
    faq: [
      {
        q: 'Is it safe to paste a JWT token here?',
        a: 'Yes, because DevKit decodes the token locally in your browser and never transmits it over the network. Even so, you should always handle production tokens with care.',
      },
      {
        q: 'How does the Base64 tool handle UTF-8 and emojis?',
        a: 'Unlike basic btoa/atob calls that fail on non-ASCII characters, DevKit uses TextEncoder and TextDecoder so all UTF-8 text and emojis survive round-trip encoding.',
      },
      {
        q: 'Does the JWT Decoder convert exp and iat timestamps?',
        a: 'Yes. Standard numeric timestamp claims (exp, iat, nbf, auth_time) are automatically displayed alongside human-readable ISO UTC dates.',
      },
    ],
  },
  generators: {
    overview: [
      'The Online Generators suite produces cryptographically secure identifiers, secrets, and test strings using your browser’s native Web Crypto API. Generate .NET-formatted GUIDs (D, N, B, P), RFC 4122 UUID v4 values, high-entropy passwords, and hexadecimal or alphanumeric tokens.',
      'Whether you need a single UUID for a database migration or a batch of 10,000 unique GUIDs separated by commas or newlines for load testing, results are generated instantaneously in memory.',
    ],
    faq: [
      {
        q: 'How are random GUIDs, UUIDs, and passwords generated?',
        a: 'All generators use the browser’s cryptographically strong Web Crypto API (crypto.getRandomValues) rather than predictable Math.random() calls.',
      },
      {
        q: 'Can I generate thousands of GUIDs or UUIDs at once?',
        a: 'Yes. Both the GUID Generator and UUID Generator support batch generation up to 10,000 identifiers at once with customizable casing and separators.',
      },
      {
        q: 'Are generated passwords or keys stored anywhere?',
        a: 'No. Values are created strictly in browser memory and disappear as soon as you clear the output or close the tab.',
      },
    ],
  },
  inspect: {
    overview: [
      'The Inspect & Debug toolkit helps developers compare code revisions, test regular expressions, and diagnose HTTP responses. Highlight line-by-line, word-by-word, or character-by-character changes with Diff Compare, debug JavaScript RegExp patterns with live capture group extraction, and look up standard or CDN-specific HTTP status codes.',
      'Every diagnostic tool runs offline-capable in your browser so you can troubleshoot logs, configuration diffs, and regex patterns rapidly without external dependencies.',
    ],
    faq: [
      {
        q: 'Can Diff Compare ignore whitespace and indentation changes?',
        a: 'Yes. Enable Ignore Whitespace to focus strictly on code or text content changes while skipping spaces and tabs.',
      },
      {
        q: 'Does Regex Tester show capture groups and match indices?',
        a: 'Yes. Every match is listed with its exact character offset and all numbered capture groups using the native JavaScript RegExp engine.',
      },
      {
        q: 'Are Cloudflare and Nginx status codes included in HTTP Status Lookup?',
        a: 'Yes. Alongside standard RFC 1xx–5xx codes, the lookup catalog covers common vendor codes such as Cloudflare 520–524 and Nginx 444/499.',
      },
    ],
  },
};
