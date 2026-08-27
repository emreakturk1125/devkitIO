import type { Messages } from './types';

/** English is the source language — labels map is identity (unused at runtime). */
export const en: Messages = {
  ui: {
    clientSide: '100% Client-Side',
    searchTools: 'Search tools...',
    searchPlaceholder: 'Search tools...',
    noToolsFound: 'No tools found',
    toggleTheme: 'Toggle Theme',
    language: 'Language',
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
    sql: { name: 'SQL', description: 'SQL formatting, generation and transformation tools' },
    data: { name: 'Data', description: 'JSON, YAML, XML, JavaScript and data conversion tools' },
    text: { name: 'Text', description: 'Text manipulation, sorting and transformation tools' },
    encoding: { name: 'Encoding', description: 'Base64, URL, HTML encoding and decoding tools' },
    generators: { name: 'Generators', description: 'UUID, hash, password and random data generators' },
    debugging: { name: 'Debugging', description: 'Diff, validation and debugging utilities' },
    code: { name: 'Code', description: 'Code formatting and beautification tools' },
    conversion: { name: 'Conversion', description: 'Data format conversion tools' },
    web: { name: 'Web', description: 'URL parsing, cURL conversion and web utilities' },
  },
  tools: {
    jsonFormatter: {
      name: 'JSON Formatter',
      description: 'Indent and tidy JSON so API responses and config files are readable. Invalid JSON is flagged before you copy the result.',
    },
    jsonMinifier: {
      name: 'JSON Minifier',
      description: 'Strip whitespace from JSON to shrink payloads. Use it before sending data or storing compact fixtures.',
    },
    jsonValidator: {
      name: 'JSON Validator',
      description: 'Check whether JSON parses cleanly. Errors show the line and column so you can fix the spot quickly.',
    },
    jsonToClass: {
      name: 'JSON to Class',
      description: 'Turn a JSON sample into C#, TypeScript, or Java types. Useful when scaffolding models from a real API response.',
    },
    jsonToTypeScript: {
      name: 'JSON to TypeScript',
      description: 'Build TypeScript interfaces from JSON. Nested objects become typed shapes you can paste into a project.',
    },
    jsonToXml: {
      name: 'JSON to XML',
      description: 'Convert JSON into XML with a chosen root element. Handy when a service still expects XML.',
    },
    jsonToYaml: {
      name: 'JSON to YAML',
      description: 'Convert JSON to YAML for configs and pipelines. Keys can stay in order or be sorted.',
    },
    jsonDiff: {
      name: 'JSON Diff',
      description: 'Compare two JSON documents and list added, removed, and changed values. Good for spotting API or config drift.',
    },
    classToJson: {
      name: 'Class to JSON',
      description: 'Paste a C#, TypeScript, or Java type and get sample JSON. Helps draft fixtures from an existing model.',
    },
    yamlFormatter: {
      name: 'YAML Formatter',
      description: 'Re-indent YAML so maps and lists line up. Optional key sorting keeps large files consistent.',
    },
    xmlFormatter: {
      name: 'XML Formatter',
      description: 'Pretty-print and validate XML. Attributes can be sorted when you need a stable layout.',
    },
    javascriptFormatter: {
      name: 'JavaScript Formatter',
      description: 'Reformat JavaScript with your indent and quote style. Makes minified or messy scripts easier to read.',
    },
    jqueryFormatter: {
      name: 'jQuery Formatter',
      description: 'Format jQuery and JavaScript snippets. Useful for old pages or copied plugin code.',
    },
    typescriptFormatter: {
      name: 'TypeScript Formatter',
      description: 'Pretty-print TypeScript with indent and semicolon options. Helps when reviewing pasted .ts files.',
    },
    htmlFormatter: {
      name: 'HTML Formatter',
      description: 'Indent HTML so tags and nested markup are clear. Paste a fragment and copy a cleaner version.',
    },
    cssFormatter: {
      name: 'CSS Formatter',
      description: 'Format stylesheets so rules and properties are easy to scan. Works on full files or small snippets.',
    },
    base64: {
      name: 'Base64 Encoder/Decoder',
      description: 'Encode text to Base64 or decode it back. Common for tokens, data URLs, and email-safe payloads.',
    },
    guidGenerator: {
      name: 'GUID Generator',
      description: 'Create .NET-style GUIDs in a few formats. Generate one or many without leaving the page.',
    },
    uuidGenerator: {
      name: 'UUID Generator',
      description: 'Create RFC 4122 UUID v4 values. Choose casing and hyphens to match your codebase.',
    },
    passwordGenerator: {
      name: 'Password Generator',
      description: 'Build random passwords with length and character-set options. Nothing is stored after you copy the result.',
    },
    randomStringGenerator: {
      name: 'Random String Generator',
      description: 'Create random strings from letters, numbers, or hex. Useful for test IDs and dummy keys.',
    },
    sqlFormatter: {
      name: 'SQL Formatter',
      description: 'Pretty-print SQL for MySQL, PostgreSQL, T-SQL, and more. Pick a dialect and keyword case, then copy readable SQL.',
    },
    sqlInGenerator: {
      name: 'SQL IN Generator',
      description: 'Turn a list of values into a SQL IN (...) clause. Paste IDs or names and get a query-ready list.',
    },
    sqlToCSharpClass: {
      name: 'SQL to C# Class',
      description: 'Generate a C# class from CREATE TABLE or a column list. Speeds up mapping tables to models.',
    },
    columnToComma: {
      name: 'Column to Comma',
      description: 'Join one-value-per-line text into a comma-separated list. Trim, skip blanks, or drop duplicates first.',
    },
    commaToColumn: {
      name: 'Comma to Column',
      description: 'Split a comma-separated string into one item per line. Useful for Excel columns and IN-list cleanup.',
    },
    columnToQuoted: {
      name: 'Column to Quoted List',
      description: 'Wrap each line in quotes and join them. Ready for CSV cells or language string lists.',
    },
    columnToSqlIn: {
      name: 'Column to SQL IN',
      description: 'Convert lines into a quoted SQL IN list. Built for ID batches you paste from a spreadsheet.',
    },
    removeDuplicates: {
      name: 'Remove Duplicates',
      description: 'Drop duplicate lines and keep the first occurrence if you want. Case and trim options are available.',
    },
    sortLines: {
      name: 'Sort Lines',
      description: 'Sort lines A–Z or by number. Reverse the order when you need a descending list.',
    },
    removeEmptyLines: {
      name: 'Remove Empty Lines',
      description: 'Delete blank or whitespace-only lines. Tightens logs and pasted lists.',
    },
    trimLines: {
      name: 'Trim Lines',
      description: 'Remove leading and trailing spaces on each line. Optional empty-line cleanup is included.',
    },
    caseConverter: {
      name: 'Case Converter',
      description: 'Switch text between camelCase, snake_case, kebab-case, and more. Built for identifiers and titles.',
    },
    wordCounter: {
      name: 'Word Counter',
      description: 'Count words, lines, and sentences in pasted text. Fast check for docs or UI copy limits.',
    },
    characterCounter: {
      name: 'Character Counter',
      description: 'Count characters with or without spaces and newlines. Useful for field limits and tweets.',
    },
    diffCompare: {
      name: 'Diff Compare',
      description: 'Compare two texts and highlight line or word changes. Paste original and modified versions side by side.',
    },
    regexTester: {
      name: 'Regex Tester',
      description: 'Run a regular expression against sample text and list matches. Toggle global, case, and multiline flags.',
    },
    jwtDecoder: {
      name: 'JWT Decoder',
      description: 'Read a JWT header and payload without verifying the signature. Inspect claims locally only.',
    },
    httpStatusLookup: {
      name: 'HTTP Status Lookup',
      description: 'Look up an HTTP status code and its meaning. Covers standard codes and a few gateway extras.',
    },
  },
  labels: {},
};
