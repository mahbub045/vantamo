import { useEffect } from 'react';

export function useKeyboardShortcut(key: string, callback: () => void, modifiers: { meta?: boolean; ctrl?: boolean } = {}) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const metaMatch = modifiers.meta ? e.metaKey : true;
      const ctrlMatch = modifiers.ctrl ? e.ctrlKey : true;
      if (e.key === key && (metaMatch || ctrlMatch)) {
        e.preventDefault();
        callback();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback]);
}
