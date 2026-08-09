'use client';

import { ChevronDown, Plus, Settings } from 'lucide-react';
import { PrioritySelect } from './priority-select';
import { useUpdateTask } from '@/hooks/use-tasks';
import type { ApiTaskDetail } from '@/lib/api/tasks';

export function DetailsPanel({ task }: { task: ApiTaskDetail }) {
  const updateTask = useUpdateTask(task.id);

  return (
    <div className="border rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
          <ChevronDown size={14} /> Details
        </button>
        <div className="flex items-center gap-1 text-gray-400">
          <button className="hover:text-gray-600"><Plus size={14} /></button>
          <button className="hover:text-gray-600"><Settings size={14} /></button>
        </div>
      </div>
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.status.color }} />
            {task.status.name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Priority</span>
          <PrioritySelect value={task.priority} onChange={(priority) => updateTask.mutate({ priority })} />
        </div>
        <div className="flex items-center justify-between"><span className="text-gray-500">Members</span><span className="text-gray-400">—</span></div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Dates</span>
          <span className="text-gray-400">
            {task.dueDateEnd ? new Date(task.dueDateEnd).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between"><span className="text-gray-500">Labels</span><span className="text-gray-400">{task.labels.length || '—'}</span></div>
        <div className="flex items-center justify-between"><span className="text-gray-500">Teams</span><span className="text-gray-400">—</span></div>
        <div className="flex items-center justify-between"><span className="text-gray-500">Reporter</span><span className="text-gray-700">{task.reporter.name}</span></div>
      </div>
    </div>
  );
}