import React from 'react';
import { Link } from 'react-router-dom';
import { ToolAbout } from './ToolAbout';
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
      <p className="max-w-3xl min-w-0 text-xs leading-relaxed text-[var(--text-secondary)] mb-2">
        {description}
      </p>

      {/* Extended Semantic SEO Content in Collapsible Accordion */}
      {tool && (
        <ToolAbout
          key={tool.id}
          tool={tool}
          name={name}
          faq={faq}
        />
      )}
    </section>
  );
};
