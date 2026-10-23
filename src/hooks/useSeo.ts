import { useEffect } from 'react';
import {
  absoluteUrl,
  INDEXABLE_ROBOTS,
  NOINDEX_ROBOTS,
  SITE_NAME,
} from '@/seo/site';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CategoryToolItem {
  name: string;
  url: string;
  description: string;
}

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  faqItems?: FaqItem[];
  toolName?: string;
  howToSteps?: string[];
  /** When set, the page is a tool and emits SoftwareApplication. */
  featureList?: string[];
  applicationSubCategory?: string;
  schemaName?: string;
  /** When set, the page is a category hub and emits CollectionPage + ItemList. */
  categoryTools?: CategoryToolItem[];
}

function setMeta(attr: 'name' | 'property', key: string, value: string): void {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setCanonical(href: string): void {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

function findAppScript(): HTMLScriptElement {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[type="application/ld+json"]:not([id])'
  );
  for (const candidate of scripts) {
    const text = candidate.textContent ?? '';
    if (
      text.includes('"WebApplication"') ||
      text.includes('"SoftwareApplication"') ||
      text.includes('"CollectionPage"')
    ) {
      return candidate;
    }
  }
  const created = document.createElement('script');
  created.type = 'application/ld+json';
  document.head.appendChild(created);
  return created;
}

function updateAppJsonLd(options: {
  url: string;
  name: string;
  description: string;
  toolPage: boolean;
  features?: string[];
  subCategory?: string;
  categoryTools?: CategoryToolItem[];
}): void {
  const script = findAppScript();
  const displayName = options.name === SITE_NAME ? SITE_NAME : `${options.name} — ${SITE_NAME}`;

  if (options.toolPage) {
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: displayName,
      url: options.url,
      image: absoluteUrl('/og-image.png'),
      description: options.description,
      applicationCategory: 'DeveloperApplication',
      applicationSubCategory: options.subCategory,
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript. Processing stays in the browser.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      isAccessibleForFree: true,
      featureList: options.features ?? [],
      inLanguage: 'en',
    });
    return;
  }

  if (options.categoryTools && options.categoryTools.length > 0) {
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: displayName,
      url: options.url,
      description: options.description,
      inLanguage: 'en',
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: absoluteUrl('/'),
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: options.categoryTools.length,
        itemListElement: options.categoryTools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.name,
          url: tool.url,
          description: tool.description,
        })),
      },
    });
    return;
  }

  try {
    const data = JSON.parse(script.textContent || '{}') as Record<string, unknown>;
    if (data['@type'] !== 'WebApplication') {
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: displayName,
        url: options.url,
        image: absoluteUrl('/og-image.png'),
        description: options.description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        isAccessibleForFree: true,
      });
      return;
    }
    data.url = options.url;
    data.name = displayName;
    data.description = options.description;
    script.textContent = JSON.stringify(data);
  } catch {
    /* keep existing JSON-LD if parse fails */
  }
}

function updateBreadcrumbJsonLd(breadcrumbs?: BreadcrumbItem[]): void {
  const id = 'seo-breadcrumb';
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!breadcrumbs || breadcrumbs.length <= 1) {
    script?.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };

  script.textContent = JSON.stringify(data);
}

function updateFaqJsonLd(faqItems?: FaqItem[]): void {
  const id = 'seo-faq';
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!faqItems || faqItems.length === 0) {
    script?.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  script.textContent = JSON.stringify(data);
}

function updateHowToJsonLd(toolName?: string, steps?: string[]): void {
  const id = 'seo-howto';
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!steps || steps.length === 0 || !toolName) {
    script?.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use ${toolName} Online (Step-by-Step Guide)`,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Step ${index + 1}`,
      text: step,
    })),
  };

  script.textContent = JSON.stringify(data);
}

/**
 * Keeps title, description, canonical, social tags, lang attribute,
 * BreadcrumbList, FAQPage, and HowTo structured data in sync with the current route.
 */
export function useSeo({
  title,
  description,
  path,
  noindex = false,
  breadcrumbs,
  faqItems,
  toolName,
  howToSteps,
  featureList,
  applicationSubCategory,
  schemaName,
  categoryTools,
}: SeoOptions): void {
  useEffect(() => {
    const url = absoluteUrl(path);

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? NOINDEX_ROBOTS : INDEXABLE_ROBOTS);
    setMeta('name', 'googlebot', noindex ? NOINDEX_ROBOTS : 'index, follow');
    setCanonical(url);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image:alt', title);

    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:url', url);
    setMeta('name', 'twitter:image:alt', title);

    updateAppJsonLd({
      url,
      name: schemaName ?? title.split(' — ')[0] ?? title,
      description,
      toolPage: Boolean(toolName),
      features: featureList,
      subCategory: applicationSubCategory,
      categoryTools,
    });

    // BreadcrumbList JSON-LD
    updateBreadcrumbJsonLd(breadcrumbs);

    // FAQPage JSON-LD
    updateFaqJsonLd(faqItems);

    // HowTo JSON-LD
    updateHowToJsonLd(toolName, howToSteps);
  }, [title, description, path, noindex, breadcrumbs, faqItems, toolName, howToSteps, featureList, applicationSubCategory, schemaName, categoryTools]);
}
