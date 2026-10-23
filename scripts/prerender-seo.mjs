import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://devkitio.com';
const SITE_NAME = 'DevKit';

// Import toolContent and site utilities directly
const { toolContent } = await import('../src/seo/toolContent.ts');
const {
  BASE_DESCRIPTION,
  BASE_TITLE,
  categoryHeading,
  categoryPageDescription,
  categoryPageTitle,
  toolPageDescription,
  toolPageTitle,
  toolPriority,
  toolSlug,
} = await import('../src/seo/site.ts');
const { categories: categoryRegistry } = await import('../src/registry/categoryRegistry.ts');
const { en } = await import('../src/i18n/en.ts');
const { categorySeoContent, homeAboutParagraphs, homeFaq } = await import('../src/seo/homeContent.ts');
const { tokenizeCode } = await import('../src/seo/highlight.ts');
const { parseRichText, withSiblingLinks } = await import('../src/seo/richText.ts');
const { extraToolFaqs } = await import('../src/seo/extraToolFaqs.ts');

function toIsoDate(filePath) {
  try {
    return statSync(filePath).mtime.toISOString().split('T')[0];
  } catch {
    return '2026-10-18';
  }
}

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
        lastmod: toIsoDate(file),
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

function buildStaticFooter(categories, tools, categoryInfo) {
  const groups = categories
    .map((catId) => {
      const catMeta = categoryInfo(catId);
      const catTools = tools.filter((t) => t.category === catId);
      return `<div style="min-width:0;"><a href="/tools/${catId}" style="font-weight:600;color:var(--text-primary);display:block;margin-bottom:0.375rem;">${escapeHtml(catMeta.name)}</a><ul style="list-style:none;padding:0;margin:0;display:grid;gap:0.25rem;font-size:0.8125rem;">${catTools
        .map((t) => `<li><a href="/tools/${t.category}/${t.slug}" style="color:var(--text-secondary);">${escapeHtml(t.name)}</a></li>`)
        .join('')}</ul></div>`;
    })
    .join('');

  return `<footer style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border-subtle);"><nav aria-label="Developer tools directory"><h2 class="docs-h2">All Developer Tools by Category</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1.25rem;">${groups}</div></nav></footer>`;
}

function buildToolBody({ tool, content, faqItems, related, breadcrumbs, footerHtml }) {
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
        `<figure class="min-w-0"><figcaption class="docs-caption">${escapeHtml(ex.outputLabel ?? 'Output')}</figcaption><pre class="docs-pre"><code>${highlightHtml(ex.output)}</code></pre></figure>` +
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

  if (footerHtml) {
    parts.push(footerHtml);
  }

  return `<div class="prerender-shell">${parts.join('')}</div>`;
}

// ─── Page Meta Injection ────────────────────────────────────────────────────

function injectPageMeta(html, { title, description, path, name, breadcrumbs, noindex, faqJsonLd, howToJsonLd, bodyHtml, featureList, subCategory, categoryTools }) {
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
    /<meta property="og:image:alt" content="[^"]*" \/>/,
    `<meta property="og:image:alt" content="${safeTitle}" />`
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
  next = replaceAttr(
    next,
    /<meta name="twitter:image:alt" content="[^"]*" \/>/,
    `<meta name="twitter:image:alt" content="${safeTitle}" />`
  );

  // The template keywords describe the whole site; they are wrong on tool and category pages.
  if (path !== '/') {
    next = replaceAttr(next, /\s*<meta name="keywords" content="[^"]*" \/>/, '');
  }

  // Template JSON-LD (no id): noindex pages carry none; only the home page keeps WebSite.
  next = next.replace(
    /\s*<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    (whole, json) => {
      try {
        const type = JSON.parse(json)['@type'];
        if (noindex) return '';
        if (type === 'WebSite' && path !== '/') return '';
      } catch {
        /* keep unparsable blocks untouched */
      }
      return whole;
    }
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

  // Update SoftwareApplication JSON-LD for tool pages and CollectionPage + ItemList for category pages
  const isToolPage = /^\/tools\/[^/]+\/[^/]+$/.test(path);
  const isCategoryPage = /^\/tools\/[^/]+$/.test(path);
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
  } else if (isCategoryPage && !noindex && categoryTools) {
    next = next.replace(
      /(<script type="application\/ld\+json">\s*\{[^}]*"@type":\s*"WebApplication"[\s\S]*?)<\/script>/,
      () => {
        const collectionSchema = {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${name} — ${SITE_NAME}`,
          url,
          description,
          inLanguage: 'en',
          isPartOf: {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: `${SITE_URL}/`,
          },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: categoryTools.length,
            itemListElement: categoryTools.map((t, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: t.name,
              url: `${SITE_URL}/tools/${t.category}/${t.slug}`,
              description: t.description,
            })),
          },
        };
        return `<script type="application/ld+json">${JSON.stringify(collectionSchema)}</script>`;
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
  const siteLastmod = toIsoDate(join(root, 'src/seo/toolContent.ts'));
  const urls = [
    { loc: `${SITE_URL}/`, lastmod: siteLastmod, changefreq: 'weekly', priority: '1.0' },
    ...categories.map((id) => {
      const catTools = tools.filter((t) => t.category === id);
      const latest = catTools.reduce((max, t) => (t.lastmod > max ? t.lastmod : max), siteLastmod);
      return {
        loc: `${SITE_URL}/tools/${id}`,
        lastmod: latest,
        changefreq: 'monthly',
        priority: '0.7',
      };
    }),
    ...tools.map((tool) => ({
      loc: `${SITE_URL}/tools/${tool.category}/${tool.slug}`,
      lastmod: tool.lastmod > siteLastmod ? tool.lastmod : siteLastmod,
      changefreq: 'monthly',
      priority: toolPriority(tool.id),
    })),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
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

const categoryMetaById = new Map(categoryRegistry.map((c) => [c.id, c]));
const categoryInfo = (id) => categoryMetaById.get(id) ?? { name: id, description: '' };
const staticFooterHtml = buildStaticFooter(categories, tools, categoryInfo);

// Home page static body — mirrors HomeSeo + HomeDocs in the React app
const homeFaqItems = homeFaq.map((f) => ({ question: f.q, answer: f.a }));
const homeBody = `<div class="prerender-shell">
  <header>
    <h1>${escapeHtml(en.ui.homeHeading)}</h1>
    <p class="docs-p">${escapeHtml(en.ui.homeIntro)}</p>
  </header>
  <nav aria-label="Categories">
    <h2 class="docs-h2">Tool Categories</h2>
    <ul class="docs-list" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0.75rem;">
      ${categories
        .map((id) => {
          const meta = categoryInfo(id);
          return `<li class="docs-card"><a href="/tools/${id}" style="font-weight:600;color:var(--color-brand-400);">${escapeHtml(meta.name)}</a><p class="docs-p" style="font-size:0.8125rem;margin-top:0.25rem;">${escapeHtml(meta.description)}</p></li>`;
        })
        .join('')}
    </ul>
  </nav>
  <nav aria-label="Popular developer tools">
    <h2 class="docs-h2">Popular Developer Tools</h2>
    <ul class="docs-list">
      ${tools
        .filter((t) => toolPriority(t.id) === '0.9')
        .map((t) => `<li><a href="/tools/${t.category}/${t.slug}" style="font-weight:600;color:var(--color-brand-400);">${escapeHtml(t.name)}</a> — ${escapeHtml(t.description)}</li>`)
        .join('')}
    </ul>
  </nav>
  <section>
    <h2 class="docs-h2">What is ${escapeHtml(SITE_NAME)}?</h2>
    ${homeAboutParagraphs(tools.length, categories.length)
      .map((p) => `<p class="docs-p">${escapeHtml(p)}</p>`)
      .join('')}
  </section>
  <section>
    <h2 class="docs-h2">Frequently Asked Questions (FAQ)</h2>
    <dl>${homeFaqItems
      .map((f) => `<dt style="font-weight:600;margin-top:0.75rem;">${escapeHtml(f.question)}</dt><dd class="docs-p" style="margin-bottom:0.75rem;">${escapeHtml(f.answer)}</dd>`)
      .join('')}</dl>
  </section>
  ${staticFooterHtml}
</div>`;

writeFile(
  distHtmlPath,
  injectPageMeta(template, {
    title: BASE_TITLE,
    description: BASE_DESCRIPTION,
    path: '/',
    name: SITE_NAME,
    faqJsonLd: buildFaqJsonLd(homeFaqItems),
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
  const catMeta = categoryInfo(category);
  const catHeading = categoryHeading(category, catMeta.name);
  const catTools = tools.filter((t) => t.category === category);
  const title = categoryPageTitle(catHeading);
  const description = categoryPageDescription(catMeta.description, category);
  const catSeo = categorySeoContent[category];
  const catFaqItems = (catSeo?.faq ?? []).map((f) => ({ question: f.q, answer: f.a }));

  const catBreadcrumbs = [
    { name: SITE_NAME, url: `${SITE_URL}/` },
    { name: catMeta.name, url: `${SITE_URL}/tools/${category}` },
  ];

  const catOverviewHtml = catSeo?.overview?.length
    ? `<section><h2 class="docs-h2">About ${escapeHtml(catHeading)}</h2>${catSeo.overview
        .map((p) => `<p class="docs-p" style="margin-bottom:0.75rem;">${escapeHtml(p)}</p>`)
        .join('')}</section>`
    : '';

  const catFaqHtml = catFaqItems.length
    ? `<section><h2 class="docs-h2">Frequently Asked Questions (FAQ)</h2><dl>${catFaqItems
        .map(
          (f) =>
            `<dt style="font-weight:600;margin-top:0.75rem;">${escapeHtml(f.question)}</dt><dd class="docs-p" style="margin-bottom:0.75rem;">${escapeHtml(f.answer)}</dd>`
        )
        .join('')}</dl></section>`
    : '';

  const catBody = `<div class="prerender-shell">
    ${breadcrumbNav(catBreadcrumbs)}
    <header>
      <h1>${escapeHtml(catHeading)}</h1>
      <p class="docs-p">${escapeHtml(catMeta.description)}</p>
    </header>
    <nav aria-label="${escapeHtml(catMeta.name)} tools">
      <ul class="docs-list" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:0.75rem;">
        ${catTools
          .map((t) => `<li class="docs-card"><a href="/tools/${t.category}/${t.slug}" style="font-weight:600;color:var(--color-brand-400);">${escapeHtml(t.name)}</a><p class="docs-p" style="font-size:0.8125rem;margin-top:0.25rem;">${escapeHtml(t.description)}</p></li>`)
          .join('')}
      </ul>
    </nav>
    ${catOverviewHtml}
    ${catFaqHtml}
    ${staticFooterHtml}
  </div>`;

  writeFile(
    join(root, `dist/tools/${category}/index.html`),
    injectPageMeta(template, {
      title,
      description,
      path: `/tools/${category}`,
      name: catHeading,
      breadcrumbs: catBreadcrumbs,
      faqJsonLd: catFaqItems.length > 0 ? buildFaqJsonLd(catFaqItems) : undefined,
      bodyHtml: catBody,
      categoryTools: catTools,
    })
  );

  for (const tool of catTools) {
    const title = toolPageTitle(tool.name, tool.id);
    const description = toolPageDescription(tool.description, tool.id);
    const content = toolContent[tool.id];

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
      footerHtml: staticFooterHtml,
    });

    writeFile(
      join(root, `dist/tools/${tool.category}/${tool.slug}/index.html`),
      injectPageMeta(template, {
        title,
        description,
        path: `/tools/${tool.category}/${tool.slug}`,
        name: tool.name,
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
