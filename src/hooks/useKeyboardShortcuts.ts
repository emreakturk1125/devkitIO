import { useEffect, useCallback } from 'react';

interface ShortcutHandlers {
  onTransform?: () => void;
  onCopyOutput?: () => void;
  onSearch?: () => void;
  onClearInput?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl/Cmd + K — Open search
      if (isCtrlOrCmd && e.key === 'k') {
        e.preventDefault();
        handlers.onSearch?.();
        return;
      }

      // Ctrl/Cmd + Enter — Transform
      if (isCtrlOrCmd && e.key === 'Enter') {
        e.preventDefault();
        handlers.onTransform?.();
        return;
      }

      // Ctrl/Cmd + Shift + C — Copy output
      if (isCtrlOrCmd && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        handlers.onCopyOutput?.();
        return;
      }

      // Ctrl/Cmd + L — Clear input
      if (isCtrlOrCmd && e.key === 'l') {
        e.preventDefault();
        handlers.onClearInput?.();
        return;
      }
    },
    [handlers]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
