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
    <section className="mt-2" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="sr-only"
      >
        {t.faq}
      </h2>
      <dl className="space-y-1 mt-2">
        {items.map((item, index) => (
          <details
            key={index}
            className="group rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)]"
          >
            <summary className="flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] select-none [&::-webkit-details-marker]:hidden list-none">
              <span className="shrink-0 text-[var(--text-tertiary)] transition-transform group-open:rotate-90">
                ▸
              </span>
              <dt className="inline">{item.question}</dt>
            </summary>
            <dd className="px-2.5 pb-2 pt-0 pl-6 text-xs leading-relaxed text-[var(--text-secondary)]">
              {item.answer}
            </dd>
          </details>
        ))}
      </dl>
    </section>
  );
};
