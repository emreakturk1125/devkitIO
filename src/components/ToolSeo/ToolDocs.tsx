import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import type { ToolDefinition } from '@/types/tool';
import { Faq } from '@/components/Faq/Faq';
import { RelatedTools } from './RelatedTools';
import { getToolContent } from '@/seo/toolContent';
import { useLocale } from '@/hooks/useLocale';
import { getToolById } from '@/registry/toolRegistry';
import { toolPath } from '@/seo/site';
import { parseRichText, withSiblingLinks } from '@/seo/richText';
import { tokenizeCode } from '@/seo/highlight';

interface ToolDocsProps {
  tool: ToolDefinition;
  name: string;
  faq?: { q: string; a: string }[];
  onLoadSample?: () => void;
}

export const DOCS_SECTION_ID = 'docs';

/**
 * Below-the-fold documentation for a tool page.
 * Rendered after the editor so the workspace keeps its full height,
 * while search engines and curious users get a complete guide.
 */
function RichText({ text }: { text: string }) {
  const parts = parseRichText(text);
  return (
    <>
      {parts.map((part, index) =>
        part.kind === 'link' && part.href ? (
          <Link key={index} to={part.href} className="font-medium text-[var(--color-brand-400)] hover:underline">
            {part.text}
          </Link>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}

function CodeSample({ code }: { code: string }) {
  return (
    <code>
      {tokenizeCode(code).map((token, index) =>
        token.kind === 'text' ? (
          token.text
        ) : (
          <span key={index} className={`tok-${token.kind}`}>{token.text}</span>
        ),
      )}
    </code>
  );
}

export const ToolDocs: React.FC<ToolDocsProps> = ({ tool, name, faq, onLoadSample }) => {
  const { t, toolName } = useLocale();
  const content = getToolContent(tool.id);
  const related = (tool.relatedToolIds ?? [])
    .map((id) => getToolById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 2)
    .map((item) => ({
      name: toolName(item.id, item.name),
      href: toolPath(item.category, item.id),
    }));
  const description = content
    ? withSiblingLinks(content.longDescription, related)
    : '';

  return (
    <article
      id={DOCS_SECTION_ID}
      aria-label={`${name} guide`}
      className="tool-docs border-t border-[var(--border-subtle)] bg-[var(--bg-panel)]/40 scroll-mt-4"
    >
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14 space-y-10">
        {content?.longDescription && (
          <section aria-labelledby="docs-what">
            <h2 id="docs-what" className="docs-h2">What is {name}?</h2>
            <p className="docs-p"><RichText text={description} /></p>
          </section>
        )}

        {content?.howToSteps && content.howToSteps.length > 0 && (
          <section aria-labelledby="docs-how">
            <h2 id="docs-how" className="docs-h2">How to Use {name} Online (Step-by-Step Guide)</h2>
            <ol className="grid gap-3 sm:grid-cols-3">
              {content.howToSteps.map((step, idx) => (
                <li key={idx} className="docs-card flex gap-3">
                  <span className="docs-step" aria-hidden="true">{idx + 1}</span>
                  <span className="text-sm leading-relaxed text-[var(--text-secondary)]">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {content?.example && (
          <section aria-labelledby="docs-example">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 id="docs-example" className="docs-h2 !mb-0">Code Example: Before &amp; After</h2>
              {onLoadSample && tool.requiresInput !== false && (
                <button
                  type="button"
                  onClick={() => {
                    onLoadSample();
                    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-ghost !py-1 !px-2.5 !text-xs text-[var(--color-brand-400)] hover:text-[var(--color-brand-300)]"
                >
                  <Sparkles size={13} aria-hidden="true" />
                  <span>{t.tryInEditor}</span>
                </button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <figure className="min-w-0">
                <figcaption className="docs-caption">
                  Input{content.example.inputLabel ? ` — ${content.example.inputLabel}` : ''}
                </figcaption>
                <pre className="docs-pre"><CodeSample code={content.example.input} /></pre>
              </figure>
              <figure className="min-w-0">
                <figcaption className="docs-caption flex items-center gap-1">
                  <ArrowRight size={12} aria-hidden="true" /> {content.example.outputLabel ?? 'Output'}
                </figcaption>
                <pre className="docs-pre"><CodeSample code={content.example.output} /></pre>
              </figure>
            </div>
          </section>
        )}

        {(content?.features?.length || content?.useCases?.length) ? (
          <div className="grid gap-8 md:grid-cols-2">
            {content?.features && content.features.length > 0 && (
              <section aria-labelledby="docs-features">
                <h2 id="docs-features" className="docs-h2">Key Features &amp; Capabilities</h2>
                <ul className="docs-list">
                  {content.features.map((f, idx) => <li key={idx}>{f}</li>)}
                </ul>
              </section>
            )}
            {content?.useCases && content.useCases.length > 0 && (
              <section aria-labelledby="docs-usecases">
                <h2 id="docs-usecases" className="docs-h2">Real-World Use Cases &amp; Examples</h2>
                <ul className="docs-list">
                  {content.useCases.map((u, idx) => <li key={idx}>{u}</li>)}
                </ul>
              </section>
            )}
          </div>
        ) : null}

        <section aria-labelledby="docs-privacy" className="docs-card flex gap-3 items-start">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--color-success)] mt-0.5" aria-hidden="true" />
          <div>
            <h2 id="docs-privacy" className="docs-h2 !mb-1">
              100% Client-Side Privacy &amp; Security
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{t.privacyNote}</p>
          </div>
        </section>

        <section aria-labelledby="docs-faq">
          <h2 id="docs-faq" className="docs-h2">Frequently Asked Questions (FAQ)</h2>
          <Faq hideHeading toolName={name} extraItems={(faq ?? []).map((f) => ({ question: f.q, answer: f.a }))} />
        </section>

        <RelatedTools relatedToolIds={tool.relatedToolIds} categoryId={tool.category} />
      </div>
    </article>
  );
};
