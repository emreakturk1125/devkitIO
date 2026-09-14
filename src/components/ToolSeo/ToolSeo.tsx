import React from 'react';
import { Link } from 'react-router-dom';
import { Faq } from '@/components/Faq/Faq';
import { RelatedTools } from './RelatedTools';
import { getToolById } from '@/registry/toolRegistry';
import { getCategoryById } from '@/registry/categoryRegistry';
import { useLocale } from '@/hooks/useLocale';
import { SITE_NAME } from '@/seo/site';

interface ToolSeoProps {
  toolId: string;
  name: string;
  description: string;
  faq?: { q: string; a: string }[];
}

export const ToolSeo: React.FC<ToolSeoProps> = ({ toolId, name, description, faq }) => {
  const tool = getToolById(toolId);
  const category = tool ? getCategoryById(tool.category) : undefined;
  const { categoryName } = useLocale();

  return (
    <section aria-labelledby={`tool-heading-${toolId}`}>
      {/* Visual Breadcrumb */}
      {tool && category && (
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex items-center space-x-1 text-[10px] sm:text-[11px] text-[var(--text-tertiary)]">
            <li><Link to="/" className="hover:text-[var(--text-primary)] transition-colors">{SITE_NAME}</Link></li>
            <li><span className="mx-1">›</span></li>
            <li>
              <Link to={`/tools/${category.id}`} className="hover:text-[var(--text-primary)] transition-colors">
                {categoryName(category.id, category.name)}
              </Link>
            </li>
            <li><span className="mx-1">›</span></li>
            <li className="text-[var(--text-secondary)] font-medium" aria-current="page">{name}</li>
          </ol>
        </nav>
      )}

      <h1
        id={`tool-heading-${toolId}`}
        className="text-sm font-semibold text-[var(--text-primary)] sm:text-base mb-0.5"
      >
        {name}
      </h1>
      
      {/* Short Description */}
      <p className="max-w-3xl min-w-0 text-xs leading-relaxed text-[var(--text-secondary)] mb-3">
        {description}
      </p>

      {/* Extended Semantic SEO Content */}
      {tool?.longDescription && (
        <div className="mb-3">
          <h2 className="text-xs font-semibold text-[var(--text-primary)] mb-1">What is {name}?</h2>
          <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">{tool.longDescription}</p>
        </div>
      )}

      {tool?.howToUse && (
        <div className="mb-3">
          <h2 className="text-xs font-semibold text-[var(--text-primary)] mb-1">How to use {name}</h2>
          <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">{tool.howToUse}</p>
        </div>
      )}

      {tool?.features && tool.features.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-semibold text-[var(--text-primary)] mb-1">Features</h2>
          <ul className="list-disc pl-4 text-[11px] leading-relaxed text-[var(--text-secondary)] space-y-0.5">
            {tool.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {tool?.useCases && tool.useCases.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-semibold text-[var(--text-primary)] mb-1">Use Cases</h2>
          <ul className="list-disc pl-4 text-[11px] leading-relaxed text-[var(--text-secondary)] space-y-0.5">
            {tool.useCases.map((useCase, idx) => (
              <li key={idx}>{useCase}</li>
            ))}
          </ul>
        </div>
      )}

      <Faq 
        toolName={name} 
        extraItems={faq?.map(f => ({ question: f.q, answer: f.a }))} 
      />

      {/* Related Tools */}
      {tool?.relatedToolIds && (
        <RelatedTools 
          relatedToolIds={tool.relatedToolIds} 
          categoryId={tool.category} 
        />
      )}
    </section>
  );
};
