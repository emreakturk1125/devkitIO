import React from 'react';
import { getAllTools, getCategoriesWithTools } from '@/registry/toolRegistry';
import { homeAboutParagraphs, homeFaq } from '@/seo/homeContent';

/** Below-the-fold home copy; mirrors the block emitted by `scripts/prerender-seo.mjs`. */
export const HomeDocs: React.FC = () => {
  const paragraphs = homeAboutParagraphs(getAllTools().length, getCategoriesWithTools().length);

  return (
    <article
      aria-label="About DevKit"
      className="tool-docs border-t border-[var(--border-subtle)] bg-[var(--bg-panel)]/40"
    >
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14 space-y-10">
        <section aria-labelledby="home-about">
          <h2 id="home-about" className="docs-h2">What is DevKit?</h2>
          <div className="space-y-3">
            {paragraphs.map((text) => (
              <p key={text} className="docs-p">{text}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="home-faq">
          <h2 id="home-faq" className="docs-h2">Frequently Asked Questions (FAQ)</h2>
          <dl className="space-y-2">
            {homeFaq.map((item) => (
              <div key={item.q} className="docs-card">
                <dt className="text-sm font-semibold text-[var(--text-primary)]">{item.q}</dt>
                <dd className="docs-p mt-1">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
};
