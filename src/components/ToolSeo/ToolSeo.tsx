import React from 'react';

interface ToolSeoProps {
  toolId: string;
  name: string;
  description: string;
}

export const ToolSeo: React.FC<ToolSeoProps> = ({ toolId, name, description }) => {
  return (
    <section className="space-y-1" aria-labelledby={`tool-heading-${toolId}`}>
      <h1
        id={`tool-heading-${toolId}`}
        className="text-base font-semibold text-[var(--text-primary)] sm:text-lg"
      >
        {name}
      </h1>
      <p className="min-w-0 text-sm leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>
    </section>
  );
};
