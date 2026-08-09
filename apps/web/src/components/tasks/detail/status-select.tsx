'use client';

import { Check, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useStatuses } from '@/hooks/use-tasks';
import type { ApiStatus } from '@/lib/api/tasks';

export function StatusSelect({ value, onChange }: { value: ApiStatus; onChange: (statusId: string) => void }) {
  const { data: statuses } = useStatuses();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: value.color }} />
        {value.name}
        <ChevronDown size={14} className="text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {(statuses ?? []).map((s) => (
          <DropdownMenuItem key={s.id} onClick={() => onChange(s.id)} className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name}
            </span>
            {value.id === s.id && <Check size={14} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}