import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoriesWithTools } from '@/registry/toolRegistry';
import { useLocale } from '@/hooks/useLocale';
import { toolPath, categoryPath } from '@/seo/site';
import { ShieldCheck, Wrench } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, categoryName, toolName } = useLocale();
  const categories = getCategoriesWithTools();

  return (
    <footer className="mt-auto shrink-0 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] px-4 py-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Top: Brand & Guarantee */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-[var(--color-brand-500)]" aria-hidden="true" />
            <span className="font-bold text-sm text-[var(--text-primary)]">DevKit</span>
            <span className="text-xs text-[var(--text-tertiary)]">— Free Online Developer Tools</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-success)] font-medium bg-[var(--color-success)]/10 px-2.5 py-1 rounded">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>100% Client-Side — Private &amp; Secure</span>
          </div>
        </div>

        {/* Middle: Categorized Tools Directory */}
        <nav aria-label="Developer tools directory" className="py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="min-w-0">
              <Link
                to={categoryPath(category.id)}
                className="text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--color-brand-400)] transition-colors block mb-2 truncate"
              >
                {categoryName(category.id, category.name)}
              </Link>
              <ul className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                {category.tools.map((tool) => (
                  <li key={tool.id} className="truncate">
                    <Link
                      to={toolPath(category.id, tool.id)}
                      className="hover:text-[var(--text-primary)] hover:underline transition-colors"
                      title={toolName(tool.id, tool.name)}
                    >
                      {toolName(tool.id, tool.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom: Copyright & Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[var(--border-subtle)] text-xs text-[var(--text-tertiary)]">
          <p>© {new Date().getFullYear()} DevKit. Open-source client-side developer toolkit.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">
              {t.home}
            </Link>
            <span>·</span>
            <a href="/sitemap.xml" className="hover:text-[var(--text-primary)] transition-colors" target="_blank" rel="noopener noreferrer">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
