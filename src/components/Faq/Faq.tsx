import React from 'react';
import { useLocale } from '@/hooks/useLocale';

interface FaqProps {
  toolName: string;
}

export const Faq: React.FC<FaqProps> = ({ toolName }) => {
  const { t, format } = useLocale();

  const items = [
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

  return (
    <section className="mt-3 space-y-1" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-sm font-semibold text-[var(--text-primary)]"
      >
        {t.faq}
      </h2>
      <dl className="space-y-1">
        {items.map((item, index) => (
          <details
            key={index}
            className="group rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)]"
          >
            <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--text-primary)] select-none [&::-webkit-details-marker]:hidden list-none">
              <span className="shrink-0 text-[var(--text-tertiary)] transition-transform group-open:rotate-90">
                ▸
              </span>
              <dt className="inline">{item.question}</dt>
            </summary>
            <dd className="px-3 pb-3 pt-0 pl-8 text-sm leading-relaxed text-[var(--text-secondary)]">
              {item.answer}
            </dd>
          </details>
        ))}
      </dl>
    </section>
  );
};
