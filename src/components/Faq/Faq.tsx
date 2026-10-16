import React from 'react';
import { useLocale } from '@/hooks/useLocale';

interface FaqProps {
  toolName: string;
  extraItems?: { question: string; answer: string }[];
  /** Set when the parent already renders a visible FAQ heading. */
  hideHeading?: boolean;
}

export const Faq: React.FC<FaqProps> = ({ toolName, extraItems = [], hideHeading = false }) => {
  const { t, format } = useLocale();

  const genericItems = [
    {
      question: format(t.faqFree, { name: toolName }),
      answer: format(t.faqFreeAnswer, { name: toolName }),
    },
    {
      question: t.faqPrivacy,
      answer: t.faqPrivacyAnswer,
    },
    {
      question: t.faqInstall,
      answer: t.faqInstallAnswer,
    },
  ];
  const items = (extraItems.length >= 5 ? extraItems : [...extraItems, ...genericItems]).slice(0, 7);

  return (
    <section className="mt-2" aria-labelledby={hideHeading ? undefined : 'faq-heading'}>
      {!hideHeading && (
        <h2
          id="faq-heading"
          className="sr-only"
        >
          {t.faq}
        </h2>
      )}
      <dl className="space-y-2 mt-2">
        {items.map((item, index) => (
          <details
            key={index}
            className="group rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)]"
          >
            <summary className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm font-medium text-[var(--text-primary)] select-none [&::-webkit-details-marker]:hidden list-none">
              <span className="shrink-0 text-[var(--text-tertiary)] transition-transform group-open:rotate-90">
                ▸
              </span>
              <dt className="inline">{item.question}</dt>
            </summary>
            <dd className="px-3 pb-3 pt-0 pl-7 text-sm leading-relaxed text-[var(--text-secondary)]">
              {item.answer}
            </dd>
          </details>
        ))}
      </dl>
    </section>
  );
};
