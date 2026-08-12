'use client';
import { useEffect } from 'react';
import { Eye, Check, CheckCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { apiFetch } from '@/lib/api/client';
import type { ApiTaskDetail } from '@/lib/api/tasks';

export function ViewModal({ task, isReporter }: { task: ApiTaskDetail; isReporter: boolean }) {
  useEffect(() => {
    if (!isReporter) apiFetch(`/tasks/${task.id}/view`, { method: 'POST' }).catch(() => {});
  }, [task.id, isReporter]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="h-8 px-2 border rounded-md flex items-center gap-1 text-ink-500 hover:bg-ink-50 text-xs">
          <Eye size={14} /> {task.watcherCount}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Seen by</DialogTitle></DialogHeader>
        <div className="space-y-2">
          {task.assignees.map(({ user }) => {
            const invite = task.invites?.find((i: any) => i.invitedUser.id === user.id);
            const watcher = task.watchers?.find((w: any) => w.userId === user.id);
            const status = watcher?.viewedAt ? 'seen' : invite?.status === 'ACCEPTED' || !invite ? 'joined' : 'sent';
            return (
              <div key={user.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] text-white" style={{ backgroundColor: user.avatarColor ?? '#9ca3af' }}>{user.name.charAt(0)}</AvatarFallback></Avatar>
                  {user.name}
                </span>
                {status === 'sent' && <Check size={14} className="text-ink-400" />}
                {status === 'joined' && <CheckCheck size={14} className="text-ink-400" />}
                {status === 'seen' && <CheckCheck size={14} className="text-blue-500" />}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}