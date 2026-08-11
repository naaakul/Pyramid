"use client";

import { useEffect, useRef, useState } from "react";
import { Command, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [expanded, setExpanded] = useState(value.length > 0);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut("f", () => setExpanded(true), { meta: true });

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  function collapseIfEmpty() {
    if (!value) setExpanded(false);
  }

  if (!expanded) {
    return (
      <Button variant="outline" size="icon" onClick={() => setExpanded(true)} className="border-ink-border text-ink-text hover:bg-ink-bg hover:text-none">
        <Search size={16} />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 border rounded-md px-3 h-9 w-64 bg-white border-ink-border text-ink-text">
      <Search size={16} className="shrink-0" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={collapseIfEmpty}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            setExpanded(false);
          }
        }}
        placeholder="Search tasks..."
        className="flex-1 text-sm outline-none"
      />
      {value ? (
        <button
          onClick={() => onChange("")}
          className="text-ink-sec hover:text-ink-500"
        >
          <X size={14} />
        </button>
      ) : (
        <kbd className="text-sm bg-ink-bg rounded px-1.5 py-0.5 flex items-center gap-0.5">
          <Command size={12}/>
          <p>F</p>
        </kbd>
      )}
    </div>
  );
}
