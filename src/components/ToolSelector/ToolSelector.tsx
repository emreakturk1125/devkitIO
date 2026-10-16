import React from 'react';
import type { ToolDefinition } from '@/types/tool';
import { useLocale } from '@/hooks/useLocale';
import { toolIdFromSlug } from '@/seo/site';

interface ToolSelectorProps {
  value: string | null;
  onChange: (toolId: string | null) => void;
  tools: ToolDefinition[];
  disabled?: boolean;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({ value, onChange, tools, disabled }) => {
  const { t, toolName, toolDescription } = useLocale();
  const canonicalId = value ? toolIdFromSlug(value) : '';
  const selectedId = tools.some((tool) => tool.id === value)
    ? value
    : tools.some((tool) => tool.id === canonicalId)
      ? canonicalId
      : '';

  return (
    <select
      className="select-field w-full px-3 py-2 rounded bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] focus:border-[var(--color-brand-500)] outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      value={selectedId ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
    >
      <option value="">{t.selectTool}</option>
      {tools.map((tool) => (
        <option
          key={tool.id}
          value={tool.id}
          title={toolDescription(tool.id, tool.description)}
        >
          {toolName(tool.id, tool.name)}
        </option>
      ))}
    </select>
  );
};
