'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function CollapsibleSection({ title, defaultOpen = true, children, actions }: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger className="flex items-center gap-1.5 text-sm font-medium">
          <ChevronDown size={14} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
          {title}
        </CollapsibleTrigger>
        {actions}
      </div>
      <CollapsibleContent className='mt-2'>{children}</CollapsibleContent>
    </Collapsible>
  );
}