import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';

export const NotFound: React.FC = () => {
  const { t } = useLocale();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{t.pageNotFound}</h1>
      <p className="max-w-md text-sm break-words text-[var(--text-secondary)]">{t.pageNotFoundHint}</p>
      <Link to="/" className="btn-primary mt-2">
        {t.goHome}
      </Link>
    </div>
  );
};
