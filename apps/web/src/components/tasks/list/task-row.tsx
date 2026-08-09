'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useBoardFieldsStore, isMembersVisible } from '@/store/board-fields-store';
import type { ApiTask } from '@/lib/api/tasks';

export function TaskRow({ task }: { task: ApiTask }) {
  const { visible } = useBoardFieldsStore();
  const assignee = task.assignees[0]?.user;

  return (
    <div className="flex items-center gap-4 px-3 py-2 border-b text-sm hover:bg-gray-50">
      <span className="flex-1 truncate">{task.title}</span>
      {visible.priority && <Badge variant="outline" className="text-[11px]">{task.priority.replace('_', ' ')}</Badge>}
      {isMembersVisible(visible) && assignee && (
        <div className="flex items-center gap-1.5 w-24">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px] bg-gradient-to-br from-pink-400 to-purple-500 text-white">
              {assignee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600 truncate">{assignee.name}</span>
        </div>
      )}
      {visible.dueDate && (
        <span className="text-xs text-gray-500 w-16">
          {task.dueDateEnd ? new Date(task.dueDateEnd).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : '—'}
        </span>
      )}
      {visible.labels && (
        <div className="flex gap-1 w-32">
          {task.labels.map(({ label }) => (
            <Badge key={label.id} variant="secondary" className="text-[11px]">{label.name}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}