import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { SelectOption, ToolOption } from '@/types/tool';
import { useLocale } from '@/hooks/useLocale';

interface ToolOptionsProps {
  options: ToolOption[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

interface FitSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

function FitSelect({ label, value, options, onChange }: FitSelectProps) {
  const { label: localize } = useLocale();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const localizedOptions = options.map((opt) => ({
    ...opt,
    display: localize(opt.label),
  }));
  const selected = localizedOptions.find((opt) => opt.value === value) ?? localizedOptions[0];

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    const gap = 4;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const openUp = spaceBelow < menuHeight && rect.top > spaceBelow;
    const top = openUp ? rect.top - menuHeight - gap : rect.bottom + gap;
    const maxWidth = Math.min(window.innerWidth - 16, 480);
    const width = Math.min(Math.max(rect.width, menu.scrollWidth), maxWidth);
    const left = Math.min(rect.left, Math.max(8, window.innerWidth - width - 8));

    setMenuStyle({
      top,
      left,
      minWidth: rect.width,
      maxWidth,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, updateMenuPosition, localizedOptions.length]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onReposition = () => updateMenuPosition();

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onReposition);
    document.addEventListener('scroll', onReposition, true);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onReposition);
      document.removeEventListener('scroll', onReposition, true);
    };
  }, [open, updateMenuPosition]);

  return (
    <div className="select-fit" ref={rootRef}>
      <span className="select-fit-sizer" aria-hidden="true">
        {localizedOptions.map((opt) => (
          <span key={opt.value}>{opt.display}</span>
        ))}
      </span>
      <button
        ref={triggerRef}
        type="button"
        className="select-field select-fit-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        title={selected?.display}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="select-fit-value">{selected?.display}</span>
      </button>
      {open && (
        <ul
          ref={menuRef}
          id={listId}
          role="listbox"
          className="select-fit-menu"
          style={menuStyle}
          aria-label={label}
        >
          {localizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`select-fit-option${isSelected ? ' is-selected' : ''}`}
                  title={opt.display}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                >
                  {opt.display}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export const ToolOptions: React.FC<ToolOptionsProps> = ({ options, values, onChange }) => {
  const { label } = useLocale();

  if (options.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-3 sm:gap-4 sm:p-4">
      {options.map((option) => {
        const val = values[option.id] ?? option.defaultValue;
        const fieldLabel = label(option.label);

        return (
          <div key={option.id} className="flex w-full min-w-0 flex-col gap-1 sm:w-auto">
            <label className="field-label text-sm text-[var(--text-secondary)] font-medium">
              {fieldLabel}
            </label>
            {option.type === 'select' && option.options ? (
              <FitSelect
                label={fieldLabel}
                value={val as string}
                options={option.options}
                onChange={(next) => onChange(option.id, next)}
              />
            ) : option.type === 'boolean' ? (
              <button
                className="toggle-switch flex items-center justify-center w-10 h-5 rounded-full transition-colors relative"
                style={{ backgroundColor: val ? 'var(--color-brand-500)' : 'var(--bg-input)' }}
                onClick={() => onChange(option.id, !val)}
                aria-pressed={Boolean(val)}
                aria-label={fieldLabel}
              >
                <div
                  className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform"
                  style={{ transform: val ? 'translateX(0.6rem)' : 'translateX(-0.6rem)' }}
                />
              </button>
            ) : option.type === 'number' ? (
              <input
                type="number"
                className="text-input h-10 px-2 rounded bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)] w-24"
                value={val as number}
                onChange={(e) => onChange(option.id, Number(e.target.value))}
                aria-label={fieldLabel}
              />
            ) : (
              <input
                type="text"
                className="text-input h-10 px-2 rounded bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)]"
                value={val as string}
                onChange={(e) => onChange(option.id, e.target.value)}
                aria-label={fieldLabel}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
