import type { Messages } from './types';

/** English is the source language — labels map is identity (unused at runtime). */
export const en: Messages = {
  ui: {
    clientSide: '100% Client-Side',
    searchTools: 'Search tools...',
    searchPlaceholder: 'Search tools...',
    noToolsFound: 'No tools found',
    toggleTheme: 'Toggle Theme',
    loadingTools: 'Loading tools...',
    menu: 'Menu',
    favorites: 'Favorites',
    allCategories: 'All Categories',
    none: 'None',
    category: 'Category',
    tool: 'Tool',
    options: 'Options',
    selectCategory: 'Select category...',
    selectTool: 'Select a tool...',
    addFavorite: 'Add to favorites',
    removeFavorite: 'Remove from favorites',
    transform: 'Transform',
    generate: 'Generate',
    processing: 'Processing...',
    input: 'INPUT',
    output: 'OUTPUT',
    diffResult: 'DIFF RESULT',
    paste: 'Paste',
    clear: 'Clear',
    expand: 'Expand',
    exit: 'Exit',
    exitFullscreen: 'Exit fullscreen (Esc)',
    fullscreen: 'Fullscreen',
    pasteFromClipboard: 'Paste from clipboard',
    clearInput: 'Clear input',
    copy: 'Copy',
    copied: 'Copied ✓',
    download: 'Download',
    downloadOutput: 'Download output',
    linesChars: '{lines} lines · {chars} chars',
    original: 'ORIGINAL',
    modified: 'MODIFIED',
    pasteOriginal: 'Paste original text here...',
    pasteModified: 'Paste modified text here...',
    resultPlaceholder: 'Result will appear here...',
    pasteData: 'Paste your data here...',
    inputNotRequired: 'No input required — results are generated from the options above.',
    faq: 'FAQ',
    privacyNote:
      'Processing runs in your browser only — input is not uploaded to a server.',
    faqFree: 'Is {name} free?',
    faqFreeAnswer: 'Yes. {name} is free on DevKit and does not require an account.',
    faqPrivacy: 'Does my data leave the browser?',
    faqPrivacyAnswer:
      'No. Transformations run locally in your browser. DevKit does not send your input to a server.',
    faqInstall: 'Do I need to install anything?',
    faqInstallAnswer: 'No. Open the page, paste or type your input, and get the result.',
    pageNotFound: 'Page not found',
    pageNotFoundHint: 'This tool or category does not exist. Choose a tool from the sidebar or go back home.',
    goHome: 'Go to DevKit',
    home: 'Home',
    homeHeading: 'DevKit — Free Online Developer Tools',
    homeIntro:
      'Format, convert and generate JSON, SQL, text and more — entirely in your browser.',
  },
  categories: {
    json: { name: 'JSON & Data Conversion', description: 'JSON, XML, YAML formatting, validation and data conversion tools' },
    formatters: { name: 'Code Formatters', description: 'JavaScript, TypeScript, HTML, CSS and SQL code formatting tools' },
    sql: { name: 'SQL', description: 'SQL generation and transformation tools' },
    text: { name: 'Text & List Utils', description: 'Text manipulation, list conversion, sorting and counting tools' },
    encoding: { name: 'Encoding', description: 'Base64, URL, HTML encoding and decoding tools' },
    generators: { name: 'Generators', description: 'UUID, GUID, password and random data generators' },
    inspect: { name: 'Inspect & Debug', description: 'Diff compare, JWT decode, regex test and HTTP status lookup' },
  },
  tools: {
    jsonFormatter: { 
      name: 'JSON Formatter', 
      description: 'Format and beautify JSON with customizable indentation. Paste an API response or config file, sort keys alphabetically, and copy clean readable JSON.',
      faq: [
        { q: 'Can I sort JSON keys alphabetically?', a: 'Yes. Enable the Sort Keys option to alphabetically order all object keys at every nesting level.' },
        { q: 'What is the maximum JSON size supported?', a: 'There is no hard limit — processing runs in your browser, so it depends on your device memory. Files up to 10 MB work smoothly on modern browsers.' }
      ]
    },
    jsonMinifier: { 
      name: 'JSON Minifier', 
      description: 'Minify JSON by removing all whitespace and line breaks. Compact your data for APIs, storage, or smaller payloads — paste and copy in one click.',
      faq: [
        { q: 'Will JSON minification change my data?', a: 'No, minification only removes whitespace (spaces, tabs, newlines) and keeps your JSON keys and values exactly intact.' },
        { q: 'Can I undo JSON minification?', a: 'Yes, you can paste the minified JSON back into the JSON Formatter tool to restore its readable, indented structure.' }
      ]
    },
    jsonValidator: { 
      name: 'JSON Validator', 
      description: 'Validate JSON syntax and get instant error diagnostics with line and column numbers. See the structure type, key count, and array length of valid documents.',
      faq: [
        { q: 'How does the JSON validator show errors?', a: 'It provides exact line and column numbers along with a descriptive error message pointing to the syntax issue.' },
        { q: 'Does it support trailing commas?', a: 'No, strict JSON validation requires standard JSON syntax, which does not allow trailing commas.' }
      ]
    },
    jsonToClass: { 
      name: 'JSON to Class', 
      description: 'Generate C#, TypeScript, or Java class definitions from a JSON sample. Smart type inference detects dates, GUIDs, nested objects, and arrays automatically.',
      faq: [
        { q: 'What languages are supported for class generation?', a: 'Currently, the tool supports generating classes for C#, TypeScript, and Java based on your JSON input.' },
        { q: 'Does it handle nested JSON objects?', a: 'Yes, it automatically creates separate class definitions for nested objects and links them correctly.' }
      ]
    },
    jsonToTypeScript: { 
      name: 'JSON to TypeScript', 
      description: 'Generate TypeScript interfaces from JSON data. Nested objects become separate interfaces, arrays are merged into union types, and invalid keys are quoted.',
      faq: [
        { q: 'How does it handle arrays with different object types?', a: 'It merges the properties of all objects in the array to create a comprehensive TypeScript interface with optional fields where necessary.' },
        { q: 'Does it create types or interfaces?', a: 'By default, it generates TypeScript interfaces, which are ideal for defining object shapes in most applications.' }
      ]
    },
    jsonToXml: { 
      name: 'JSON to XML', 
      description: 'Convert JSON to well-formed XML with a custom root element name. Includes optional XML declaration, configurable indentation, and proper character escaping.',
      faq: [
        { q: 'Can I customize the XML root node?', a: 'Yes, you can specify a custom name for the root element wrapping your converted JSON data.' },
        { q: 'Are special characters in JSON handled?', a: 'Yes, special characters like <, >, and & are automatically escaped in the generated XML to ensure it remains well-formed.' }
      ]
    },
    jsonToYaml: { 
      name: 'JSON to YAML', 
      description: 'Convert JSON to clean YAML output. Choose indentation width and optionally sort keys — useful for Kubernetes configs, CI pipelines, and Docker Compose files.',
      faq: [
        { q: 'Is the generated YAML compatible with Kubernetes?', a: 'Yes, the output is standard YAML, which works perfectly for Kubernetes manifests, Docker Compose, and CI/CD pipelines.' },
        { q: 'Can I sort the YAML keys?', a: 'Yes, there is an option to alphabetically sort the keys during the JSON to YAML conversion.' }
      ]
    },
    jsonDiff: { 
      name: 'JSON Diff', 
      description: 'Compare two JSON documents side by side. See added, removed, and changed values with full JSON path notation — ideal for API response debugging.',
      faq: [
        { q: 'Does JSON diff ignore formatting differences?', a: 'Yes, the comparison focuses on the actual structure and values, so indentation and whitespace differences are ignored.' },
        { q: 'Are array order changes detected?', a: 'Yes, if the order of elements in an array changes, it will be highlighted as a difference.' }
      ]
    },
    classToJson: { 
      name: 'Class to JSON', 
      description: 'Convert C#, TypeScript, or Java class definitions to sample JSON. Auto-detects the language and generates realistic mock values for each property type.',
      faq: [
        { q: 'Does it generate random mock data?', a: 'Yes, it inspects the data types in your class definitions and creates realistic sample values like names, dates, and numbers.' },
        { q: 'Can it parse complex nested classes?', a: 'Yes, it can parse multiple class definitions in the same input and resolve their relationships to build nested JSON.' }
      ]
    },
    yamlFormatter: { 
      name: 'YAML Formatter', 
      description: 'Format and beautify YAML with configurable indentation. Optionally sort keys alphabetically to keep large configuration files consistent and readable.',
      faq: [
        { q: 'Can I change the indentation size?', a: 'Yes, you can configure the number of spaces used for indentation to match your project standards.' },
        { q: 'Does it preserve YAML comments?', a: 'Yes, existing comments in your YAML file are preserved during the formatting process.' }
      ]
    },
    xmlFormatter: { 
      name: 'XML Formatter', 
      description: 'Format and validate XML with customizable indentation. Handles declarations, CDATA sections, comments, and processing instructions — optionally sort attributes.',
      faq: [
        { q: 'Does it format SVG files?', a: 'Yes, since SVG is an XML-based format, you can safely format and indent SVG code with this tool.' },
        { q: 'How does it handle CDATA blocks?', a: 'It correctly preserves CDATA sections without altering or escaping the raw content inside them.' }
      ]
    },
    javascriptFormatter: { 
      name: 'JavaScript Formatter', 
      description: 'Format and beautify JavaScript code with Prettier. Configure indentation, semicolons, and quote style — paste minified or messy JS and get clean readable code.',
      faq: [
        { q: 'Does it support ES6+ syntax?', a: 'Yes, it supports modern JavaScript features including async/await, optional chaining, and arrow functions.' },
        { q: 'Can I enforce single quotes?', a: 'Yes, you can easily toggle between single and double quotes in the formatting options.' }
      ]
    },
    jqueryFormatter: { 
      name: 'jQuery Formatter', 
      description: 'Format and beautify jQuery and JavaScript code. Configure indentation, semicolons, and quote style — ideal for legacy scripts and plugin code.',
      faq: [
        { q: 'Is this different from the JavaScript formatter?', a: 'It uses similar formatting rules but is tuned to handle common jQuery patterns and chained method calls gracefully.' },
        { q: 'Will formatting break my chained events?', a: 'No, it will neatly align long chains of jQuery methods across multiple lines for better readability.' }
      ]
    },
    typescriptFormatter: { 
      name: 'TypeScript Formatter', 
      description: 'Format and beautify TypeScript code with Prettier. Configure indentation, semicolons, and quote style for clean, consistent .ts and .tsx files.',
      faq: [
        { q: 'Does it format React TSX files?', a: 'Yes, the formatter fully supports JSX syntax embedded inside TypeScript files.' },
        { q: 'Are type annotations formatted?', a: 'Yes, it standardizes spacing around colons, generics, and union types.' }
      ]
    },
    htmlFormatter: { 
      name: 'HTML Formatter', 
      description: 'Format and beautify HTML markup with Prettier. Choose your indentation style and get properly nested, readable HTML from minified or messy source.',
      faq: [
        { q: 'Does it format inline CSS and JS?', a: 'Yes, it automatically detects and formats content inside <style> and <script> tags.' },
        { q: 'How are void elements handled?', a: 'Elements like <img> and <input> are formatted according to standard HTML5 rules, either with or without self-closing tags based on settings.' }
      ]
    },
    cssFormatter: { 
      name: 'CSS Formatter', 
      description: 'Format and beautify CSS stylesheets with Prettier. Configure indentation and quote style — works with full stylesheets and small snippets alike.',
      faq: [
        { q: 'Does it support SCSS or LESS?', a: 'While focused on standard CSS, it can format basic SCSS and LESS syntax accurately.' },
        { q: 'Are media queries formatted correctly?', a: 'Yes, nested rules inside media queries are indented perfectly to show the structural hierarchy.' }
      ]
    },
    base64: { 
      name: 'Base64 Encoder/Decoder', 
      description: 'Encode text to Base64 or decode Base64 back to text. Fully UTF-8 safe — handles Unicode characters, data URIs, and encoded tokens right in your browser.',
      faq: [
        { q: 'Is the Base64 encoding UTF-8 safe?', a: 'Yes, it properly encodes and decodes Unicode characters like emojis and non-Latin alphabets.' },
        { q: 'Can it decode JWT tokens?', a: 'Yes, pasting the payload section of a JWT will successfully decode its JSON contents.' }
      ]
    },
    guidGenerator: { 
      name: 'GUID Generator', 
      description: 'Generate random GUIDs in .NET-compatible formats (D, N, B, P). Choose casing, batch generate up to 10,000 at once, and pick your separator.',
      faq: [
        { q: 'What GUID formats are supported?', a: 'It supports standard hyphenated (D), digits only (N), braced (B), and parenthesized (P) formats.' },
        { q: 'How many GUIDs can I generate at once?', a: 'You can generate up to 10,000 unique GUIDs in a single batch directly in your browser.' }
      ]
    },
    uuidGenerator: { 
      name: 'UUID Generator', 
      description: 'Generate RFC 4122 UUID v4 values with cryptographically secure randomness. Choose standard or compact format, casing, and batch generate up to 10,000 UUIDs.',
      faq: [
        { q: 'Are the UUIDs cryptographically secure?', a: 'Yes, the tool utilizes the browser\'s native Crypto API to ensure high-quality randomness.' },
        { q: 'Which UUID version does this generate?', a: 'It generates UUID Version 4, which is purely random and independent of hardware addresses or timestamps.' }
      ]
    },
    passwordGenerator: { 
      name: 'Password Generator', 
      description: 'Generate cryptographically secure random passwords. Pick length, toggle uppercase, lowercase, numbers, and symbols, then batch generate.',
      faq: [
        { q: 'Are the generated passwords saved anywhere?', a: 'No, passwords are generated locally in your browser and are completely ephemeral. They are never saved or transmitted.' },
        { q: 'Can I exclude ambiguous characters?', a: 'Yes, you can customize the character sets to omit similar-looking characters like l, 1, O, and 0.' }
      ]
    },
    randomStringGenerator: { 
      name: 'Random String Generator', 
      description: 'Generate random strings with alphanumeric, letter-only, number-only, or hex character sets. Cryptographically secure — ideal for test IDs, tokens, and mock API keys.',
      faq: [
        { q: 'What character sets can I use?', a: 'You can choose from full alphanumeric, letters only, numbers only, or hexadecimal character sets.' },
        { q: 'Is there a limit on the string length?', a: 'You can define custom lengths typically up to thousands of characters per string.' }
      ]
    },
    sqlFormatter: { 
      name: 'SQL Formatter', 
      description: 'Pretty-print SQL for MySQL, PostgreSQL, T-SQL, SQLite, and PL/SQL. Pick a dialect and keyword case, then copy readable, well-indented SQL queries.',
      faq: [
        { q: 'Does it support multiple SQL dialects?', a: 'Yes, you can choose formatting rules specific to MySQL, PostgreSQL, SQL Server (T-SQL), SQLite, and PL/SQL.' },
        { q: 'Can it uppercase SQL keywords automatically?', a: 'Yes, the tool has an option to convert keywords like SELECT and WHERE to uppercase for standard readability.' }
      ]
    },
    sqlInGenerator: { 
      name: 'SQL IN Generator', 
      description: 'Convert a list of values into a SQL IN clause. Paste IDs or names from a spreadsheet and get a ready-to-use IN expression with automatic deduplication and trimming.',
      faq: [
        { q: 'Does it wrap text values in quotes?', a: 'Yes, you can specify whether the input values are numbers or strings, and it will wrap strings in single quotes.' },
        { q: 'Will it handle empty lines?', a: 'Yes, empty lines and excessive whitespace are automatically trimmed and ignored.' }
      ]
    },
    sqlToCSharpClass: { 
      name: 'SQL to C# Class', 
      description: 'Generate a C# POCO class from a CREATE TABLE statement or column list. Maps SQL types to C# types including nullability — saves time scaffolding entity models.',
      faq: [
        { q: 'Are nullable SQL columns mapped correctly?', a: 'Yes, if a column allows NULLs in SQL, the corresponding C# property will be nullable (e.g., int?).' },
        { q: 'Which SQL dialects are supported?', a: 'It primarily targets standard SQL, but handles most data types from SQL Server, MySQL, and PostgreSQL seamlessly.' }
      ]
    },
    columnToComma: { 
      name: 'Column to Comma', 
      description: 'Convert newline-separated values to a comma-separated list. Trim whitespace, remove empty lines, and deduplicate — paste from a spreadsheet column and get a single line.',
      faq: [
        { q: 'Can I deduplicate the values?', a: 'Yes, there is an option to remove duplicate entries while combining the list.' },
        { q: 'Does it handle spaces within the items?', a: 'Yes, internal spaces are preserved, though leading and trailing whitespace can be automatically trimmed.' }
      ]
    },
    commaToColumn: { 
      name: 'Comma to Column', 
      description: 'Split comma-separated values into individual lines. Paste a CSV row or IN clause and get a clean vertical list with optional whitespace trimming.',
      faq: [
        { q: 'What happens to trailing spaces after the comma?', a: 'Whitespace trimming is enabled by default, so padding spaces will be stripped from the resulting list.' },
        { q: 'Can I split by other delimiters?', a: 'This tool is optimized for commas, but other text splitting tools on DevKit can handle custom delimiters.' }
      ]
    },
    columnToQuoted: { 
      name: 'Column to Quoted List', 
      description: 'Wrap each line in single or double quotes and join with a separator. Turn a column of values into a quoted list ready for code, CSV, or configuration files.',
      faq: [
        { q: 'Can I choose single or double quotes?', a: 'Yes, you can toggle between single quotes (\') and double quotes (") depending on your target format.' },
        { q: 'Is escaping handled?', a: 'Quotes inside the actual values are automatically escaped to ensure the final list is valid.' }
      ]
    },
    columnToSqlIn: { 
      name: 'Column to SQL IN', 
      description: 'Convert a column of values into a SQL IN expression. Paste IDs or names line by line and get a ready-to-use IN clause with automatic deduplication.',
      faq: [
        { q: 'Is it different from the SQL IN Generator?', a: 'This tool specifically focuses on rapid raw column conversion without complex parsing, ideal for simple lists.' },
        { q: 'Does it handle numerical IDs?', a: 'Yes, you can configure it to output numbers without quotes for efficient querying.' }
      ]
    },
    removeDuplicates: { 
      name: 'Remove Duplicates', 
      description: 'Remove duplicate lines from text while preserving original order. Supports case-insensitive matching and whitespace trimming.',
      faq: [
        { q: 'Is the original line order preserved?', a: 'Yes, the first occurrence of each unique line is kept exactly in its original position.' },
        { q: 'Does case matter when removing duplicates?', a: 'You can choose whether the tool treats uppercase and lowercase characters as identical or distinct.' }
      ]
    },
    sortLines: { 
      name: 'Sort Lines', 
      description: 'Sort lines alphabetically or numerically in ascending or descending order. Supports case-sensitive sorting, whitespace trimming, and empty line removal.',
      faq: [
        { q: 'Can it sort numbers correctly?', a: 'Yes, the tool offers a numeric sort mode so that "10" comes after "2", not before.' },
        { q: 'Does it reverse sort?', a: 'Yes, you can easily toggle between ascending and descending order.' }
      ]
    },
    removeEmptyLines: { 
      name: 'Remove Empty Lines', 
      description: 'Strip empty and whitespace-only lines from text. Clean up logs, pasted data, and code snippets — optionally trim remaining lines too.',
      faq: [
        { q: 'Does it remove lines containing only spaces?', a: 'Yes, lines that contain only whitespace characters are considered empty and are removed.' },
        { q: 'Can I trim the remaining lines?', a: 'Yes, an option allows you to clean up leading and trailing spaces from the lines that are kept.' }
      ]
    },
    trimLines: { 
      name: 'Trim Lines', 
      description: 'Trim leading and trailing whitespace from each line independently. Choose to trim start, end, or both — optionally remove resulting empty lines.',
      faq: [
        { q: 'Can I choose to trim only the start of lines?', a: 'Yes, you have fine-grained control to trim only the beginning, only the end, or both sides.' },
        { q: 'Does it affect spaces between words?', a: 'No, internal spacing within the line remains completely untouched.' }
      ]
    },
    caseConverter: { 
      name: 'Case Converter', 
      description: 'Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, and more. Smart tokenization handles mixed-case identifiers.',
      faq: [
        { q: 'Can it handle mixed input text?', a: 'Yes, the smart tokenizer detects existing word boundaries even if the input mixes different cases.' },
        { q: 'Does it convert spaces to dashes or underscores?', a: 'Yes, depending on your target format, it seamlessly converts whitespace into the appropriate separator.' }
      ]
    },
    wordCounter: { 
      name: 'Word Counter', 
      description: 'Count words, characters, lines, sentences, and paragraphs. Unicode-aware detection handles international text and special characters.',
      faq: [
        { q: 'Are hyphenated words counted as one or two?', a: 'Standard hyphenated words are typically counted as a single word depending on context.' },
        { q: 'Does it count characters without spaces?', a: 'Yes, the statistics panel shows both the total character count and the count excluding spaces.' }
      ]
    },
    characterCounter: { 
      name: 'Character Counter', 
      description: 'Count characters with options to include or exclude spaces and newlines. See letter count, digit count, and whitespace breakdown — useful for field length limits.',
      faq: [
        { q: 'How is this different from the Word Counter?', a: 'This tool provides a more granular breakdown of character types, such as digits, symbols, and whitespace.' },
        { q: 'Does it count newlines?', a: 'Yes, you can see exactly how many newline characters exist in your text block.' }
      ]
    },
    diffCompare: { 
      name: 'Diff Compare', 
      description: 'Compare two texts and highlight differences line by line, word by word, or character by character. Supports optional whitespace ignoring.',
      faq: [
        { q: 'Can I ignore whitespace differences?', a: 'Yes, there is an option to ignore changes in indentation and trailing spaces.' },
        { q: 'How are additions and deletions shown?', a: 'Additions are typically highlighted in green, while deletions are highlighted in red for easy visual parsing.' }
      ]
    },
    regexTester: { 
      name: 'Regex Tester', 
      description: 'Test regular expressions against sample text in real time. See all matches with index positions and capture groups — supports global, case-insensitive, multiline, and dotAll flags.',
      faq: [
        { q: 'Which regex engine does this use?', a: 'It runs using the native JavaScript regular expression engine in your browser.' },
        { q: 'Does it show capture groups?', a: 'Yes, matches are broken down to explicitly show the contents of each capture group.' }
      ]
    },
    jwtDecoder: { 
      name: 'JWT Decoder', 
      description: 'Decode JWT tokens to inspect the header and payload without verifying the signature. Timestamp claims like exp and iat are automatically converted to readable UTC dates.',
      faq: [
        { q: 'Does the tool verify the JWT signature?', a: 'No, this tool only decodes the Base64 payload for inspection. It does not perform cryptographic validation.' },
        { q: 'Are expiration times readable?', a: 'Yes, Unix timestamps in claims like "exp" or "iat" are automatically converted to human-readable dates.' }
      ]
    },
    httpStatusLookup: { 
      name: 'HTTP Status Lookup', 
      description: 'Look up any HTTP status code instantly. Covers standard 1xx–5xx codes plus vendor-specific codes from Nginx, Cloudflare, IIS, and Laravel — enter one or multiple codes.',
      faq: [
        { q: 'Does it include Cloudflare errors like 522?', a: 'Yes, it includes popular vendor-specific status codes like those from Cloudflare, Nginx, and IIS.' },
        { q: 'Can I search by the status message?', a: 'Yes, the tool allows you to search by the numeric code or the descriptive text.' }
      ]
    }
  },
  labels: {},
};

