/**
 * Long-form SEO / documentation content for all 39 developer tool pages.
 *
 * Pure data module (no imports) so it can be consumed both by the React app
 * and by `scripts/prerender-seo.mjs` (Node strips the TypeScript types).
 *
 * Rendered below the editor ("below the fold") — never above it, so the
 * workspace keeps its full size.
 */

export interface ToolExample {
  /** Label shown above the input block (e.g. options used). */
  inputLabel?: string;
  input: string;
  /** Label shown above the output block when it is not plain tool output. */
  outputLabel?: string;
  output: string;
}

export interface ToolContent {
  /** "What is X?" paragraph(s). */
  longDescription: string;
  /** Ordered steps — rendered as a numbered list and as HowTo schema. */
  howToSteps: string[];
  features?: string[];
  useCases?: string[];
  example?: ToolExample;
}

export const toolContent: Record<string, ToolContent> = {
  // ─── JSON & Data Conversion ────────────────────────────────────────────────
  jsonFormatter: {
    longDescription:
      'JSON Formatter is a secure, client-side tool that takes messy, unformatted, or minified JSON data and converts it into a readable, beautifully indented structure. It helps developers quickly inspect and debug API responses or configuration files. Check syntax with [JSON Validator](/tools/json/json-validator) or generate types with [JSON to TypeScript](/tools/json/json-to-typescript).',
    howToSteps: [
      'Paste or type your JSON into the Input editor.',
      'Choose an indentation style (2 spaces, 4 spaces or tab) and optionally enable Sort Keys.',
      'The formatted JSON appears instantly in the Output editor — copy it or download it.',
    ],
    features: [
      'Instant, automatic formatting as you type or paste',
      'Customizable indentation (spaces or tabs)',
      'Alphabetical key sorting for easier visual comparison',
      'Clear error message for invalid JSON',
      '100% secure: runs entirely in your browser without uploading data',
    ],
    useCases: [
      'Debugging complex JSON payloads from API endpoints',
      'Beautifying minified JSON for readability',
      'Standardizing JSON configuration files before committing to version control',
      'Finding syntax errors in broken JSON strings',
    ],
    example: {
      inputLabel: 'Minified JSON',
      input: '{"id":42,"name":"DevKit","tags":["json","format"],"active":true}',
      output: '{\n  "id": 42,\n  "name": "DevKit",\n  "tags": [\n    "json",\n    "format"\n  ],\n  "active": true\n}',
    },
  },

  jsonMinifier: {
    longDescription:
      'JSON Minifier is a fast, client-side utility that compresses JSON documents by stripping all unnecessary whitespace, newlines, and tabs. It produces compact payloads ideal for network transport, API requests, and web storage.',
    howToSteps: [
      'Paste your formatted or verbose JSON into the Input editor.',
      'The tool instantly compresses and strips all whitespace.',
      'Copy the minified one-line JSON string or download it directly.',
    ],
    features: [
      'Instant zero-latency client-side minification',
      'Reduces payload size by up to 40-60%',
      'Strict syntax validation prevents invalid payloads',
      'Safe and private: no data transmitted over the internet',
    ],
    useCases: [
      'Reducing payload sizes for REST and GraphQL API requests',
      'Minimizing JSON files before deploying to CDN or production servers',
      'Storing compact JSON strings in databases or local storage',
    ],
    example: {
      inputLabel: 'Formatted JSON',
      input: '{\n  "status": "success",\n  "data": [1, 2, 3]\n}',
      output: '{"status":"success","data":[1,2,3]}',
    },
  },

  jsonValidator: {
    longDescription:
      'JSON Validator inspects JSON strings for syntax correctness and reports detailed error diagnostics with exact line and column numbers. It displays document statistics including top-level type, key count, and array length.',
    howToSteps: [
      'Paste your JSON into the Input panel.',
      'Validation runs immediately as you type or paste.',
      'Inspect any syntax error messages or review the valid JSON structure analysis.',
    ],
    features: [
      'Real-time syntax validation with line/column indicators',
      'Identifies trailing commas, missing quotes, and unmatched braces',
      'Calculates document metrics: object keys, array count, byte size',
      '100% private: validation runs locally in your browser',
    ],
    useCases: [
      'Troubleshooting corrupted API response payloads',
      'Validating configuration files (tsconfig, package.json) before commit',
      'Teaching and learning standard JSON syntax requirements',
    ],
    example: {
      inputLabel: 'Valid object',
      input: '{"ok":true,"n":1}',
      output: 'Valid JSON\n\nType: object\nProperties: 2',
    },
  },

  jsonToClass: {
    longDescription:
      'JSON to Class automatically analyzes JSON payloads and generates strongly-typed class and interface models for C#, TypeScript, and Java. It infers primitive types, handles nested structures, and resolves list collections gracefully.',
    howToSteps: [
      'Paste a valid JSON object or array into the Input editor.',
      'Select the target language (C#, TypeScript or Java) and set the root class name.',
      'Adjust indentation if needed — the generated model code appears instantly in the Output editor.',
    ],
    features: [
      'Multi-language output: C# POCOs, TypeScript interfaces/types, and Java POJOs',
      'Automatic type inference for numbers, booleans, strings, dates, and nested objects',
      'Recursive generation for deeply nested object graphs and array collections',
      'Configurable root model name and indentation styling',
      'Entirely client-side: sensitive data payloads never leave your computer',
    ],
    useCases: [
      'Scaffolding API response models and DTOs in backend services',
      'Creating TypeScript type definitions from third-party REST API responses',
      'Converting sample configuration JSON into Java or C# entity classes',
    ],
    example: {
      inputLabel: 'JSON (C#, root class "Product")',
      input: '{"id":42,"name":"DevKit","price":9.99,"tags":["json"],"owner":{"email":"dev@example.com"}}',
      output:
        'public class Product\n{\n    public int Id { get; set; }\n\n    public string Name { get; set; }\n\n    public double Price { get; set; }\n\n    public List<string> Tags { get; set; }\n\n    public Owner Owner { get; set; }\n}\n\npublic class Owner\n{\n    public string Email { get; set; }\n}',
    },
  },

  jsonToTypeScript: {
    longDescription:
      'JSON to TypeScript generates clean, idiomatic TypeScript interface and type declarations from sample JSON objects. It resolves nested structures into separate interfaces and generates union types for heterogeneous array items.',
    howToSteps: [
      'Paste a sample JSON payload into the Input editor.',
      'Select your preferred root interface name and formatting options.',
      'Copy the generated TypeScript definitions into your project codebase.',
    ],
    features: [
      'Recursive interface generation for nested objects',
      'Infers union types for arrays with multiple object shapes',
      'Handles optional properties and nullable fields gracefully',
      'Clean Prettier-compliant code formatting',
    ],
    useCases: [
      'Typing third-party API responses in frontend web apps',
      'Scaffolding TypeScript data contracts from Postman or Swagger JSON',
      'Speeding up full-stack TypeScript development',
    ],
    example: {
      inputLabel: 'JSON Object',
      input: '{"user":{"id":1,"name":"Alice","roles":["admin","editor"]}}',
      output: 'export interface User {\n  id: number;\n  name: string;\n  roles: string[];\n}\n\nexport interface Root {\n  user: User;\n}',
    },
  },

  jsonToXml: {
    longDescription:
      'JSON to XML converts hierarchical JSON objects into well-formed XML documents. It handles attribute mapping, array element wrapping, and character escaping for seamless data exchange.',
    howToSteps: [
      'Paste your JSON data into the Input editor.',
      'Customize the root element name and indentation if needed.',
      'Copy the converted, well-formed XML markup from the Output panel.',
    ],
    features: [
      'Customizable root element tag name',
      'Proper XML character escaping (&, <, >, quotes)',
      'Indented, human-readable XML output',
      'Client-side processing guarantees privacy',
    ],
    useCases: [
      'Transforming modern REST JSON data for legacy SOAP/XML web services',
      'Preparing data feeds for enterprise ERP or RSS ingestion',
      'Migrating configuration data between JSON and XML formats',
    ],
    example: {
      inputLabel: 'Root element "user"',
      input: '{"id":7,"name":"Ada"}',
      output: '<user>\n  <id>7</id>\n  <name>Ada</name>\n</user>',
    },
  },

  jsonToYaml: {
    longDescription:
      'JSON to YAML transforms JSON configurations into clean, human-friendly YAML documents. It is an essential tool for DevOps engineers configuring Kubernetes manifests, GitHub Actions workflows, Docker Compose, and CI/CD pipelines.',
    howToSteps: [
      'Paste your JSON configuration into the Input editor.',
      'Choose indentation width and optional alphabetical key sorting.',
      'Copy the generated YAML output directly into your deployment manifest.',
    ],
    features: [
      'Converts complex nested objects and arrays to clean YAML syntax',
      'Optional alphabetical key ordering for version control diffs',
      'Validates JSON syntax before conversion',
      'Private and secure: runs 100% in your browser',
    ],
    useCases: [
      'Converting API payloads into Kubernetes ConfigMaps or Secrets',
      'Translating Docker Compose JSON configurations into YAML',
      'Writing CI/CD pipeline definitions for GitLab, GitHub Actions, or Azure DevOps',
    ],
    example: {
      inputLabel: 'JSON Object',
      input: '{"apiVersion":"v1","kind":"Pod","metadata":{"name":"web-app"}}',
      output: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: web-app',
    },
  },

  jsonDiff: {
    longDescription:
      'JSON Diff compares two JSON payloads semantically, ignoring whitespace and key ordering discrepancies. It highlights added, removed, and modified properties with full JSON path expressions.',
    howToSteps: [
      'Paste the original JSON into the left panel.',
      'Paste the modified JSON into the right panel.',
      'Review the color-coded semantic diff showing additions, deletions, and value modifications.',
    ],
    features: [
      'Semantic structural comparison independent of key order',
      'Full JSON path notation for modified properties (e.g. users[0].email)',
      'Ignores trivial whitespace and indentation differences',
      'Real-time diff generation in your browser',
    ],
    useCases: [
      'Spotting breaking changes in API response versions',
      'Comparing test fixture outputs against golden reference JSON',
      'Auditing configuration changes across staging and production environments',
    ],
    example: {
      inputLabel: 'Left vs right',
      input: '{"version":1,"flags":{"beta":false}}',
      output: 'Changed flags.beta: false → true\nAdded region: "eu"',
    },
  },

  classToJson: {
    longDescription:
      'Class to JSON parses C#, TypeScript, or Java class definitions and generates realistic sample JSON payloads with mock data matching each property data type.',
    howToSteps: [
      'Paste a C#, TypeScript or Java class definition into the Input editor.',
      'The parser detects the language and property types automatically.',
      'Copy the generated mock JSON payload from the Output editor.',
    ],
    features: [
      'Automatic language detection (C#, TypeScript, Java)',
      'Infers realistic mock values for dates, GUIDs, booleans, numbers, and strings',
      'Resolves nested classes and collection generic types',
      'Zero setup required — works directly in the browser',
    ],
    useCases: [
      'Generating mock API request bodies for Swagger or Postman testing',
      'Scaffolding sample payloads for integration test suites',
      'Demonstrating API contracts to frontend developers',
    ],
    example: {
      inputLabel: 'C# class',
      input: 'public class User { public int Id { get; set; } public string Name { get; set; } }',
      output: '{\n  "Id": 1,\n  "Name": "Ada"\n}',
    },
  },

  yamlFormatter: {
    longDescription:
      'YAML Formatter parses and beautifies YAML configuration files with consistent indentation and syntax validation. It helps eliminate tricky indentation bugs common in Kubernetes and CI/CD configs.',
    howToSteps: [
      'Paste your raw YAML into the Input editor.',
      'Select your indentation preference (2 or 4 spaces) and key sorting.',
      'Copy the cleanly formatted YAML directly into your config files.',
    ],
    features: [
      'Standardized YAML indentation and alignment',
      'Preserves comments and multi-line strings',
      'Alphabetical key sorting for clean git diffs',
      'Instant syntax error reporting',
    ],
    useCases: [
      'Fixing indentation errors in Kubernetes Pod, Service, and Ingress specs',
      'Cleaning up GitHub Actions or Docker Compose configuration files',
      'Standardizing configuration files before committing to Git repositories',
    ],
    example: {
      inputLabel: '2-space indent',
      input: 'name: web\nreplicas:2',
      output: 'name: web\nreplicas: 2',
    },
  },

  xmlFormatter: {
    longDescription:
      'XML Formatter is a lightweight, high-performance XML beautifier that organizes nested XML markup with clean indentation, proper line breaks, and optional attribute sorting.',
    howToSteps: [
      'Paste your minified or messy XML into the Input editor.',
      'Configure indentation level and attribute sorting options.',
      'Copy the indented, structured XML document.',
    ],
    features: [
      'Handles XML declarations, DOCTYPEs, CDATA blocks, and comments',
      'Configurable indentation (2 spaces, 4 spaces, or tabs)',
      'Optional alphabetical sorting of XML element attributes',
      'Pure client-side processing without uploading files',
    ],
    useCases: [
      'Beautifying SOAP API responses and WSDL documents',
      'Formatting SVG vector graphics code for inspection and optimization',
      'Standardizing enterprise data exchange XML files',
    ],
    example: {
      inputLabel: 'Minified XML',
      input: '<note><to>Dev</to><body>Hi</body></note>',
      output: '<note>\n  <to>Dev</to>\n  <body>Hi</body>\n</note>',
    },
  },

  // ─── Code Formatters ──────────────────────────────────────────────────────
  javascriptFormatter: {
    longDescription:
      'JavaScript Formatter beautifies and standardizes JavaScript code using Prettier. It supports modern ECMAScript standards (ES6+ through ESNext) with configurable quotes and semicolons.',
    howToSteps: [
      'Paste your JavaScript snippet or minified script into the Input editor.',
      'Adjust options: indentation, semicolon insertion, and single vs double quotes.',
      'Click Transform to format and copy clean, readable JavaScript.',
    ],
    features: [
      'Powered by Prettier for industry-standard code styling',
      'Full support for modern ES2024+ syntax, async/await, and arrow functions',
      'Configurable semicolon and quote preferences',
      'Instant client-side formatting',
    ],
    useCases: [
      'De-obfuscating and beautifying minified JS from production logs',
      'Cleaning up messy code snippets copied from tutorials or Stack Overflow',
      'Enforcing uniform coding standards before code reviews',
    ],
    example: {
      inputLabel: '2 spaces, semicolons',
      input: 'const sum=(a,b)=>a+b',
      output: 'const sum = (a, b) => a + b;',
    },
  },

  jqueryFormatter: {
    longDescription:
      'jQuery Formatter is specialized for beautifying jQuery and legacy JavaScript source code, aligning chained selector methods and callback hierarchies cleanly.',
    howToSteps: [
      'Paste your jQuery script into the Input editor.',
      'Configure your formatting options: tab width, semicolons, and quotes.',
      'Copy the formatted script from the Output editor.',
    ],
    features: [
      'Optimized indentation for chained jQuery DOM queries ($(...).find().on())',
      'Prettier-based formatting engine',
      'Full syntax error detection',
      'Client-side processing ensuring privacy',
    ],
    useCases: [
      'Refactoring legacy jQuery plugins and website scripts',
      'Formatting complex event-handling and AJAX chaining blocks',
      'Inspecting third-party jQuery libraries',
    ],
    example: {
      inputLabel: 'Chained call',
      input: "$('#go').on('click',function(){$(this).hide()})",
      output: "$('#go').on('click', function () {\n  $(this).hide();\n});",
    },
  },

  typescriptFormatter: {
    longDescription:
      'TypeScript Formatter formats TypeScript (.ts) and React TypeScript (.tsx) source files using Prettier. It formats type annotations, interfaces, generics, and JSX templates consistently.',
    howToSteps: [
      'Paste your TypeScript or TSX code into the Input editor.',
      'Select indentation, semicolon style, and quote preferences.',
      'Copy the standardized TypeScript code into your project.',
    ],
    features: [
      'Full support for TypeScript 5+ types, generics, and decorators',
      'Flawless React TSX and JSX markup formatting',
      'Prettier engine ensures consistent team styling',
      '100% private: proprietary source code never leaves your browser',
    ],
    useCases: [
      'Formatting TypeScript utility types and complex data models',
      'Standardizing React TSX components before merging pull requests',
      'Cleaning up generated TypeScript client SDKs',
    ],
    example: {
      inputLabel: 'TypeScript',
      input: 'export type Id=string|number',
      output: 'export type Id = string | number;',
    },
  },

  htmlFormatter: {
    longDescription:
      'HTML Formatter formats messy, unindented, or minified HTML markup into clean, readable, properly indented code. It handles embedded CSS styles and JavaScript scripts seamlessly.',
    howToSteps: [
      'Paste your HTML code into the Input editor.',
      'Set indentation spaces and formatting options.',
      'Copy the formatted HTML from the Output editor.',
    ],
    features: [
      'Proper tag nesting and hierarchical indentation',
      'Formats embedded <style> and <script> blocks automatically',
      'Supports HTML5 self-closing and void element conventions',
      'Runs locally in the browser',
    ],
    useCases: [
      'Beautifying view-source HTML and email template markup',
      'Cleaning up web scraper HTML outputs for inspection',
      'Standardizing HTML component templates',
    ],
    example: {
      inputLabel: 'Minified HTML',
      input: '<ul><li>One</li><li>Two</li></ul>',
      output: '<ul>\n  <li>One</li>\n  <li>Two</li>\n</ul>',
    },
  },

  cssFormatter: {
    longDescription:
      'CSS Formatter beautifies and standardizes stylesheets, organizing selector blocks, nested rules, media queries, and vendor prefixes into clean, readable CSS.',
    howToSteps: [
      'Paste your minified or disorganized CSS into the Input editor.',
      'Select your indentation preference.',
      'Copy the structured, well-spaced CSS stylesheet.',
    ],
    features: [
      'Standardizes rule spacing, property indentation, and selector formatting',
      'Full support for CSS3 variables, flexbox, grid, and media queries',
      'Handles basic SCSS and PostCSS syntax',
      '100% client-side execution',
    ],
    useCases: [
      'Un-minifying production stylesheets for debugging and inspection',
      'Organizing CSS stylesheets for improved maintainability',
      'Standardizing styling rules before code check-in',
    ],
    example: {
      inputLabel: 'Minified CSS',
      input: '.btn{color:#fff;padding:8px}',
      output: '.btn {\n  color: #fff;\n  padding: 8px;\n}',
    },
  },

  // ─── SQL ──────────────────────────────────────────────────────────────────
  sqlFormatter: {
    longDescription:
      'SQL Formatter is a browser-based utility that beautifies disorganized SQL queries into standardized, readable code. It supports multiple dialects including Standard SQL, T-SQL, PostgreSQL, MySQL, SQLite and PL/SQL. Build lists with [SQL IN Generator](/tools/sql/sql-in-generator) or scaffold models with [SQL to C# Class](/tools/sql/sql-to-csharp-class).',
    howToSteps: [
      'Paste your raw SQL query into the Input editor.',
      'Choose the SQL dialect, keyword casing and tab width in the options.',
      'Click Transform to format the query, then copy or download the result.',
    ],
    features: [
      'Supports 6 SQL dialects (Standard, T-SQL, PostgreSQL, MySQL, SQLite, PL/SQL)',
      'Configurable keyword casing (Uppercase, Lowercase, Preserve)',
      'Adjustable tab width for indentation',
      'Syntax highlighting for clear code structure',
      'Processes data entirely in the browser for complete privacy',
    ],
    useCases: [
      'Formatting single-line SQL queries copied from application logs',
      'Standardizing SQL formatting before code reviews or pull requests',
      'Making complex JOINs and nested subqueries easier to read',
      'Converting keywords to a consistent uppercase or lowercase style',
    ],
    example: {
      inputLabel: 'One-line query (Standard SQL, uppercase keywords)',
      input:
        'select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.active = 1 group by u.id, u.name order by orders desc',
      output:
        'SELECT\n  u.id,\n  u.name,\n  count(o.id) AS orders\nFROM\n  users u\n  LEFT JOIN orders o ON o.user_id = u.id\nWHERE\n  u.active = 1\nGROUP BY\n  u.id,\n  u.name\nORDER BY\n  orders DESC',
    },
  },

  sqlInGenerator: {
    longDescription:
      'SQL IN Generator converts vertical lists of values (IDs, GUIDs, email addresses, names) copied from spreadsheets into formatted SQL IN (...) clauses with automatic deduplication.',
    howToSteps: [
      'Paste a list of values (one per line) from Excel or CSV into the Input editor.',
      'Configure value type (numeric vs string quoting) and separator options.',
      'Copy the generated IN clause directly into your SQL query WHERE statement.',
    ],
    features: [
      'Automatic single-quote wrapping for string values',
      'Preserves raw numbers for numeric integer/bigint IN clauses',
      'Automatic deduplication and empty line stripping',
      'Configurable batch chunking for large lists',
    ],
    useCases: [
      'Querying database records for thousands of IDs exported from spreadsheets',
      'Building WHERE id IN (...) statements for ad-hoc database maintenance',
      'Sanitizing and preparing parameter lists for DBA operations',
    ],
    example: {
      inputLabel: 'ID List',
      input: '101\n102\n103\n101',
      output: 'IN (101, 102, 103)',
    },
  },

  sqlToCSharpClass: {
    longDescription:
      'SQL to C# Class converts SQL CREATE TABLE statements into strongly-typed C# POCO entity classes, mapping database types (VARCHAR, INT, DATETIME, DECIMAL) to appropriate C# primitive and nullable types.',
    howToSteps: [
      'Paste your SQL CREATE TABLE statement or column definitions into the Input editor.',
      'Configure options such as class name and nullability style.',
      'Copy the generated C# entity class into your .NET solution.',
    ],
    features: [
      'Maps standard and dialect-specific SQL types to C# types',
      'Handles NULL and NOT NULL column constraints (e.g. int?)',
      'Generates clean PascalCase property names',
      'Saves hours of manual boilerplate coding',
    ],
    useCases: [
      'Scaffolding Entity Framework Core or Dapper model classes',
      'Converting database tables to backend API DTOs in ASP.NET Core',
      'Migrating legacy database schemas to modern C# architectures',
    ],
    example: {
      inputLabel: 'CREATE TABLE',
      input: 'CREATE TABLE Product (Id INT NOT NULL, Name NVARCHAR(80) NULL)',
      output: 'public class Product\n{\n    public int Id { get; set; }\n    public string Name { get; set; }\n}',
    },
  },

  // ─── Text & List Utils ────────────────────────────────────────────────────
  columnToComma: {
    longDescription:
      'Column to Comma converts vertical newline-separated items into a single-line comma-separated list. It supports automatic whitespace trimming, deduplication, and custom delimiters.',
    howToSteps: [
      'Paste your column of items (one per line) into the Input editor.',
      'Enable deduplication or trimming in options if desired.',
      'Copy the comma-delimited single-line list immediately.',
    ],
    features: [
      'Converts multi-line columns to single-line comma lists',
      'Optional deduplication removes repeated entries',
      'Strips empty lines and trims boundary spaces',
      'Fast and browser-based',
    ],
    useCases: [
      'Converting Excel spreadsheet column data for SQL queries or CSV inputs',
      'Combining lists of email addresses for mailing list fields',
      'Flattening vertical data for CLI arguments or environment variables',
    ],
    example: {
      inputLabel: 'Column of items',
      input: 'apple\nbanana\ncherry',
      output: 'apple, banana, cherry',
    },
  },

  commaToColumn: {
    longDescription:
      'Comma to Column splits comma-separated values into individual vertical lines. It makes inspecting CSV rows, comma lists, or IN query parameters clean and easy to read.',
    howToSteps: [
      'Paste a comma-separated string into the Input editor.',
      'The tool instantly splits each value into its own line.',
      'Copy the vertical column list.',
    ],
    features: [
      'Splits delimited strings on commas',
      'Automatic trimming of whitespace following commas',
      'Instant one-click transformation',
      'Private client-side processing',
    ],
    useCases: [
      'Converting single-line CSV data into vertical columns for spreadsheet pasting',
      'Breaking down long SQL IN clauses into inspectable line lists',
      'Re-formatting comma-separated lists for sorting or filtering',
    ],
    example: {
      inputLabel: 'Comma list',
      input: 'alpha, beta, gamma',
      output: 'alpha\nbeta\ngamma',
    },
  },

  columnToQuoted: {
    longDescription:
      'Column to Quoted List wraps each line of text in single or double quotes and joins them with a configurable separator. It is ideal for preparing code arrays, SQL lists, or configuration files.',
    howToSteps: [
      'Paste your values into the Input panel.',
      'Choose single quotes (\') or double quotes (") and your delimiter.',
      'Copy the quoted list ready to paste into your code.',
    ],
    features: [
      'Supports single quotes (\'), double quotes ("), and backticks (`)',
      'Configurable item separator (comma, semicolon, newline)',
      'Automatic escaping of quotes occurring within values',
      'Browser-based security',
    ],
    useCases: [
      'Creating JavaScript, Python, or C# string arrays from plain text lists',
      'Wrapping string identifiers for database queries',
      'Formatting configuration parameters for shell scripts',
    ],
    example: {
      inputLabel: 'Double quotes',
      input: 'alpha\nbeta',
      output: '"alpha", "beta"',
    },
  },

  columnToSqlIn: {
    longDescription:
      'Column to SQL IN transforms a multi-line list of IDs or keys directly into a complete SQL WHERE IN (...) clause with automatic deduplication, trimming, and quotation.',
    howToSteps: [
      'Paste your list of values line-by-line into the Input editor.',
      'Select whether items are numbers or strings.',
      'Copy the complete SQL IN clause into your query window.',
    ],
    features: [
      'Instant single-click conversion',
      'Automatic string quoting with internal apostrophe escaping',
      'Deduplication removes duplicate IDs',
      'Runs 100% in your browser without data uploads',
    ],
    useCases: [
      'Quickly filtering database queries by lists of customer or product IDs',
      'Ad-hoc data analysis and troubleshooting in SQL Server, Postgres, or MySQL',
      'Preparing queries from support ticket lists',
    ],
    example: {
      inputLabel: 'Numeric IDs',
      input: '10\n11\n10',
      output: 'IN (10, 11)',
    },
  },

  removeDuplicates: {
    longDescription:
      'Remove Duplicates strips repeated lines from any text block while preserving the original sequence of first occurrences. It supports case-sensitive and case-insensitive matching.',
    howToSteps: [
      'Paste your text containing duplicate lines into the Input editor.',
      'Toggle case sensitivity or whitespace trimming if desired.',
      'Copy the unique, deduplicated text from the Output editor.',
    ],
    features: [
      'Preserves original sequence order of first occurrences',
      'Case-sensitive or case-insensitive matching options',
      'Handles large text blocks with tens of thousands of lines in milliseconds',
      'Completely client-side',
    ],
    useCases: [
      'Cleaning up customer email lists and mailing records',
      'Deduplicating log files and error trace outputs',
      'Purging duplicate identifiers from spreadsheet exports',
    ],
    example: {
      inputLabel: 'Keep first occurrence',
      input: 'a\nb\na\nc',
      output: 'a\nb\nc',
    },
  },

  sortLines: {
    longDescription:
      'Sort Lines sorts multi-line text alphabetically or numerically in ascending (A-Z) or descending (Z-A) order. It includes natural numeric sorting (2 comes before 10).',
    howToSteps: [
      'Paste your text into the Input panel.',
      'Select sorting order (Alphabetical A-Z, Z-A, or Numeric) and case sensitivity.',
      'Copy the sorted text instantly.',
    ],
    features: [
      'Natural numeric sorting: correctly orders 1, 2, 10 instead of 1, 10, 2',
      'Ascending and descending ordering modes',
      'Case-sensitive and case-insensitive sorting options',
      'Instant client-side calculation',
    ],
    useCases: [
      'Alphabetizing lists of items, tags, or dictionary keys',
      'Sorting numeric IDs and metrics extracted from data logs',
      'Organizing import statements and configuration settings',
    ],
    example: {
      inputLabel: 'A to Z',
      input: 'pear\napple\nplum',
      output: 'apple\npear\nplum',
    },
  },

  removeEmptyLines: {
    longDescription:
      'Remove Empty Lines purges blank and whitespace-only lines from text documents, condensing messy logs, source code, and pasted text into clean, compact blocks.',
    howToSteps: [
      'Paste your text into the Input editor.',
      'The tool automatically strips blank and whitespace-only lines.',
      'Copy the clean, compact text.',
    ],
    features: [
      'Removes blank lines and lines containing only whitespace',
      'Optional trimming of remaining non-empty lines',
      'Instant real-time filtering',
      'Runs locally in browser memory',
    ],
    useCases: [
      'Condensing double-spaced or bloated logs for easier reading',
      'Cleaning up code snippets copied from PDF documents or web pages',
      'Preparing clean text for natural language processing or regex analysis',
    ],
    example: {
      inputLabel: 'Drop blank lines',
      input: 'one\n\n\ntwo\n',
      output: 'one\ntwo',
    },
  },

  trimLines: {
    longDescription:
      'Trim Lines removes unwanted leading and trailing whitespace (spaces, tabs) from every line of text, leaving internal words and spacing intact.',
    howToSteps: [
      'Paste your text into the Input editor.',
      'Choose to trim leading whitespace, trailing whitespace, or both.',
      'Copy the clean, trimmed text from the Output panel.',
    ],
    features: [
      'Fine-grained control: Trim Start, Trim End, or Trim Both',
      'Preserves internal word spacing within lines',
      'Removes accidental space characters at line ends',
      'Instant client-side operation',
    ],
    useCases: [
      'Cleaning up trailing spaces in source code to satisfy linter checks',
      'Sanitizing data copied from terminal windows or formatted tables',
      'Preparing clean data columns for CSV or database ingestion',
    ],
    example: {
      inputLabel: 'Trim both sides',
      input: '  alpha  \n\tbeta\t',
      output: 'alpha\nbeta',
    },
  },

  caseConverter: {
    longDescription:
      'Case Converter converts text between common programming and writing case styles: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, and sentence case.',
    howToSteps: [
      'Type or paste your text into the Input panel.',
      'Select your target case style (e.g. kebab-case, camelCase, snake_case).',
      'Copy the converted text immediately.',
    ],
    features: [
      'Smart boundary tokenization handles mixed-case and accented inputs',
      'Supports camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case',
      'Real-time transformation as you type',
      '100% private: sensitive variable names stay on your computer',
    ],
    useCases: [
      'Renaming database column names to programming language variable conventions',
      'Converting titles into SEO-friendly URL slugs',
      'Refactoring code identifiers across frontend and backend stacks',
    ],
    example: {
      inputLabel: 'Target: kebab-case',
      input: 'userProfileData',
      output: 'user-profile-data',
    },
  },

  wordCounter: {
    longDescription:
      'Word Counter calculates accurate real-time text statistics including word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time.',
    howToSteps: [
      'Type or paste your text into the Input editor.',
      'Review the live statistics panel showing words, characters, sentences, and reading time.',
      'Adjust your text in real time to meet document length constraints.',
    ],
    features: [
      'Unicode-aware word and character detection',
      'Calculates characters with and without spaces',
      'Estimates reading time and speaking time',
      'Instant real-time calculation',
    ],
    useCases: [
      'Monitoring word limits for blog posts, social media updates, and articles',
      'Ensuring SEO meta descriptions stay within the 155-160 character boundary',
      'Checking academic essay lengths and translation word counts',
    ],
    example: {
      inputLabel: 'Unicode word mode',
      input: 'DevKit formats JSON.',
      output: 'Words: 3\nLines: 1\nNon-empty Lines: 1\nSentences: 1\nParagraphs: 1',
    },
  },

  characterCounter: {
    longDescription:
      'Character Counter provides granular character analytics, breaking down text into letter counts, digit counts, whitespace characters, punctuation symbols, and newline totals.',
    howToSteps: [
      'Paste your text into the Input editor.',
      'Inspect the detailed character breakdown panel.',
      'Verify that your input meets specific platform character constraints.',
    ],
    features: [
      'Detailed breakdown: total characters, letters, digits, symbols, spaces, newlines',
      'Shows length with spaces and length excluding spaces',
      'Real-time updates as you type or paste',
      'Works with all international Unicode character sets',
    ],
    useCases: [
      'Checking database VARCHAR or CHAR column length constraints',
      'Optimizing character counts for SMS messages and advertising headlines',
      'Debugging hidden whitespace and non-printable newline characters',
    ],
    example: {
      inputLabel: 'Spaces included',
      input: 'AB C',
      output: 'Characters:          4\n\n--- Details ---\nWithout spaces:      3\nLetters:             3\nDigits:              0\nSpaces / Tabs:       1\nLines:               1\nNewline chars:       0',
    },
  },

  // ─── Encoding ─────────────────────────────────────────────────────────────
  base64: {
    longDescription:
      'The Base64 Encoder/Decoder converts text into Base64 format and back. It properly handles UTF-8 characters and emojis, making it safe for all modern web encoding needs. For tokens, open [JWT Decoder](/tools/encoding/jwt-decoder) to split the header and payload.',
    howToSteps: [
      'Type or paste your text into the Input editor.',
      'Select Encode or Decode in the options.',
      'The result appears instantly in the Output editor. When decoding, make sure the input is valid Base64.',
    ],
    features: [
      'Bi-directional conversion (encode to Base64 or decode from Base64)',
      'Full UTF-8 support — safely handles special characters and emojis',
      'Real-time automatic transformation',
      'Local processing in your browser — no data leaves your device',
    ],
    useCases: [
      'Encoding credentials for Basic HTTP Authentication headers',
      'Embedding small text payloads safely in URLs or JSON',
      'Decoding Base64 strings found in logs, API responses or debug traces',
      'Verifying that an encoded string contains the expected text',
    ],
    example: {
      inputLabel: 'Text (Encode)',
      input: 'Hello, DevKit! 👋',
      output: 'SGVsbG8sIERldktpdCEg8J+Riw==',
    },
  },

  // ─── Generators ───────────────────────────────────────────────────────────
  guidGenerator: {
    longDescription:
      'GUID Generator produces standard Globally Unique Identifiers with customizable .NET formats and letter casing. Generate a single identifier or batch generate up to 10,000 values in seconds, directly in your browser.',
    howToSteps: [
      'Enter how many GUIDs you need.',
      'Pick a format (D hyphenated, N digits only, B braces, P parentheses) and the letter case.',
      'Click Generate and copy the values from the Output editor.',
    ],
    features: [
      'Standard .NET formats: D (hyphenated), N (digits only), B (braced), P (parenthesized)',
      'Configurable letter casing (uppercase or lowercase)',
      'Batch generation of up to 10,000 GUIDs at once',
      'Multiple separator options (newline, comma or space)',
      'Fast, client-side generation',
    ],
    useCases: [
      'Creating primary keys for database seeds and test fixtures',
      'Generating correlation IDs for logging and distributed tracing',
      'Producing consistently formatted GUIDs for C# / .NET development',
    ],
    example: {
      inputLabel: 'Count: 3 · Format: D · Case: Uppercase',
      input: '(no input required)',
      output:
        '9B2C7E41-5D3A-4F6B-8C1E-2A7D9F0B3E65\nE4A1F07C-2B9D-4C83-A5E6-7F1D0C9B2A48\n1C6F3A9E-8D47-4B20-9E5A-C3F7B1D04E92',
    },
  },

  uuidGenerator: {
    longDescription:
      'UUID Generator produces cryptographically secure RFC 4122 Version 4 UUIDs using the browser Web Crypto API. Generate individual UUIDs or batch generate up to 10,000 values in seconds.',
    howToSteps: [
      'Enter the number of UUIDs required (up to 10,000).',
      'Choose uppercase or lowercase casing and standard hyphenated or compact format.',
      'Click Generate and copy the unique identifiers.',
    ],
    features: [
      'Cryptographically secure randomness via window.crypto.getRandomValues',
      'RFC 4122 v4 compliant',
      'Batch generation of up to 10,000 unique UUIDs at once',
      'Multiple output formats (hyphenated, compact, uppercase, lowercase)',
    ],
    useCases: [
      'Generating primary keys for database migration scripts and test seeds',
      'Creating unique session tokens and request correlation IDs',
      'Testing distributed systems requiring non-colliding random identifiers',
    ],
    example: {
      inputLabel: 'UUID v4',
      input: '(no input required)',
      output: '4a1b8c2d-3e4f-4a5b-8c6d-7e8f9a0b1c2d',
    },
  },

  passwordGenerator: {
    longDescription:
      'Password Generator produces cryptographically strong, uncrackable random passwords. Customize password length and character sets (uppercase, lowercase, numbers, symbols, ambiguous character exclusion).',
    howToSteps: [
      'Select password length (e.g. 16, 24, 32 characters).',
      'Toggle character sets: uppercase, lowercase, numbers, symbols.',
      'Click Generate to produce secure passwords — copy directly to clipboard.',
    ],
    features: [
      'Uses Web Crypto API for high-entropy cryptographically secure randomness',
      'Configurable length from 8 to 128 characters',
      'Option to exclude ambiguous characters like 0, O, l, 1',
      'Passwords are generated strictly in memory and are never saved or sent over the network',
    ],
    useCases: [
      'Generating strong administrative passwords and API secret tokens',
      'Creating temporary passwords for user onboarding and provisioning',
      'Securing developer database credentials and private keys',
    ],
    example: {
      inputLabel: 'Length 16, all sets',
      input: '(no input required)',
      output: 'k7#Qm2!pL9vR4nWx',
    },
  },

  randomStringGenerator: {
    longDescription:
      'Random String Generator creates random strings using alphanumeric, letters-only, numbers-only, or hexadecimal character sets with cryptographically secure randomness.',
    howToSteps: [
      'Choose the desired string length and number of strings to generate.',
      'Select your character set (Alphanumeric, Alpha only, Numeric only, Hex).',
      'Click Generate to output the random strings.',
    ],
    features: [
      'Cryptographically secure randomness',
      'Multiple character set presets: Alphanumeric, Alpha, Numeric, Hexadecimal',
      'Batch generation of multiple random strings at once',
      '100% client-side: no server logging',
    ],
    useCases: [
      'Generating mock API keys, bearer tokens, and test salts',
      'Creating dummy data for automated testing and benchmarking',
      'Generating random verification codes and test nonces',
    ],
    example: {
      inputLabel: 'Hex, length 8',
      input: '(no input required)',
      output: 'a3f09c1e',
    },
  },

  // ─── Inspect & Debug ──────────────────────────────────────────────────────
  diffCompare: {
    longDescription:
      'Diff Compare is a text comparison tool that highlights the differences between two blocks of text. Find additions, deletions and modifications instantly without installing any desktop software.',
    howToSteps: [
      'Paste the original text into the left pane.',
      'Paste the modified text into the right pane.',
      'Choose line, word or character comparison and optionally ignore whitespace — differences are highlighted instantly.',
    ],
    features: [
      'Inline highlighting of additions and deletions',
      'Three comparison modes: line-by-line, word-by-word and character-by-character',
      'Option to ignore whitespace differences (helpful for code)',
      '100% local browser processing',
    ],
    useCases: [
      'Finding what changed between two versions of a source file',
      'Comparing configuration files to spot misconfigurations',
      'Reviewing text edits or draft changes',
    ],
    example: {
      inputLabel: 'Original (left) and modified (right) text',
      input: 'Original:\nhello\nworld\n\nModified:\nhello\nDevKit',
      outputLabel: 'Highlighted result, shown here as -/+ lines',
      output: '  hello\n- world\n+ DevKit',
    },
  },

  jwtDecoder: {
    longDescription:
      'JWT Decoder unpacks JSON Web Tokens and displays their header and payload as readable JSON. Standard timestamp claims such as exp, iat and nbf are converted to ISO UTC dates. The signature is not verified.',
    howToSteps: [
      'Paste an encoded JWT into the Input editor.',
      'The header and payload are decoded instantly and shown as formatted JSON.',
      'Check the converted timestamp claims (exp, iat, nbf) to debug expiry issues.',
    ],
    features: [
      'Instant parsing of the JWT header and payload',
      'Automatic conversion of Unix epoch claims (exp, iat, nbf, auth_time) to ISO dates',
      'Formatted JSON view for nested claims',
      'Handles URL-safe Base64 encoding and missing padding',
      'Client-side only — tokens are never transmitted over the network',
    ],
    useCases: [
      'Checking token expiration and audience claims while debugging authentication',
      'Inspecting role, permission and user claims in OAuth2 / OIDC tokens',
      'Reading the token algorithm and key ID (kid) without server-side tools',
    ],
    example: {
      inputLabel: 'Encoded JWT',
      input:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      output:
        '=== Header ===\n{\n  "alg": "HS256",\n  "typ": "JWT"\n}\n\n=== Payload ===\n{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1716239022\n}\n\n--- Claim timestamps (UTC) ---\niat: 1716239022 → 2024-05-20T21:03:42.000Z\n\n=== Signature ===\nPresent (not verified)',
    },
  },

  regexTester: {
    longDescription:
      'Regex Tester evaluates JavaScript regular expressions against test text in real time. It displays all matching substrings, match index offsets, and capture groups with syntax error detection.',
    howToSteps: [
      'Enter your regular expression pattern and flags (g, i, m, s).',
      'Paste your sample test text into the Input panel.',
      'View matched substrings and capture groups highlighted in the Output panel.',
    ],
    features: [
      'Real-time regex evaluation against sample text',
      'Supports standard regex flags: global (g), case-insensitive (i), multiline (m), dotAll (s)',
      'Displays capture group indices and values',
      'Identifies and reports regular expression syntax errors',
    ],
    useCases: [
      'Debugging complex regular expressions before embedding them in application code',
      'Extracting patterns from log lines and formatted text',
      'Verifying email, phone, and URL validation regex patterns',
    ],
    example: {
      inputLabel: 'Pattern: /\\b\\w+@\\w+\\.\\w+\\b/g',
      input: 'Contact us at support@example.com or sales@test.org',
      output: 'Match 1: support@example.com (index 14)\nMatch 2: sales@test.org (index 41)',
    },
  },

  httpStatusLookup: {
    longDescription:
      'HTTP Status Lookup provides instant reference information for standard RFC HTTP status codes (1xx–5xx) and vendor-specific codes from Cloudflare, Nginx, IIS, and Laravel.',
    howToSteps: [
      'Type a status code (e.g. 404, 500, 522) or name into the Input panel.',
      'The tool immediately displays the official status name, category, and RFC description.',
      'Review troubleshooting tips for resolving server and client errors.',
    ],
    features: [
      'Covers standard 1xx, 2xx, 3xx, 4xx, and 5xx HTTP codes',
      'Includes Cloudflare CDN errors (520, 521, 522, 524) and Nginx codes',
      'Explains causes and recommended remediation steps',
      'Instant offline lookup without network requests',
    ],
    useCases: [
      'Debugging API failure codes and webhook delivery issues',
      'Troubleshooting website downtime and reverse proxy errors',
      'Looking up correct REST API status codes during backend development',
    ],
    example: {
      inputLabel: 'Status Code',
      input: '503',
      output: '503 Service Unavailable: The server is currently unable to handle the request due to temporary overloading or maintenance.',
    },
  },
};

export function getToolContent(toolId: string): ToolContent | undefined {
  return toolContent[toolId];
}
