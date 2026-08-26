import { useState, useEffect, useCallback } from 'react';
import { Download, Maximize2, Minimize2 } from 'lucide-react';
import CodeEditor from '@/components/Editor/CodeEditor';
import CopyButton from '@/components/CopyButton/CopyButton';
import type { EditorLanguage } from '@/components/Editor/CodeEditor';
import { useLocale } from '@/hooks/useLocale';

interface OutputPanelProps {
  value: string;
  error?: string | null;
  language?: EditorLanguage;
  theme?: 'dark' | 'light';
  label?: string;
  isProcessing?: boolean;
  downloadFilename?: string;
}

export default function OutputPanel({
  value,
  error,
  language = 'text',
  theme = 'dark',
  label,
  isProcessing = false,
  downloadFilename,
}: OutputPanelProps) {
  const { t } = useLocale();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const resolvedLabel = label ?? t.output;

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename ?? 'output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    <div className="relative h-full min-h-0 min-w-0">
      {isFullscreen && (
        <div
          className="fullscreen-backdrop"
          onClick={() => setIsFullscreen(false)}
          aria-hidden="true"
        />
      )}
      <div className={`panel flex flex-col ${isFullscreen ? 'is-fullscreen' : 'h-full min-h-0'}`}>
        <div className="panel-header">
          <span className="flex items-center gap-1.5">
            {resolvedLabel}
            {isProcessing && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-500)] animate-pulse" />
            )}
          </span>
          <div className="flex items-center gap-1">
            {value && (
              <>
                <CopyButton text={value} />
                <button
                  className="btn-ghost !px-2 !py-1.5 sm:!py-1 !text-[0.6875rem] min-h-8 min-w-8"
                  onClick={handleDownload}
                  title={t.downloadOutput}
                  aria-label={t.downloadOutput}
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">{t.download}</span>
                </button>
              </>
            )}
            <button
              className="btn-ghost !px-2 !py-1.5 sm:!py-1 !text-[0.6875rem] min-h-8 min-w-8"
              onClick={toggleFullscreen}
              title={isFullscreen ? t.exitFullscreen : t.fullscreen}
              aria-label={isFullscreen ? t.exitFullscreen : t.fullscreen}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span className="hidden sm:inline">{isFullscreen ? t.exit : t.expand}</span>
            </button>
          </div>
        </div>

        {error ? (
          <div className="flex-1 min-h-0 p-3 overflow-auto">
            <div className="error-message">{error}</div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <CodeEditor
              value={value}
              language={language}
              readOnly
              theme={theme}
              placeholder={t.resultPlaceholder}
            />
          </div>
        )}
      </div>
    </div>
  );
}
