'use client';

import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { TaskRow, ROW_GRID } from './task-row';
import type { ApiStatus, ApiTask } from '@/lib/api/tasks';

export function TaskGroup({ status, tasks }: { status: ApiStatus; tasks: ApiTask[] }) {
  const [open, setOpen] = useState(true);

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
          <div className={`${ROW_GRID} px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 border-b`}>
            <span>Task</span>
            <span>Priority</span>
            <span>Members</span>
            <span>Due Date</span>
            <span className="justify-self-end">Actions</span>
          </div>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 w-full text-left">
            <Plus size={14} /> Add Task
          </button>
        </div>
      )}
    </div>
  );
}