import React from 'react';
import type { ToolDefinition } from '@/types/tool';
import { Faq } from '@/components/Faq/Faq';
import { RelatedTools } from './RelatedTools';

interface ToolAboutProps {
  tool: ToolDefinition;
  name: string;
  faq?: { q: string; a: string }[];
}

export const ToolAbout: React.FC<ToolAboutProps> = ({ tool, name, faq }) => {
  const contentId = `tool-about-content-${tool.id}`;

  return (
    <details
      className="group rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)]/40 mt-2 transition-colors"
    >
      <summary
        className="flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] select-none [&::-webkit-details-marker]:hidden list-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-brand-500)] rounded transition-colors"
        aria-controls={contentId}
      >
        <span
          className="shrink-0 text-[var(--text-tertiary)] transition-transform group-open:rotate-90 text-[10px]"
          aria-hidden="true"
        >
          ▸
        </span>
        <span>About this tool</span>
      </summary>

      <div
        id={contentId}
        className="px-3 pt-2.5 pb-3 border-t border-[var(--border-subtle)] space-y-3"
      >
        {/* Extended Semantic SEO Content */}
        {tool.longDescription && (
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-primary)] mb-1">What is {name}?</h2>
            <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">{tool.longDescription}</p>
          </div>
        )}

        {tool.howToUse && (
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-primary)] mb-1">How to use {name}</h2>
            <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">{tool.howToUse}</p>
          </div>
        )}

        {tool.features && tool.features.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-primary)] mb-1">Features</h2>
            <ul className="list-disc pl-4 text-[11px] leading-relaxed text-[var(--text-secondary)] space-y-0.5">
              {tool.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {tool.useCases && tool.useCases.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-primary)] mb-1">Use Cases</h2>
            <ul className="list-disc pl-4 text-[11px] leading-relaxed text-[var(--text-secondary)] space-y-0.5">
              {tool.useCases.map((useCase, idx) => (
                <li key={idx}>{useCase}</li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQ */}
        <Faq 
          toolName={name} 
          extraItems={faq?.map(f => ({ question: f.q, answer: f.a }))} 
        />

        {/* Related Tools */}
        {tool.relatedToolIds && (
          <RelatedTools 
            relatedToolIds={tool.relatedToolIds} 
            categoryId={tool.category} 
          />
        )}
      </div>
    </details>
  );
};
