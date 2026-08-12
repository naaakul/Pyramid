'use client';

import Link from 'next/link';
import { Plus, MoreHorizontal } from 'lucide-react';
import { PriorityBadge } from '../shared/priority-badge';
import { MembersCell } from '../shared/members-cell';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRemoveTask } from '@/hooks/use-tasks';
import { useTaskComposerStore } from '@/store/task-composer-store';
import type { ApiTask } from '@/lib/api/tasks';

const GRID = 'grid grid-cols-[1fr_100px_60px_120px_50px] items-center gap-2';

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function SubtasksTable({ parentId, subtasks, isReporter }: { parentId: string; subtasks: ApiTask[]; isReporter: boolean }) {
  const removeTask = useRemoveTask();
  const openSubtask = useTaskComposerStore((s) => s.openSubtask);

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <div className={`${GRID} px-3 py-2 bg-ink-50 text-xs font-medium text-ink-500 border-b`}>
        <span>Task</span><span>Priority</span><span>Members</span><span>Due Date</span>
        {isReporter ? <span className="justify-self-end">Actions</span> : <span />}
      </div>
      {subtasks.map((task) => (
        <div key={task.id} className={`${GRID} px-3 py-2.5 border-b last:border-b-0 text-sm items-center`}>
          <Link href={`/tasks/${task.id}`} className="truncate hover:underline">{task.title}</Link>
          <PriorityBadge priority={task.priority} />
          <MembersCell assignees={task.assignees} />
          <span className="text-ink-600 text-xs">{formatDate(task.dueDateEnd)}</span>
          {isReporter ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-ink-400 hover:text-ink-600 justify-self-end"><MoreHorizontal size={16} /></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-red-600" onClick={() => removeTask.mutate(task.id)}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : <span />}
        </div>
      ))}
      {isReporter && (
        <button onClick={() => openSubtask(parentId)} className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700 px-3 py-2.5 w-full text-left">
          <Plus size={14} /> Add Subtasks
        </button>
      )}
    </div>
  );
}