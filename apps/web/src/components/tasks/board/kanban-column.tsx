'use client';
import { useState } from 'react';
import { GripVertical, Plus, MoreHorizontal } from 'lucide-react';
import { TaskCard } from './task-card';
import { useCreateTask } from '@/hooks/use-tasks';
import type { ApiStatus, ApiTask } from '@/lib/api/tasks';

export function KanbanColumn({ status, tasks }: { status: ApiStatus; tasks: ApiTask[] }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const createTask = useCreateTask();

  function submit() {
    if (!title.trim()) return setAdding(false);
    createTask.mutate({ title, statusId: status.id });
    setTitle('');
    setAdding(false);
  }

  return (
    <div className="w-72 shrink-0 flex flex-col">
      <div className="flex items-center justify-between px-1 py-1.5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <GripVertical size={14} className="text-gray-400" />
          {status.name}
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <button onClick={() => setAdding(true)} className="hover:text-gray-600"><Plus size={16} /></button>
          <button className="hover:text-gray-600"><MoreHorizontal size={16} /></button>
        </div>
      </div>
      <div className="flex flex-col gap-2 bg-gray-50 rounded-lg p-2 flex-1">
        {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        {adding ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={submit}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="text-sm border rounded px-2 py-1.5 outline-none"
            placeholder="Task title..."
          />
        ) : (
          <button onClick={() => setAdding(true)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 px-1 py-1">
            <Plus size={14} /> Add Task
          </button>
        )}
      </div>
    </div>
  );
}