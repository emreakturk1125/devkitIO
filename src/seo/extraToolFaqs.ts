/** Extra high-intent FAQs. Merged with the two questions in `src/i18n/en.ts` (5 total). */
export const extraToolFaqs: Record<string, { q: string; a: string }[]> = {
  jsonFormatter: [
    { q: 'Does the JSON formatter upload my data?', a: 'No. Parsing and indentation run in your browser. The JSON you paste is not sent to a server.' },
    { q: 'Can I format invalid JSON?', a: 'Invalid JSON is not rewritten. The output shows a message such as “Invalid JSON” so you can fix the syntax, then format again.' },
    { q: 'Which indent sizes are available?', a: 'Choose 2 spaces, 4 spaces, or a tab. You can also sort object keys alphabetically before copying the result.' },
  ],
  jsonMinifier: [
    { q: 'Does minifying JSON change values?', a: 'No. Only insignificant whitespace is removed. Keys, strings, numbers, and array order stay the same.' },
    { q: 'Why minify JSON?', a: 'A single-line payload is smaller to paste into logs, query strings, and request bodies. Use the JSON Formatter when you need to read it again.' },
    { q: 'What if the JSON is invalid?', a: 'The minifier does not invent a valid document. Fix the syntax in the JSON Validator, then minify the corrected text.' },
  ],
  jsonValidator: [
    { q: 'Does a green result mean the JSON matches my schema?', a: 'It means the text is syntactically valid JSON. This tool does not check JSON Schema, required fields, or business rules.' },
    { q: 'Why was my JSON rejected for a trailing comma?', a: 'The JSON spec does not allow trailing commas. Remove the comma after the last property or array item.' },
    { q: 'Can I validate a JSON array?', a: 'Yes. A top-level array or object is valid. The result reports the top-level type and basic size stats.' },
  ],
  jsonToClass: [
    { q: 'Which languages can I generate?', a: 'C# classes, TypeScript interfaces, and Java classes. Pick the language and a root class name in the options.' },
    { q: 'How are nested objects handled?', a: 'Each nested object becomes its own class or interface, and arrays of objects become lists of that type.' },
    { q: 'Is the generated code uploaded?', a: 'No. The sample JSON and the generated source stay in your browser.' },
  ],
  jsonToTypeScript: [
    { q: 'Does it emit interfaces or type aliases?', a: 'It emits exported interfaces. Nested objects are split into their own interfaces so the root type stays readable.' },
    { q: 'What happens with an array of objects?', a: 'Properties seen on the items are merged into one interface. Keys that are not valid identifiers are quoted.' },
    { q: 'Can I rename the root interface?', a: 'Yes. Set the root name in the options before you copy the output.' },
  ],
  jsonToXml: [
    { q: 'Can I name the XML root element?', a: 'Yes. Set the root element name in the options. An optional XML declaration can be included.' },
    { q: 'Are characters like < and & escaped?', a: 'Yes. Text is escaped so the document stays well-formed XML.' },
    { q: 'Does conversion leave my browser?', a: 'No. The JSON is parsed and the XML is built locally.' },
  ],
  jsonToYaml: [
    { q: 'Will this YAML work in Kubernetes?', a: 'The output is standard YAML. You still need a valid manifest (apiVersion, kind, and the fields your cluster expects).' },
    { q: 'Can keys be sorted?', a: 'Yes. Enable Sort Keys when you want a stable order for diffs in Git.' },
    { q: 'What indent widths are supported?', a: 'Pick the indentation width in the options. The JSON must be valid before conversion starts.' },
  ],
  jsonDiff: [
    { q: 'Does key order count as a change?', a: 'No. Objects are compared by key, so reordered keys are not reported as edits. Array order is significant.' },
    { q: 'How do I read a changed path?', a: 'Each change includes a JSON path such as users[0].email so you can jump to that value in either document.' },
    { q: 'Is whitespace ignored?', a: 'Yes. The documents are parsed first, so indentation differences alone do not show up as changes.' },
  ],
  classToJson: [
    { q: 'Which languages can I paste?', a: 'C#, TypeScript, and Java class definitions. The parser detects the language and builds a sample object.' },
    { q: 'Are the sample values real data?', a: 'They are mock values inferred from the property type (strings, numbers, booleans, dates, and nested objects).' },
    { q: 'Can I pretty-print the sample afterwards?', a: 'Yes. Copy the JSON into the JSON Formatter if you want a different indent.' },
  ],
  yamlFormatter: [
    { q: 'Can I change YAML indentation?', a: 'Yes. Choose the indentation width in the options, and optionally sort keys.' },
    { q: 'What if my YAML is invalid?', a: 'The formatter reports the parse error instead of writing a broken document.' },
    { q: 'Does formatting upload the file?', a: 'No. Parsing and printing run in your browser.' },
  ],
  xmlFormatter: [
    { q: 'Can I format SVG with this tool?', a: 'Yes. SVG is XML, so declarations, elements, and attributes are indented the same way.' },
    { q: 'Can attributes be sorted?', a: 'Yes. Enable attribute sorting when you want a stable order for reviews and diffs.' },
    { q: 'Are comments and CDATA kept?', a: 'Comments, CDATA sections, and processing instructions are preserved while the markup is re-indented.' },
  ],
  javascriptFormatter: [
    { q: 'Which formatter engine is used?', a: 'Prettier, running in your browser. You can set indentation, semicolons, and single or double quotes.' },
    { q: 'Will it format JSX?', a: 'Yes. The JavaScript parser accepts JSX, so React snippets can be formatted here.' },
    { q: 'Is my source code sent anywhere?', a: 'No. The script stays on your device while Prettier prints the result.' },
  ],
  jqueryFormatter: [
    { q: 'When should I use this instead of the JavaScript formatter?', a: 'Use it for legacy scripts and jQuery chains. Both tools use Prettier; this page is aimed at plugin and DOM code.' },
    { q: 'Can I keep or drop semicolons?', a: 'Yes. Semicolons and quote style are options, same as indentation width.' },
    { q: 'Does a syntax error get rewritten?', a: 'No. If Prettier cannot parse the script, the error is shown and the input is left unchanged.' },
  ],
  typescriptFormatter: [
    { q: 'Does it format .tsx files?', a: 'Yes. TypeScript and JSX are both parsed, so React components format with the same options as plain .ts files.' },
    { q: 'Can I choose quote style and semicolons?', a: 'Yes. Set indentation, semicolons, and single or double quotes before you copy the result.' },
    { q: 'Is the code uploaded to format it?', a: 'No. Prettier runs locally in the browser.' },
  ],
  htmlFormatter: [
    { q: 'Are style and script tags formatted too?', a: 'Yes. Prettier formats the HTML tree and the CSS or JavaScript embedded in style and script elements.' },
    { q: 'What indent can I use?', a: 'Pick the indentation width in the options, then copy the nested markup.' },
    { q: 'Will broken HTML be guessed?', a: 'Prettier parses the markup it can. A hard syntax error is reported instead of a silent rewrite.' },
  ],
  cssFormatter: [
    { q: 'Does it format a full stylesheet or a snippet?', a: 'Both. Paste a rule, a media query, or an entire file.' },
    { q: 'Can I change quotes and indentation?', a: 'Yes. Indentation and quote style are options on the page.' },
    { q: 'Is vendor CSS uploaded?', a: 'No. Formatting runs in your browser.' },
  ],
  sqlFormatter: [
    { q: 'Which SQL dialects can I format?', a: 'Standard SQL, T-SQL, PostgreSQL, MySQL, SQLite, and PL/SQL. Pick the dialect so keywords and syntax match that engine.' },
    { q: 'Can keywords be forced to uppercase?', a: 'Yes. Set Keyword Case to uppercase, lowercase, or preserve, and choose the tab width.' },
    { q: 'Do queries leave my browser?', a: 'No. sql-formatter runs locally. Nothing is sent to a server.' },
  ],
  sqlInGenerator: [
    { q: 'How do I quote strings versus numbers?', a: 'Choose the quote style in the options. Numeric lists stay unquoted; text values are wrapped for an IN list.' },
    { q: 'Are duplicate IDs removed?', a: 'Yes, when Remove Duplicates is on. Empty lines are dropped and surrounding whitespace is trimmed.' },
    { q: 'Where should I paste the result?', a: 'Copy the IN (...) expression into the WHERE clause, or format the full query with the SQL Formatter.' },
  ],
  sqlToCSharpClass: [
    { q: 'What SQL input does it accept?', a: 'A CREATE TABLE statement or a column list. Types such as int, varchar, datetime, and decimal map to C# properties.' },
    { q: 'How are NULL columns represented?', a: 'Nullable columns become nullable C# types, such as int? or string, based on the SQL nullability.' },
    { q: 'Can I set the class name?', a: 'Yes. Set the class name and indentation, then copy the POCO into your project.' },
  ],
  columnToComma: [
    { q: 'Can I use a separator other than a comma?', a: 'Yes. The separator option defaults to a comma. Change it if you need a semicolon or another delimiter.' },
    { q: 'Will blank lines be included?', a: 'Empty lines are removed when that option is on, and each remaining value can be trimmed.' },
    { q: 'Can duplicates be dropped?', a: 'Yes. Enable Remove Duplicates to keep the first occurrence of each value.' },
  ],
  commaToColumn: [
    { q: 'Does it split only on commas?', a: 'Yes. Each comma starts a new line. Leading and trailing spaces around values can be trimmed.' },
    { q: 'Can I paste a SQL IN list?', a: 'Paste the inside of the list, or the comma-separated values. Then use Column to SQL IN if you need to rebuild the clause.' },
    { q: 'Are empty slots kept?', a: 'Empty entries can be removed with the Remove Empty Lines option.' },
  ],
  columnToQuoted: [
    { q: 'Can I pick single or double quotes?', a: 'Yes. Choose the quote style and the separator that joins the wrapped values.' },
    { q: 'What if a value already contains a quote?', a: 'Quotes inside a value are escaped so the list stays valid for code or SQL.' },
    { q: 'Can I drop duplicates first?', a: 'Yes. Enable Remove Duplicates and trimming before you copy the quoted list.' },
  ],
  columnToSqlIn: [
    { q: 'Does this quote strings automatically?', a: 'Yes. Pick the quote style for text. The result is an IN (...) list you can paste into WHERE.' },
    { q: 'Are duplicate lines removed?', a: 'When Remove Duplicates is enabled, repeated values appear once. Empty lines are skipped.' },
    { q: 'How is this different from SQL IN Generator?', a: 'Both build an IN list from a column. Use SQL Formatter afterwards if you want the surrounding query beautified.' },
  ],
  removeDuplicates: [
    { q: 'Which copy of a line is kept?', a: 'The first occurrence stays in place. Later copies are removed, so the original order of unique lines is preserved.' },
    { q: 'Can matching ignore letter case?', a: 'Yes. Turn off Case Sensitive when “Error” and “error” should count as the same line.' },
    { q: 'Does trimming affect what counts as a duplicate?', a: 'When Trim is on, leading and trailing whitespace is ignored while lines are compared.' },
  ],
  sortLines: [
    { q: 'Can I sort numbers so 10 comes after 2?', a: 'Yes. Enable Numeric Sort. Alphabetical sort would place “10” before “2”.' },
    { q: 'Can the list be Z to A?', a: 'Yes. Choose descending order. Case sensitivity and trimming are separate options.' },
    { q: 'Are blank lines removed while sorting?', a: 'Only if you enable Remove Empty Lines. Otherwise they stay in the sorted result.' },
  ],
  removeEmptyLines: [
    { q: 'Are lines that contain only spaces removed?', a: 'Yes. Whitespace-only lines are treated as empty and dropped.' },
    { q: 'Can the remaining lines be trimmed?', a: 'Yes. Use the trim option when you also want to strip spaces at the ends of kept lines.' },
    { q: 'Does this change line order?', a: 'No. Surviving lines stay in their original order.' },
  ],
  trimLines: [
    { q: 'Can I trim only the start or only the end?', a: 'Yes. Trim Start and Trim End are separate switches, so you can clean one side only.' },
    { q: 'Are spaces between words removed?', a: 'No. Only whitespace at the edges of each line is removed.' },
    { q: 'What if trimming leaves a blank line?', a: 'Enable Remove Empty Lines to drop lines that become empty after trimming.' },
  ],
  caseConverter: [
    { q: 'Which case styles are supported?', a: 'camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, and related modes in the option list.' },
    { q: 'Will “userProfileData” become “user-profile-data”?', a: 'Yes, when the target mode is kebab-case. The tokenizer splits on existing capitals, underscores, and hyphens.' },
    { q: 'Is the converted text uploaded?', a: 'No. Conversion runs in your browser.' },
  ],
  wordCounter: [
    { q: 'What does the counter report?', a: 'Words, characters, lines, sentences, and paragraphs, using Unicode-aware detection.' },
    { q: 'Do spaces count as words?', a: 'No. Words are separated by whitespace. The character totals still show length with spaces when you need that figure.' },
    { q: 'Is my draft sent to a server to be counted?', a: 'No. The counts are computed locally as you type or paste.' },
  ],
  characterCounter: [
    { q: 'Can I exclude spaces and newlines?', a: 'Yes. Include Spaces and Include Newlines are options, and the breakdown still lists letters, digits, and whitespace.' },
    { q: 'How is this different from Word Counter?', a: 'Word Counter summarizes words and sentences. This page focuses on character totals and character classes for length limits.' },
    { q: 'Does it handle emoji and accents?', a: 'Yes. Counting uses the text you pasted, including Unicode letters and symbols.' },
  ],
  base64: [
    { q: 'Will emoji and non-English text survive a round trip?', a: 'Yes. Encode and decode use UTF-8 via TextEncoder and TextDecoder, not the ASCII-only btoa path.' },
    { q: 'What if I decode text that is not Base64?', a: 'The output shows an error instead of garbled text. Switch the mode to Encode when the input is plain text.' },
    { q: 'Can I inspect a JWT with this?', a: 'You can decode a single Base64URL segment, but the JWT Decoder splits header, payload, and timestamps for you.' },
  ],
  guidGenerator: [
    { q: 'Which .NET format letters are supported?', a: 'D (hyphenated), N (32 digits), B (braces), and P (parentheses), plus upper or lower case.' },
    { q: 'How many GUIDs can I generate at once?', a: 'Set Count up to 10,000. Choose a newline, comma, or space separator for the batch.' },
    { q: 'Are these GUIDs created on a server?', a: 'No. They are generated in your browser and shown only in the output panel.' },
  ],
  uuidGenerator: [
    { q: 'Which UUID version is this?', a: 'Version 4, as defined by RFC 4122, using cryptographically secure random bytes from the browser.' },
    { q: 'Can I get a compact UUID without hyphens?', a: 'Yes. Choose the compact format, then upper or lower case, and a separator if you generate a batch.' },
    { q: 'Is there a batch limit?', a: 'You can generate up to 10,000 UUIDs in one run. Nothing is stored after you leave the page.' },
  ],
  passwordGenerator: [
    { q: 'Where are the passwords generated?', a: 'In your browser, with the Web Crypto API. They are not saved and are not sent over the network.' },
    { q: 'What can I include in the password?', a: 'Toggle uppercase, lowercase, numbers, and symbols, and set the length and how many passwords to generate.' },
    { q: 'What length should I use?', a: '16 characters or more is a practical default for account passwords. Use a longer value for secrets and admin credentials.' },
  ],
  randomStringGenerator: [
    { q: 'Which character sets are available?', a: 'Alphanumeric, letters, numbers, or hexadecimal. Set the length, the count, and the separator for a batch.' },
    { q: 'Is the randomness secure enough for test tokens?', a: 'Yes. Values come from the browser crypto API. Treat production secrets with your own key-management process.' },
    { q: 'Are generated strings stored?', a: 'No. They exist only in the page until you copy them or refresh.' },
  ],
  diffCompare: [
    { q: 'Can I compare by word or by character?', a: 'Yes. Diff Type can be lines, words, or characters. Ignore Whitespace skips changes that are only spaces or tabs.' },
    { q: 'Which side is the original?', a: 'The left pane is the original and the right pane is the modified text. Additions and deletions are highlighted between them.' },
    { q: 'Is either text uploaded to compute the diff?', a: 'No. The comparison runs locally in your browser.' },
  ],
  regexTester: [
    { q: 'Which regex flavor is this?', a: 'JavaScript RegExp, the engine in your browser. Flags are global, ignore case, multiline, and dotAll.' },
    { q: 'Does it list capture groups?', a: 'Yes. Each match shows its index and the text captured by each group.' },
    { q: 'What if the pattern is invalid?', a: 'The page reports the syntax error instead of running a broken expression.' },
  ],
  jwtDecoder: [
    { q: 'Does decoding a JWT prove it is trustworthy?', a: 'No. This tool only decodes the header and payload. It does not check the signature or the issuer.' },
    { q: 'Why did exp become a date?', a: 'Numeric exp, iat, nbf, and auth_time claims are shown as UTC timestamps so you can see expiry without converting by hand.' },
    { q: 'Is the token sent to DevKit?', a: 'No. Base64URL decoding happens in your browser. Do not paste tokens you are not allowed to view on this machine.' },
  ],
  httpStatusLookup: [
    { q: 'Which codes are included?', a: 'Standard 1xx–5xx codes plus common vendor codes from Nginx, Cloudflare, IIS, and Laravel, such as 522.' },
    { q: 'Can I look up more than one code?', a: 'Yes. Enter one code or several. Each match shows the reason phrase and a short explanation.' },
    { q: 'Does the lookup need a network call?', a: 'No. The catalog is in the page, so it works offline after the app has loaded.' },
  ],
};
