'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : null;
}

export function DateRangeSelect({
  start,
  end,
  onChange,
}: {
  start: string | null;
  end: string | null;
  onChange: (field: 'dueDateStart' | 'dueDateEnd', value: string | null) => void;
}) {
  const [editing, setEditing] = useState<'start' | 'end' | null>(null);

  return (
    <div className="flex items-center gap-1.5">
      <Popover open={editing === 'start'} onOpenChange={(o) => setEditing(o ? 'start' : null)}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1 text-xs border rounded px-2 py-1 text-gray-600 hover:bg-gray-50">
            <CalendarIcon size={12} /> {fmt(start) ?? 'Start'}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={start ? new Date(start) : undefined}
            onSelect={(date) => {
              onChange('dueDateStart', date ? date.toISOString() : null);
              setEditing(null);
            }}
          />
        </PopoverContent>
      </Popover>
      <span className="text-gray-300">→</span>
      <Popover open={editing === 'end'} onOpenChange={(o) => setEditing(o ? 'end' : null)}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1 text-xs border rounded px-2 py-1 text-gray-600 hover:bg-gray-50">
            <CalendarIcon size={12} /> {fmt(end) ?? 'End'}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={end ? new Date(end) : undefined}
            onSelect={(date) => {
              onChange('dueDateEnd', date ? date.toISOString() : null);
              setEditing(null);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}