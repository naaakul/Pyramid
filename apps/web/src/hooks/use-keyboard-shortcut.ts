import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  opts?: { meta?: boolean },
) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const modifierOk = opts?.meta ? e.ctrlKey || e.metaKey : true;

      if (modifierOk && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        e.stopPropagation();
        callback();
      }
    }

    window.addEventListener("keydown", handler, true);

    return () => {
      window.removeEventListener("keydown", handler, true);
    };
  }, [key, callback, opts?.meta]);
}
