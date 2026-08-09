'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { List, LayoutGrid, Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { FIELD_CONFIG, useBoardFieldsStore } from '@/store/board-fields-store';

export function FieldsPopover() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') ?? 'board';
  const { visible, toggle } = useBoardFieldsStore();

  function setView(next: 'list' | 'board') {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', next);
    router.push(`/tasks?${params.toString()}`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns3 size={16} className="mr-1" /> Fields
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2">
        <div className="flex rounded-md border p-0.5 mb-2">
          <button
            onClick={() => setView('list')}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-1.5 rounded ${
              view === 'list' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'
            }`}
          >
            <List size={14} /> List
          </button>
          <button
            onClick={() => setView('board')}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-1.5 rounded ${
              view === 'board' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'
            }`}
          >
            <LayoutGrid size={14} /> Board
          </button>
        </div>

        <div className="flex flex-col">
          {FIELD_CONFIG.map((field) => (
            <label
              key={field.key}
              className="flex items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-50 rounded cursor-pointer"
            >
              {field.label}
              <Checkbox
                checked={visible[field.key]}
                onCheckedChange={() => toggle(field.key)}
              />
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}