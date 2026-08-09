'use client';

import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { TaskRow } from './task-row';
import type { ColumnDef } from '../shared/column-defs';
import type { ApiStatus, ApiTask } from '@/lib/api/tasks';

export function TaskGroup({
  status,
  tasks,
  columns,
}: {
  status: ApiStatus;
  tasks: ApiTask[];
  columns: ColumnDef[];
}) {
  const [open, setOpen] = useState(true);
  const gridTemplate = `1fr ${columns.map((c) => c.width).join(' ')} 50px`;

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-800 mb-2"
      >
        <ChevronDown size={16} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
        {status.name}
      </button>

      {open && (
        <div className="border rounded-lg overflow-hidden">
          <div
            className="grid gap-2 px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 border-b"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <span>Task</span>
            {columns.map((col) => (
              <span key={col.key}>{col.label}</span>
            ))}
            <span className="justify-self-end">Actions</span>
          </div>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} columns={columns} gridTemplate={gridTemplate} />
          ))}
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 w-full text-left">
            <Plus size={14} /> Add Task
          </button>
        </div>
      )}
    </div>
  );
}