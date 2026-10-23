import React from 'react';
import { getCategoryById } from '@/registry/categoryRegistry';
import { useLocale } from '@/hooks/useLocale';
import { categoryHeading } from '@/seo/site';
import { categorySeoContent } from '@/seo/homeContent';
import { ShieldCheck } from 'lucide-react';

interface CategoryDocsProps {
  categoryId: string;
}

/**
 * Below-the-fold documentation and FAQ for a category landing page.
 * Mirrors the static category guide emitted by `scripts/prerender-seo.mjs`.
 */
export const CategoryDocs: React.FC<CategoryDocsProps> = ({ categoryId }) => {
  const { categoryName, t } = useLocale();
  const category = getCategoryById(categoryId);
  const seoContent = categorySeoContent[categoryId];

  if (!category || !seoContent) return null;

  const heading = categoryHeading(categoryId, categoryName(categoryId, category.name));

  return (
    <article
      aria-label={`About ${heading}`}
      className="tool-docs border-t border-[var(--border-subtle)] bg-[var(--bg-panel)]/40"
    >
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14 space-y-10">
        <section aria-labelledby={`category-about-${categoryId}`}>
          <h2 id={`category-about-${categoryId}`} className="docs-h2">
            About {heading}
          </h2>
          <div className="space-y-3">
            {seoContent.overview.map((paragraph, idx) => (
              <p key={idx} className="docs-p">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby={`category-privacy-${categoryId}`} className="docs-card flex gap-3 items-start">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--color-success)] mt-0.5" aria-hidden="true" />
          <div>
            <h2 id={`category-privacy-${categoryId}`} className="docs-h2 !mb-1">
              100% Client-Side Privacy &amp; Security
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{t.privacyNote}</p>
          </div>
        </section>

        {seoContent.faq.length > 0 && (
          <section aria-labelledby={`category-faq-${categoryId}`}>
            <h2 id={`category-faq-${categoryId}`} className="docs-h2">
              Frequently Asked Questions (FAQ)
            </h2>
            <dl className="space-y-2">
              {seoContent.faq.map((item) => (
                <div key={item.q} className="docs-card">
                  <dt className="text-sm font-semibold text-[var(--text-primary)]">{item.q}</dt>
                  <dd className="docs-p mt-1">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </article>
  );
};
