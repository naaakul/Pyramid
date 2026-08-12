'use client';

import { useState } from 'react';
import { Search, X, UserPlus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useToggleAssignee } from '@/hooks/use-tasks';
import { useCreateInvite } from '@/hooks/use-invites';
import { searchUsersByEmail } from '@/lib/api/users';
import { useQuery } from '@tanstack/react-query';
import type { ApiUser } from '@/lib/api/tasks';

export function AddMembersModal({ taskId, assignees }: { taskId: string; assignees: { user: ApiUser }[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 300);
  const { remove } = useToggleAssignee(taskId);
  const createInvite = useCreateInvite();

  const { data: results, isFetching } = useQuery({
    queryKey: ['user-search', debounced],
    queryFn: () => searchUsersByEmail(debounced),
    enabled: debounced.length >= 3,
  });

  function invite(userId: string) {
    createInvite.mutate(
      { invitedUserId: userId, taskId },
      {
        onSuccess: () => toast.success('Invite sent'),
        onError: () => toast.error('Could not send invite'),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700">
          <UserPlus size={14} />
          {assignees.length > 0 ? assignees.map((a) => a.user.name).join(', ') : 'Add members'}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Add members</DialogTitle></DialogHeader>

        <div className="flex items-center gap-2 border rounded-md px-2.5 py-1.5">
          <Search size={14} className="text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email..."
            className="flex-1 text-sm outline-none"
          />
        </div>

        {debounced.length >= 3 && (
          <div className="max-h-40 overflow-y-auto -mt-1">
            {isFetching && <div className="text-xs text-ink-400 px-1 py-2">Searching...</div>}
            {!isFetching && (results ?? []).length === 0 && (
              <div className="text-xs text-ink-400 px-1 py-2">No matching users found</div>
            )}
            {(results ?? []).map((user) => (
              <button
                key={user.id}
                onClick={() => invite(user.id)}
                className="flex items-center gap-2 w-full px-1 py-1.5 text-sm hover:bg-ink-50 rounded"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] text-white" style={{ backgroundColor: user.avatarColor ?? '#9ca3af' }}>
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-left">
                  <div>{user.name}</div>
                  <div className="text-xs text-ink-400">{user.email}</div>
                </span>
                <span className="text-xs text-ink-500">Invite</span>
              </button>
            ))}
          </div>
        )}

        {assignees.length > 0 && (
          <div className="border-t pt-2 mt-1">
            <div className="text-xs text-ink-400 mb-1">On this task</div>
            {assignees.map(({ user }) => (
              <div key={user.id} className="flex items-center justify-between px-1 py-1 text-sm">
                <span className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px] text-white" style={{ backgroundColor: user.avatarColor ?? '#9ca3af' }}>
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {user.name}
                </span>
                <button onClick={() => remove.mutate(user.id)} className="text-ink-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button size="sm" onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}