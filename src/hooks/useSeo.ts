import { useEffect } from 'react';
import {
  absoluteUrl,
  INDEXABLE_ROBOTS,
  NOINDEX_ROBOTS,
  SITE_NAME,
} from '@/seo/site';

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
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
  const script = document.querySelector<HTMLScriptElement>(
    'script[type="application/ld+json"]'
  );
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

/**
 * Keeps title, description, canonical and social tags in sync with the current route.
 */
export function useSeo({ title, description, path, noindex = false }: SeoOptions): void {
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
  }, [title, description, path, noindex]);
}
