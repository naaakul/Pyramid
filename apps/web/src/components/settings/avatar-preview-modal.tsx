'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function AvatarPreviewModal({
  open, onOpenChange, avatarUrl, name,
}: { open: boolean; onOpenChange: (o: boolean) => void; avatarUrl: string | null; name: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs flex flex-col items-center gap-4 bg-transparent ring-transparent [&>button]:hidden">
        <button onClick={() => onOpenChange(false)} className="self-end text-ink-400 hover:text-ink-600">
          <X size={18} />
        </button>
        {avatarUrl ? (
          <Image src={avatarUrl} alt="" height={200} width={200} className="rounded-full object-cover" />
        ) : (
          <Avatar className="h-48 w-48">
            <AvatarFallback className="rounded-full bg-ink-900 text-white text-5xl">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </DialogContent>
    </Dialog>
  );
}