import React from 'react';
import { Faq } from '@/components/Faq/Faq';

interface ToolSeoProps {
  toolId: string;
  name: string;
  description: string;
}

export const ToolSeo: React.FC<ToolSeoProps> = ({ toolId, name, description }) => {
  return (
    <section aria-labelledby={`tool-heading-${toolId}`}>
      <h1
        id={`tool-heading-${toolId}`}
        className="text-sm font-semibold text-[var(--text-primary)] sm:text-base mb-0.5"
      >
        {name}
      </h1>
      <p className="max-w-3xl min-w-0 text-xs leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>
      <Faq toolName={name} />
    </section>
  );
};
