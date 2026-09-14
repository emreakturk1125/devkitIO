import React from 'react';
import { Link } from 'react-router-dom';
import { getToolById } from '@/registry/toolRegistry';
import { useLocale } from '@/hooks/useLocale';

interface RelatedToolsProps {
  relatedToolIds?: string[];
  categoryId: string;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ relatedToolIds }) => {
  const { toolName, toolDescription } = useLocale();

  if (!relatedToolIds || relatedToolIds.length === 0) return null;

  const tools = relatedToolIds
    .map(id => getToolById(id))
    .filter(Boolean);

  if (tools.length === 0) return null;

  return (
    <section className="mt-4" aria-labelledby="related-tools-heading">
      <h2
        id="related-tools-heading"
        className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2"
      >
        Related Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tools.map(tool => (
          <Link
            key={tool!.id}
            to={`/tools/${tool!.category}/${tool!.id}`}
            className="flex flex-col p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors min-w-0"
          >
            <span className="text-xs font-semibold text-[var(--color-brand-500)] mb-1 truncate">
              {toolName(tool!.id, tool!.name)}
            </span>
            <span className="text-[11px] text-[var(--text-tertiary)] line-clamp-2">
              {toolDescription(tool!.id, tool!.description)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
