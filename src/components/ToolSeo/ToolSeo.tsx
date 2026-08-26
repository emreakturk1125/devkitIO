import React from 'react';
import { useLocale } from '@/hooks/useLocale';

interface ToolSeoProps {
  toolId: string;
  name: string;
  description: string;
}

export const ToolSeo: React.FC<ToolSeoProps> = ({ toolId, name, description }) => {
  const { t, format } = useLocale();

  const faqs = [
    { q: format(t.faqFree, { name }), a: format(t.faqFreeAnswer, { name }) },
    { q: t.faqPrivacy, a: t.faqPrivacyAnswer },
    { q: t.faqInstall, a: t.faqInstallAnswer },
  ];

  return (
    <section className="space-y-2" aria-labelledby={`tool-heading-${toolId}`}>
      <h1
        id={`tool-heading-${toolId}`}
        className="text-base font-semibold text-[var(--text-primary)] sm:text-lg"
      >
        {name}
      </h1>
      <p className="min-w-0 text-sm leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>
      <p className="min-w-0 text-sm leading-relaxed text-[var(--text-secondary)]">
        {t.privacyNote}
      </p>
      <details className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2">
        <summary className="cursor-pointer text-sm font-medium text-[var(--text-secondary)]">
          {t.faq}
        </summary>
        <dl className="mt-2 space-y-2 text-sm text-[var(--text-tertiary)]">
          {faqs.map((item) => (
            <div key={item.q}>
              <dt className="font-medium text-[var(--text-secondary)]">{item.q}</dt>
              <dd className="mt-0.5">{item.a}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
};
