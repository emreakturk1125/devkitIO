import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '@/services/clipboard/clipboard';
import { useLocale } from '@/hooks/useLocale';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({
  text,
  label,
  className = '',
}: CopyButtonProps) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const displayLabel = label ?? t.copy;

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      className={`btn-ghost !px-2 !py-1 !text-[0.6875rem] ${
        copied ? '!text-[var(--color-success)] !border-[var(--color-success)]' : ''
      } ${className}`}
      onClick={handleCopy}
      disabled={!text}
      title={copied ? t.copied : displayLabel}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? t.copied : displayLabel}
    </button>
  );
}
