import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { getToolById } from '@/registry/toolRegistry';
import { getCategoryById } from '@/registry/categoryRegistry';
import { useLocale } from '@/hooks/useLocale';
import { SITE_NAME } from '@/seo/site';
import { DOCS_SECTION_ID } from './ToolDocs';

interface ToolSeoProps {
  toolId: string;
  name: string;
  description: string;
}

export const ToolSeo: React.FC<ToolSeoProps> = ({ toolId, name, description }) => {
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
      <p className="max-w-3xl min-w-0 text-xs leading-relaxed text-[var(--text-secondary)] mb-1.5">
        {description}
      </p>

      {/* Jump to the below-the-fold guide (keeps the editor area full size) */}
      <a
        href={`#${DOCS_SECTION_ID}`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(DOCS_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-brand-400)] hover:text-[var(--color-brand-300)] transition-colors"
      >
        <BookOpen size={12} aria-hidden="true" />
        Guide, examples &amp; FAQ ↓
      </a>
    </section>
  );
};
