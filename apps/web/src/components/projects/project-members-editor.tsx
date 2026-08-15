'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { searchUsersByEmail } from '@/lib/api/users';
import { useCreateInvite } from '@/hooks/use-invites';
import { apiFetch } from '@/lib/api/client';
import type { ApiUser } from '@/lib/api/tasks';

export function ProjectMembersEditor({ projectId, members }: { projectId: string; members: { user: ApiUser }[] }) {
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 300);
  const createInvite = useCreateInvite();

  const { data: results, isFetching, isError } = useQuery({
    queryKey: ['user-search', debounced, 'project', projectId],
    queryFn: () => searchUsersByEmail(debounced, undefined, projectId),
    enabled: debounced.length >= 3,
  });

  function invite(userId: string) {
    createInvite.mutate({ invitedUserId: userId, projectId }, {
      onSuccess: () => toast.success('Invite sent'),
      onError: () => toast.error('Could not send invite'),
    });
  }
  async function removeMember(userId: string) {
    await apiFetch(`/projects/${projectId}/members/${userId}`, { method: 'DELETE' });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 border border-ink-border rounded-md px-2.5 py-1.5">
        <Search size={14} className="text-ink-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by email..." className="flex-1 text-sm outline-none placeholder:text-ink-sec text-ink-500" />
      </div>
      {debounced.length >= 3 && (
        <div className="max-h-32 overflow-y-auto">
          {isFetching && <div className="text-xs text-ink-400 px-1 py-2">Searching...</div>}
          {isError && <div className="text-xs text-red-500 px-1 py-2">Search failed</div>}
          {!isFetching && !isError && (results ?? []).length === 0 && <div className="text-xs text-ink-400 px-1 py-2">No matching users found</div>}
          {(results ?? []).map((user) => (
            <button key={user.id} onClick={() => invite(user.id)} className="flex items-center gap-2 w-full px-1 py-1.5 text-sm hover:bg-ink-50 rounded">
              <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] text-white" style={{ backgroundColor: user.avatarColor ?? '#9ca3af' }}>{user.name.charAt(0)}</AvatarFallback></Avatar>
              <span className="flex-1 text-left"><div>{user.name}</div><div className="text-xs text-ink-500">{user.email}</div></span>
              <span className="text-xs text-ink-400">Invite</span>
            </button>
          ))}
        </div>
      )}
      {members.length > 0 && (
        <div className="pt-2">
          <div className="text-xs text-ink-400 mb-1">Members</div>
          {members.map(({ user }) => (
            <div key={user.id} className="flex items-center justify-between px-1 py-1 text-sm">
              <span className="flex items-center gap-2 text-ink-500">
                <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] text-white" style={{ backgroundColor: user.avatarColor ?? '#9ca3af' }}>{user.name.charAt(0)}</AvatarFallback></Avatar>
                {user.name}
              </span>
              <button onClick={() => removeMember(user.id)} className="text-ink-400 hover:text-red-500"><X size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}