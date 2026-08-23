import { useState, useEffect, useCallback, useMemo } from 'react';
import { Clipboard, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import CodeEditor from '@/components/Editor/CodeEditor';
import type { EditorLanguage } from '@/components/Editor/CodeEditor';
import { useLocale } from '@/hooks/useLocale';

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  language?: EditorLanguage;
  theme?: 'dark' | 'light';
  placeholder?: string;
  label?: string;
  onPaste?: () => void;
  onClear?: () => void;
  disabled?: boolean;
}

export default function InputPanel({
  value,
  onChange,
  language = 'text',
  theme = 'dark',
  placeholder,
  label,
  onClear,
  disabled = false,
}: InputPanelProps) {
  const { t, format } = useLocale();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const resolvedLabel = label ?? t.input;
  const resolvedPlaceholder = placeholder ?? (disabled ? t.inputNotRequired : t.pasteData);

  const { lineCount, charCount } = useMemo(() => {
    let lines = value ? 1 : 0;
    for (let i = 0; i < value.length; i++) {
      if (value.charCodeAt(i) === 10) lines++;
    }
    return { lineCount: lines, charCount: value.length };
  }, [value]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  return (
    <div className="relative h-full min-h-0">
      {isFullscreen && (
        <div
          className="fullscreen-backdrop"
          onClick={() => setIsFullscreen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`panel flex flex-col ${isFullscreen ? 'is-fullscreen' : 'h-full min-h-0'} ${disabled ? 'is-inactive' : ''}`}
        aria-disabled={disabled}
      >
        <div className="panel-header">
          <span className="flex items-center gap-1.5">
            {resolvedLabel}
          </span>
          <div className="flex items-center gap-1">
            {value && (
              <span className="text-[0.6875rem] text-[var(--text-tertiary)] font-normal normal-case tracking-normal mr-2">
                {format(t.linesChars, { lines: lineCount, chars: charCount })}
              </span>
            )}
            {!disabled && (
              <button
                className="btn-ghost !px-2 !py-1 !text-[0.6875rem]"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text) onChange(value + text);
                  } catch { /* clipboard denied */ }
                }}
                title={t.pasteFromClipboard}
              >
                <Clipboard size={12} />
                {t.paste}
              </button>
            )}
            {value && !disabled && (
              <button
                className="btn-ghost !px-2 !py-1 !text-[0.6875rem]"
                onClick={onClear}
                title={t.clearInput}
              >
                <Trash2 size={12} />
                {t.clear}
              </button>
            )}
            <button
              className="btn-ghost !px-2 !py-1 !text-[0.6875rem]"
              onClick={toggleFullscreen}
              title={isFullscreen ? t.exitFullscreen : t.fullscreen}
            >
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              {isFullscreen ? t.exit : t.expand}
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <CodeEditor
            value={value}
            onChange={disabled ? undefined : onChange}
            language={language}
            theme={theme}
            placeholder={resolvedPlaceholder}
            readOnly={disabled}
          />
        </div>
      </div>
    </div>
  );
}
