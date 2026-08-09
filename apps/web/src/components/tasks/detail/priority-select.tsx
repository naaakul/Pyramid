'use client';

import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PriorityBadge } from '../shared/priority-badge';

const OPTIONS = ['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'];

export function PrioritySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="flex items-center gap-1">
        <PriorityBadge priority={value} />
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <div className="px-2 py-1 text-xs text-gray-400">Priority</div>
        {OPTIONS.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onChange(opt)} className="flex items-center justify-between">
            <PriorityBadge priority={opt} />
            {value === opt && <Check size={14} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}