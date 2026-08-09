'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [expanded, setExpanded] = useState(value.length > 0);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut('k', () => setExpanded(true), { meta: true });

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  function collapseIfEmpty() {
    if (!value) setExpanded(false);
  }

  if (!expanded) {
    return (
      <Button variant="outline" size="icon" onClick={() => setExpanded(true)}>
        <Search size={16} />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 border rounded-md px-3 h-9 w-64 bg-white">
      <Search size={16} className="text-gray-400 shrink-0" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={collapseIfEmpty}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onChange('');
            setExpanded(false);
          }
        }}
        placeholder="Search tasks..."
        className="flex-1 text-sm outline-none placeholder:text-gray-400"
      />
      {value ? (
        <button onClick={() => onChange('')} className="text-gray-400 hover:text-gray-600">
          <X size={14} />
        </button>
      ) : (
        <kbd className="text-[10px] text-gray-400 border rounded px-1 py-0.5">⌘F</kbd>
      )}
    </div>
  );
}