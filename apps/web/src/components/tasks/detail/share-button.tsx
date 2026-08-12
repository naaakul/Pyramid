'use client';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function ShareButton({ taskId }: { taskId: string }) {
  function share() {
    const url = `${window.location.origin}/share/tasks/${taskId}`;
    navigator.clipboard.writeText(url);
    toast.success('View only link copied');
  }
  return (
    <button onClick={share} className="w-8 h-8 border rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-50">
      <Share2 size={14} />
    </button>
  );
}