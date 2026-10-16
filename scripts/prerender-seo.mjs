import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://devkitio.com';
const SITE_NAME = 'DevKit';

// Import toolContent and site utilities directly
const { toolContent } = await import('../src/seo/toolContent.ts');
const { toolSlug, toolPageTitle, toolPageDescription } = await import('../src/seo/site.ts');
const { tokenizeCode } = await import('../src/seo/highlight.ts');
const { parseRichText, withSiblingLinks } = await import('../src/seo/richText.ts');
const { extraToolFaqs } = await import('../src/seo/extraToolFaqs.ts');

const HIGH_PRIORITY = new Set([
  'jsonFormatter',
  'jsonToClass',
  'sqlFormatter',
  'base64',
  'guidGenerator',
  'diffCompare',
  'jwtDecoder',
]);

/** Category display names and descriptions (mirrors categoryRegistry.ts) */
const CATEGORY_META = {
  json: {
    name: 'JSON & Data Conversion',
    description: 'JSON, XML, YAML formatting, validation and data conversion tools',
    keywords: 'json formatter, json beautifier, json to xml, json to yaml, json validator, xml formatter, yaml formatter, json converter',
  },
  formatters: {
    name: 'Code Formatters',
    description: 'JavaScript, TypeScript, HTML and CSS code formatting tools',
    keywords: 'javascript formatter, typescript formatter, html formatter, css formatter, code beautifier, prettier online, format code',
  },
  sql: {
    name: 'SQL',
    description: 'SQL generation, formatting and transformation tools',
    keywords: 'sql formatter, sql beautifier, sql in clause, sql to csharp, sql generator, format sql online',
  },
  text: {
    name: 'Text & List Utils',
    description: 'Text manipulation, list conversion, sorting and counting tools',
    keywords: 'word counter, character counter, remove duplicates, sort lines, case converter, text tools online',
  },
  encoding: {
    name: 'Encoding',
    description: 'Base64, URL, HTML encoding and decoding tools',
    keywords: 'base64 encoder, base64 decoder, encode decode online, base64 converter, jwt decoder',
  },
  generators: {
    name: 'Generators',
    description: 'UUID, GUID, password and random data generators',
    keywords: 'guid generator, uuid generator, password generator, random string generator, generate uuid online',
  },
  inspect: {
    name: 'Inspect & Debug',
    description: 'Diff compare, JWT decode, regex test and HTTP status lookup',
    keywords: 'diff compare, jwt decoder, regex tester, http status codes, text diff online',
  },
};

function walkTs(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walkTs(full));
    else if (entry.endsWith('.ts')) files.push(full);
  }
  return files;
}

function extractI18nToolCopy() {
  const text = readFileSync(join(root, 'src/i18n/en.ts'), 'utf8');
  let code = text.replace(/import type .*?;/g, '');
  code = code.replace(/export const en:\s*Messages\s*=/, 'const en =');
  let en;
  try {
    en = new Function(`${code}; return en;`)();
  } catch (e) {
    console.warn('Fallback to regex parsing due to eval error:', e.message);
    const copy = new Map();
    const re = /(\w+):\s*\{\s*name:\s*'((?:\\'|[^'])*)',\s*description:\s*'((?:\\'|[^'])*)'/g;
    for (const match of text.matchAll(re)) {
      copy.set(match[1], { name: match[2], description: match[3] });
    }
    return copy;
  }
  const copy = new Map();
  for (const [key, value] of Object.entries(en.tools)) {
    copy.set(key, value);
  }
  return copy;
}

function extractI18nFaqCopy() {
  const text = readFileSync(join(root, 'src/i18n/en.ts'), 'utf8');
  const faq = {};
  const keys = ['faqFree', 'faqFreeAnswer', 'faqPrivacy', 'faqPrivacyAnswer', 'faqInstall', 'faqInstallAnswer'];
  for (const key of keys) {
    const re = new RegExp(`${key}:\\s*'((?:\\\\'|[^'])*)'`);
    const m = text.match(re);
    if (m) faq[key] = m[1];
    if (!faq[key]) {
      const re2 = new RegExp(`${key}:\\s*\\n\\s*'((?:\\\\'|[^'])*)'`);
      const m2 = text.match(re2);
      if (m2) faq[key] = m2[1];
    }
  }
  return faq;
}

function extractTools() {
  const i18n = extractI18nToolCopy();
  const tools = [];
  for (const file of walkTs(join(root, 'src/tools'))) {
    const text = readFileSync(file, 'utf8');
    const start = text.lastIndexOf('const tool');
    if (start < 0) continue;
    const chunk = text.slice(start, start + 900);
    const id = chunk.match(/\bid:\s*'([^']+)'/)?.[1];
    const name = chunk.match(/\bname:\s*'([^']+)'/)?.[1];
    const description = chunk.match(/\bdescription:\s*'([^']+)'/)?.[1];
    const category = chunk.match(/\bcategory:\s*'([^']+)'/)?.[1];
    const relatedMatch = text.match(/relatedToolIds:\s*\[([^\]]*)\]/);
    const relatedToolIds = relatedMatch
      ? relatedMatch[1]
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
      : [];
    if (id && category && name) {
      const localized = i18n.get(id);
      tools.push({
        id,
        category,
        slug: toolSlug(id),
        name: localized?.name ?? name,
        description: localized?.description ?? description ?? name,
        faq: [...(localized?.faq ?? []), ...(extraToolFaqs[id] ?? [])].slice(0, 7),
        relatedToolIds,
      });
    }
  }
  return tools.sort((a, b) => a.id.localeCompare(b.id));
}

function escapeHtml(value) {
  if (!value) return '';
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function richToHtml(text) {
  return parseRichText(text)
    .map((part) => {
      if (part.kind === 'link' && part.href?.startsWith('/')) {
        return `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`;
      }
      return escapeHtml(part.text);
    })
    .join('');
}

function highlightHtml(code) {
  return tokenizeCode(code)
    .map((token) => {
      const safe = escapeHtml(token.text);
      return token.kind === 'text' ? safe : `<span class="tok-${token.kind}">${safe}</span>`;
    })
    .join('');
}

function replaceAttr(html, pattern, value) {
  return html.replace(pattern, value);
}

// ─── JSON-LD Structured Data Builders ───────────────────────────────────────

function buildBreadcrumbJsonLd(crumbs) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  });
}

function buildToolFaqItems(toolName, faqCopy, toolFaq) {
  const items = [];
  if (toolFaq && toolFaq.length > 0) {
    for (const f of toolFaq) {
      items.push({ question: f.q, answer: f.a });
    }
  }
  if (items.length >= 5) return items.slice(0, 7);
  const generics = [
    {
      question: (faqCopy.faqFree ?? 'Is {name} free?').replace('{name}', toolName),
      answer: (faqCopy.faqFreeAnswer ?? 'Yes. {name} is free on DevKit and does not require an account.').replace('{name}', toolName),
    },
    {
      question: faqCopy.faqPrivacy ?? 'Does my data leave the browser?',
      answer: faqCopy.faqPrivacyAnswer ?? 'No. Transformations run locally in your browser. DevKit does not send your input to a server.',
    },
    {
      question: faqCopy.faqInstall ?? 'Do I need to install anything?',
      answer: faqCopy.faqInstallAnswer ?? 'No. Open the page, paste or type your input, and get the result.',
    },
  ];
  for (const item of generics) {
    if (items.length >= 5) break;
    items.push(item);
  }
  return items.slice(0, 7);
}

function buildFaqJsonLd(items) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  });
}

function buildHowToJsonLd(toolName, steps) {
  if (!steps || steps.length === 0) return '';
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use ${toolName} Online (Step-by-Step Guide)`,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Step ${i + 1}`,
      text: s,
    })),
  });
}

// ─── Semantic Static HTML Builders (Rendered inside <div id="root">) ────────

function breadcrumbNav(crumbs) {
  if (!crumbs || crumbs.length < 2) return '';
  const path = (url) => url.replace(SITE_URL, '') || '/';
  return `<nav aria-label="Breadcrumb" style="font-size:0.8125rem;margin-bottom:0.75rem;"><ol style="display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;list-style:none;padding:0;">${crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<li aria-current="page" style="color:var(--text-secondary);font-weight:600;">${escapeHtml(c.name)}</li>`
        : `<li><a href="${path(c.url)}" style="color:var(--text-tertiary);">${escapeHtml(c.name)}</a> <span style="opacity:0.6;">›</span></li>`
    )
    .join('')}</ol></nav>`;
}

function buildToolBody({ tool, content, faqItems, related, breadcrumbs }) {
  const name = escapeHtml(tool.name);
  const linkedDescription = content?.longDescription
    ? withSiblingLinks(
        content.longDescription,
        (related || []).slice(0, 2).map((item) => ({
          name: item.name,
          href: `/tools/${item.category}/${item.slug}`,
        })),
      )
    : '';
  const parts = [
    breadcrumbNav(breadcrumbs),
    `<header><h1>${name}</h1><p class="docs-p">${escapeHtml(tool.description)}</p></header>`,
  ];

  if (linkedDescription) {
    parts.push(
      `<section><h2 class="docs-h2">What is ${name}?</h2><p class="docs-p">${richToHtml(linkedDescription)}</p></section>`
    );
  }

  if (content?.howToSteps && content.howToSteps.length > 0) {
    parts.push(
      `<section><h2 class="docs-h2">How to Use ${name} Online (Step-by-Step Guide)</h2><ol class="docs-list" style="list-style:decimal;padding-left:1.5rem;">${content.howToSteps
        .map((s) => `<li style="margin-bottom:0.5rem;">${escapeHtml(s)}</li>`)
        .join('')}</ol></section>`
    );
  }

  if (content?.example) {
    const ex = content.example;
    parts.push(
      `<section><h2 class="docs-h2">Code Example: Before &amp; After</h2>` +
        `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">` +
        `<figure class="min-w-0"><figcaption class="docs-caption">Input${ex.inputLabel ? ` — ${escapeHtml(ex.inputLabel)}` : ''}</figcaption><pre class="docs-pre"><code>${highlightHtml(ex.input)}</code></pre></figure>` +
        `<figure class="min-w-0"><figcaption class="docs-caption">Output</figcaption><pre class="docs-pre"><code>${highlightHtml(ex.output)}</code></pre></figure>` +
        `</div></section>`
    );
  }

  if (content?.features && content.features.length > 0) {
    parts.push(
      `<section><h2 class="docs-h2">Key Features &amp; Capabilities</h2><ul class="docs-list">${content.features
        .map((f) => `<li>${escapeHtml(f)}</li>`)
        .join('')}</ul></section>`
    );
  }

  if (content?.useCases && content.useCases.length > 0) {
    parts.push(
      `<section><h2 class="docs-h2">Real-World Use Cases &amp; Examples</h2><ul class="docs-list">${content.useCases
        .map((u) => `<li>${escapeHtml(u)}</li>`)
        .join('')}</ul></section>`
    );
  }

  parts.push(
    `<section class="docs-card" style="margin-top:1rem;"><h2 class="docs-h2" style="margin-bottom:0.25rem;">100% Client-Side Privacy &amp; Security</h2><p class="docs-p">Processing runs in your browser only — input is never uploaded to a server.</p></section>`
  );

  parts.push(
    `<section><h2 class="docs-h2">Frequently Asked Questions (FAQ)</h2><dl>${faqItems
      .map((f) => `<dt style="font-weight:600;margin-top:0.75rem;">${escapeHtml(f.question)}</dt><dd class="docs-p" style="margin-bottom:0.75rem;">${escapeHtml(f.answer)}</dd>`)
      .join('')}</dl></section>`
  );

  if (related && related.length > 0) {
    parts.push(
      `<nav aria-label="Related developer tools"><h2 class="docs-h2">Related Developer Tools</h2><ul class="docs-list">${related
        .map((r) => `<li><a href="/tools/${r.category}/${r.slug}" style="font-weight:600;color:var(--color-brand-400);">${escapeHtml(r.name)}</a> — ${escapeHtml(r.description)}</li>`)
        .join('')}</ul></nav>`
    );
  }

  return `<div class="prerender-shell">${parts.join('')}</div>`;
}

// ─── Page Meta Injection ────────────────────────────────────────────────────

function injectPageMeta(html, { title, description, path, name, breadcrumbs, noindex, faqJsonLd, howToJsonLd, bodyHtml, keywords, featureList, subCategory }) {
  const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  let next = html;

  next = replaceAttr(next, /<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`);
  next = replaceAttr(
    next,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${safeDesc}" />`
  );
  next = replaceAttr(
    next,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`
  );
  next = replaceAttr(
    next,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${url}" />`
  );
  next = replaceAttr(
    next,
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  next = replaceAttr(
    next,
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  next = replaceAttr(
    next,
    /<meta name="twitter:url" content="[^"]*" \/>/,
    `<meta name="twitter:url" content="${url}" />`
  );
  next = replaceAttr(
    next,
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  next = replaceAttr(
    next,
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );

  if (keywords) {
    next = replaceAttr(
      next,
      /<meta name="keywords" content="[^"]*" \/>/,
      `<meta name="keywords" content="${escapeHtml(keywords)}" />`
    );
  }

  if (noindex) {
    next = replaceAttr(
      next,
      /<meta name="robots" content="[^"]*" \/>/,
      '<meta name="robots" content="noindex, follow" />'
    );
    next = replaceAttr(
      next,
      /<meta name="googlebot" content="[^"]*" \/>/,
      '<meta name="googlebot" content="noindex, follow" />'
    );
  }

  // Update SoftwareApplication JSON-LD for tool pages
  const isToolPage = /^\/tools\/[^/]+\/[^/]+$/.test(path);
  if (isToolPage && !noindex) {
    next = next.replace(
      /(<script type="application\/ld\+json">\s*\{[^}]*"@type":\s*"WebApplication"[\s\S]*?)<\/script>/,
      () => {
        const appSchema = {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: `${name} — ${SITE_NAME}`,
          url,
          image: `${SITE_URL}/og-image.png`,
          description,
          applicationCategory: 'DeveloperApplication',
          applicationSubCategory: subCategory,
          operatingSystem: 'Any',
          featureList: featureList ?? [],
          browserRequirements: 'Requires a modern web browser with JavaScript enabled',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          isAccessibleForFree: true,
          inLanguage: 'en',
        };
        return `<script type="application/ld+json">${JSON.stringify(appSchema)}</script>`;
      }
    );
  } else if (path !== '/' && !noindex) {
    next = next.replace(
      /(<script type="application\/ld\+json">\s*)(\{[^}]*"@type":\s*"WebApplication"[\s\S]*?)(<\/script>)/,
      (_whole, open, json) => {
        try {
          const data = JSON.parse(json);
          data.url = url;
          data.name = `${name} — ${SITE_NAME}`;
          data.description = description;
          return `${open}${JSON.stringify(data)}</script>`;
        } catch {
          return _whole;
        }
      }
    );
  }

  // Inject BreadcrumbList, FAQPage, and HowTo JSON-LD
  let structuredData = '';
  if (breadcrumbs && breadcrumbs.length > 1) {
    structuredData += `\n    <script type="application/ld+json" id="seo-breadcrumb">${buildBreadcrumbJsonLd(breadcrumbs)}</script>`;
  }
  if (faqJsonLd) {
    structuredData += `\n    <script type="application/ld+json" id="seo-faq">${faqJsonLd}</script>`;
  }
  if (howToJsonLd) {
    structuredData += `\n    <script type="application/ld+json" id="seo-howto">${howToJsonLd}</script>`;
  }

  const staticBody =
    bodyHtml ?? `<div class="prerender-shell"><h1>${escapeHtml(name)}</h1><p class="docs-p">${safeDesc}</p></div>`;

  next = next.replace(
    '<div id="root"></div>',
    `${structuredData ? structuredData : ''}
    <div id="root">${staticBody}</div>`
  );
  return next;
}

function buildSitemap(tools, categories) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
    ...categories.map((id) => ({
      loc: `${SITE_URL}/tools/${id}`,
      changefreq: 'monthly',
      priority: '0.6',
    })),
    ...tools.map((tool) => ({
      loc: `${SITE_URL}/tools/${tool.category}/${tool.slug}`,
      changefreq: 'monthly',
      priority: HIGH_PRIORITY.has(tool.id) ? '0.9' : '0.8',
    })),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function writeFile(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

// ─── Execution ──────────────────────────────────────────────────────────────

const tools = extractTools();
if (tools.length === 0) {
  throw new Error('SEO prerender: no tools discovered under src/tools');
}
const toolsMap = new Map(tools.map((t) => [t.id, t]));

const faqCopy = extractI18nFaqCopy();
const categories = [...new Set(tools.map((t) => t.category))].sort();
const sitemap = buildSitemap(tools, categories);
writeFile(join(root, 'public/sitemap.xml'), sitemap);

const distHtmlPath = join(root, 'dist/index.html');
let template;
try {
  template = readFileSync(distHtmlPath, 'utf8');
} catch {
  console.log(`SEO: wrote public/sitemap.xml (${tools.length} tools). Run after vite build to prerender HTML.`);
  process.exit(0);
}

writeFile(join(root, 'dist/sitemap.xml'), sitemap);

const HOME_TITLE = `${SITE_NAME} — Free Online Developer Tools`;
const HOME_DESCRIPTION =
  'Free online developer toolkit — JSON formatter, SQL formatter, Base64 encoder, GUID generator, diff compare & 35+ tools. 100% client-side, your data never leaves your browser.';

// Home page static body
const homeBody = `<div class="prerender-shell">
  <header>
    <h1>${escapeHtml(HOME_TITLE)}</h1>
    <p class="docs-p">${escapeHtml(HOME_DESCRIPTION)}</p>
  </header>
  <nav aria-label="Categories">
    <h2 class="docs-h2">Tool Categories</h2>
    <ul class="docs-list" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0.75rem;">
      ${categories
        .map((id) => {
          const meta = CATEGORY_META[id] || { name: id, description: '' };
          return `<li class="docs-card"><a href="/tools/${id}" style="font-weight:600;color:var(--color-brand-400);">${escapeHtml(meta.name)} Tools</a><p class="docs-p" style="font-size:0.8125rem;margin-top:0.25rem;">${escapeHtml(meta.description)}</p></li>`;
        })
        .join('')}
    </ul>
  </nav>
  <nav aria-label="Popular developer tools">
    <h2 class="docs-h2">Popular Developer Tools</h2>
    <ul class="docs-list">
      ${tools
        .filter((t) => HIGH_PRIORITY.has(t.id))
        .map((t) => `<li><a href="/tools/${t.category}/${t.slug}" style="font-weight:600;color:var(--color-brand-400);">${escapeHtml(t.name)}</a> — ${escapeHtml(t.description)}</li>`)
        .join('')}
    </ul>
  </nav>
</div>`;

writeFile(
  distHtmlPath,
  injectPageMeta(template, {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: '/',
    name: SITE_NAME,
    bodyHtml: homeBody,
  })
);

writeFile(
  join(root, 'dist/404.html'),
  injectPageMeta(template, {
    title: `Page not found — ${SITE_NAME}`,
    description: 'This tool or category does not exist. Choose a tool from the sidebar or go back home.',
    path: '/404',
    name: 'Page not found',
    noindex: true,
    bodyHtml: `<div class="prerender-shell"><h1>Page not found</h1><p class="docs-p">This tool or category does not exist. <a href="/">Go to ${escapeHtml(SITE_NAME)} home</a></p></div>`,
  })
);

for (const category of categories) {
  const catMeta = CATEGORY_META[category] || { name: category, description: '' };
  const catTools = tools.filter((t) => t.category === category);
  const title = `${catMeta.name} Tools — Free Online Developer Toolkit | ${SITE_NAME}`;
  const description = `${catMeta.description}. Free online, fast & 100% client-side on ${SITE_NAME}.`;

  const catBreadcrumbs = [
    { name: SITE_NAME, url: `${SITE_URL}/` },
    { name: catMeta.name, url: `${SITE_URL}/tools/${category}` },
  ];

  const catBody = `<div class="prerender-shell">
    ${breadcrumbNav(catBreadcrumbs)}
    <header>
      <h1>${escapeHtml(catMeta.name)} Tools</h1>
      <p class="docs-p">${escapeHtml(description)}</p>
    </header>
    <nav aria-label="${escapeHtml(catMeta.name)} tools">
      <ul class="docs-list" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:0.75rem;">
        ${catTools
          .map((t) => `<li class="docs-card"><a href="/tools/${t.category}/${t.slug}" style="font-weight:600;color:var(--color-brand-400);">${escapeHtml(t.name)}</a><p class="docs-p" style="font-size:0.8125rem;margin-top:0.25rem;">${escapeHtml(t.description)}</p></li>`)
          .join('')}
      </ul>
    </nav>
  </div>`;

  writeFile(
    join(root, `dist/tools/${category}/index.html`),
    injectPageMeta(template, {
      title,
      description,
      path: `/tools/${category}`,
      name: `${catMeta.name} Tools`,
      keywords: catMeta.keywords,
      breadcrumbs: catBreadcrumbs,
      bodyHtml: catBody,
    })
  );

  for (const tool of catTools) {
    const title = toolPageTitle(tool.name, tool.id);
    const description = toolPageDescription(tool.description, tool.id);
    const content = toolContent[tool.id];

    // Tool keywords: tool name + category keywords
    const toolKeywords = `${tool.name.toLowerCase()}, ${tool.name.toLowerCase()} online, free ${tool.name.toLowerCase()}, ${catMeta.keywords || ''}`;

    // Tool FAQ items & JSON-LD
    const faqItems = buildToolFaqItems(tool.name, faqCopy, tool.faq);
    const toolFaqJsonLd = buildFaqJsonLd(faqItems);

    // HowTo JSON-LD
    const toolHowToJsonLd = content?.howToSteps ? buildHowToJsonLd(tool.name, content.howToSteps) : undefined;

    const toolBreadcrumbs = [
      { name: SITE_NAME, url: `${SITE_URL}/` },
      { name: catMeta.name, url: `${SITE_URL}/tools/${tool.category}` },
      { name: tool.name, url: `${SITE_URL}/tools/${tool.category}/${tool.slug}` },
    ];

    const related = (tool.relatedToolIds || [])
      .map((relId) => toolsMap.get(relId))
      .filter(Boolean);

    const toolBodyHtml = buildToolBody({
      tool,
      content,
      faqItems,
      related,
      breadcrumbs: toolBreadcrumbs,
    });

    writeFile(
      join(root, `dist/tools/${tool.category}/${tool.slug}/index.html`),
      injectPageMeta(template, {
        title,
        description,
        path: `/tools/${tool.category}/${tool.slug}`,
        name: tool.name,
        keywords: toolKeywords,
        breadcrumbs: toolBreadcrumbs,
        faqJsonLd: toolFaqJsonLd,
        howToJsonLd: toolHowToJsonLd,
        bodyHtml: toolBodyHtml,
        featureList: content?.features,
        subCategory: catMeta.name,
      })
    );
  }
}

console.log(
  `SEO: sitemap + prerendered ${categories.length} categories and ${tools.length} tool pages with visible semantic HTML and structured data.`
);
