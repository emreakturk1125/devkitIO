import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://devkitio.com';
const SITE_NAME = 'DevKit';

const HIGH_PRIORITY = new Set([
  'jsonFormatter',
  'jsonToClass',
  'sqlFormatter',
  'base64',
  'guidGenerator',
  'diffCompare',
]);

/** Category display names and descriptions (mirrors categoryRegistry.ts) */
const CATEGORY_META = {
  sql: { name: 'SQL', description: 'SQL formatting, generation and transformation tools' },
  data: { name: 'Data', description: 'JSON, YAML, XML, JavaScript and data conversion tools' },
  text: { name: 'Text', description: 'Text manipulation, sorting and transformation tools' },
  encoding: { name: 'Encoding', description: 'Base64, URL, HTML encoding and decoding tools' },
  generators: { name: 'Generators', description: 'UUID, hash, password and random data generators' },
  debugging: { name: 'Debugging', description: 'Diff, validation and debugging utilities' },
  code: { name: 'Code', description: 'Code formatting and beautification tools' },
  conversion: { name: 'Conversion', description: 'Data format conversion tools' },
  web: { name: 'Web', description: 'URL parsing, cURL conversion and web utilities' },
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

function extractTools() {
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
    if (id && category && name) {
      tools.push({ id, category, name, description: description ?? name });
    }
  }
  return tools.sort((a, b) => a.id.localeCompare(b.id));
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function replaceAttr(html, pattern, value) {
  return html.replace(pattern, value);
}

// ─── BreadcrumbList JSON-LD ─────────────────────────────────────────────────

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

// ─── Page Meta Injection ────────────────────────────────────────────────────

function injectPageMeta(html, { title, description, path, name, breadcrumbs, noindex }) {
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

  // Inject BreadcrumbList JSON-LD
  let structuredData = '';
  if (breadcrumbs && breadcrumbs.length > 1) {
    structuredData += `\n    <script type="application/ld+json" id="seo-breadcrumb">${buildBreadcrumbJsonLd(breadcrumbs)}</script>`;
  }

  const noscript = `<noscript><h1>${escapeHtml(name)}</h1><p>${safeDesc}</p></noscript>`;
  next = next.replace(
    '<div id="root"></div>',
    `${structuredData ? structuredData : ''}
    ${noscript}
    <div id="root"></div>`
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
      loc: `${SITE_URL}/tools/${tool.category}/${tool.id}`,
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

const tools = extractTools();
if (tools.length === 0) {
  throw new Error('SEO prerender: no tools discovered under src/tools');
}

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
  'Free online developer toolkit — JSON formatter, SQL formatter, Base64 encoder, GUID generator, diff compare & 20+ tools. 100% client-side, your data never leaves your browser.';

writeFile(
  distHtmlPath,
  injectPageMeta(template, {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: '/',
    name: SITE_NAME,
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
  })
);

for (const category of categories) {
  const catMeta = CATEGORY_META[category] || { name: category, description: '' };
  const catTools = tools.filter((t) => t.category === category);
  const title = `${catMeta.name} Tools — ${SITE_NAME} | Free Online Developer Tools`;
  const description = `${catMeta.description} — Free online, 100% client-side on ${SITE_NAME}.`;
  writeFile(
    join(root, `dist/tools/${category}/index.html`),
    injectPageMeta(template, {
      title,
      description,
      path: `/tools/${category}`,
      name: `${catMeta.name} Tools`,
      breadcrumbs: [
        { name: SITE_NAME, url: `${SITE_URL}/` },
        { name: catMeta.name, url: `${SITE_URL}/tools/${category}` },
      ],
    })
  );
  for (const tool of catTools) {
    const title = `${tool.name} — ${SITE_NAME} | Free Online Developer Tools`;
    const description = `${tool.description} — Free online tool, 100% client-side. Your data never leaves your browser.`;
    writeFile(
      join(root, `dist/tools/${tool.category}/${tool.id}/index.html`),
      injectPageMeta(template, {
        title,
        description,
        path: `/tools/${tool.category}/${tool.id}`,
        name: tool.name,
        breadcrumbs: [
          { name: SITE_NAME, url: `${SITE_URL}/` },
          { name: catMeta.name, url: `${SITE_URL}/tools/${tool.category}` },
          { name: tool.name, url: `${SITE_URL}/tools/${tool.category}/${tool.id}` },
        ],
      })
    );
  }
}

console.log(
  `SEO: sitemap + prerendered ${categories.length} categories and ${tools.length} tool pages`
);
