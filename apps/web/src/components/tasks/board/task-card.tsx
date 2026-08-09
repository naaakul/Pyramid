'use client';

import { Calendar, Tag, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useBoardFieldsStore, isMembersVisible } from '@/store/board-fields-store';
import type { ApiTask } from '@/lib/api/tasks';

export function TaskCard({ task }: { task: ApiTask }) {
  const { visible } = useBoardFieldsStore();
  const assignee = task.assignees[0]?.user;

  return (
    <Card className="p-3 gap-2 shadow-none border-gray-200">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium">{task.title}</p>
        <MoreHorizontal size={16} className="text-gray-400 shrink-0" />
      </div>

      {(isMembersVisible(visible) || visible.dueDate) && (
        <div className="flex items-center justify-between">
          {isMembersVisible(visible) && assignee && (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px] bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                  {assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">{assignee.name}</span>
            </div>
          )}
          {visible.dueDate && task.dueDateEnd && (
            <Badge variant="outline" className="gap-1 text-red-500 border-red-200 bg-red-50 text-[11px] px-1.5 py-0">
              <Calendar size={11} />
              {new Date(task.dueDateEnd).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
            </Badge>
          )}
        </div>
      )}

      {visible.priority && (
        <Badge variant="outline" className="w-fit text-[11px] px-1.5 py-0">
          {task.priority.replace('_', ' ')}
        </Badge>
      )}

      {visible.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.map(({ label }) => (
            <Badge key={label.id} variant="secondary" className="gap-1 text-[11px] px-1.5 py-0 font-normal text-gray-600 bg-gray-100">
              <Tag size={10} />
              {label.name}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}