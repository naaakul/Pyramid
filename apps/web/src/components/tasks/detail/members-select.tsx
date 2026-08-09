'use client';

import { Check, UserPlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useWorkspaceMembers, useToggleAssignee } from '@/hooks/use-tasks';
import type { ApiUser } from '@/lib/api/tasks';

export function MembersSelect({ taskId, assignees }: { taskId: string; assignees: { user: ApiUser }[] }) {
  const { data: members } = useWorkspaceMembers();
  const { add, remove } = useToggleAssignee(taskId);
  const assignedIds = new Set(assignees.map((a) => a.user.id));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <UserPlus size={14} />
          {assignees.length > 0 ? assignees.map((a) => a.user.name).join(', ') : 'Add members'}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1">
        {(members ?? []).map((user) => {
          const checked = assignedIds.has(user.id);
          return (
            <button
              key={user.id}
              onClick={() => (checked ? remove.mutate(user.id) : add.mutate(user.id))}
              className="flex items-center justify-between w-full px-2 py-1.5 text-sm hover:bg-gray-50 rounded"
            >
              {user.name}
              {checked && <Check size={14} />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}