'use client';

import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { TaskRow } from './task-row';
import type { ColumnDef } from '../shared/column-defs';
import type { ApiStatus, ApiTask } from '@/lib/api/tasks';
import { useTaskComposerStore } from '@/store/task-composer-store';

export function TaskGroup({
  status,
  tasks,
  columns,
  projectId,
  canCreateTask = true,
}: {
  status: ApiStatus;
  tasks: ApiTask[];
  columns: ColumnDef[];
  projectId?: string;
  canCreateTask?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const gridTemplate = `1fr ${columns.map((c) => c.width).join(' ')} 50px`;
  const openTask = useTaskComposerStore((s) => s.openTask);

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-ink-900 mb-2"
      >
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? '' : '-rotate-90'}`}
        />
        {status.name}
      </button>

      {open && (
        <div className="border rounded-lg overflow-hidden border-ink-border">
          <div
            className="grid gap-2 p-3.5 bg-ink-bg text-xs text-ink-900 font-medium border-b border-ink-border"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <span>Task</span>

            {columns.map((col) => (
              <span key={col.key}>{col.label}</span>
            ))}

            <span className="justify-self-end">Actions</span>
          </div>

          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              columns={columns}
              gridTemplate={gridTemplate}
            />
          ))}

          {canCreateTask && (
            <button
              onClick={() => openTask({ statusId: status.id, projectId })}
              className="flex items-center gap-1.5 text-sm text-ink-900 hover:text-ink-500 p-3 w-full text-left"
            >
              <Plus size={14} />
              Add Task
            </button>
          )}
        </div>
      )}
    </div>
  );
}