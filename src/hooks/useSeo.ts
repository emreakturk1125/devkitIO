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

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  locale?: string;
  breadcrumbs?: BreadcrumbItem[];
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

function updateJsonLd(url: string, name: string, description: string): void {
  // Find the WebApplication JSON-LD script (not the WebSite or id'd ones)
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[type="application/ld+json"]:not([id])'
  );
  let script: HTMLScriptElement | null = null;
  for (const s of scripts) {
    if (s.textContent?.includes('"WebApplication"')) {
      script = s;
      break;
    }
  }
  if (!script?.textContent) return;
  try {
    const data = JSON.parse(script.textContent) as Record<string, unknown>;
    data.url = url;
    data.name = name === SITE_NAME ? SITE_NAME : `${name} — ${SITE_NAME}`;
    data.description = description;
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

/**
 * Keeps title, description, canonical, social tags, lang attribute
 * and BreadcrumbList structured data in sync with the current route.
 */
export function useSeo({
  title,
  description,
  path,
  noindex = false,
  locale,
  breadcrumbs,
}: SeoOptions): void {
  useEffect(() => {
    const url = absoluteUrl(path);

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? NOINDEX_ROBOTS : INDEXABLE_ROBOTS);
    setCanonical(url);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);

    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:url', url);

    updateJsonLd(url, title.split(' — ')[0] ?? title, description);

    // Dynamic HTML lang attribute
    if (locale) {
      document.documentElement.lang = locale;
    }

    // BreadcrumbList JSON-LD
    updateBreadcrumbJsonLd(breadcrumbs);
  }, [title, description, path, noindex, locale, breadcrumbs]);
}
