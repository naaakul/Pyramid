import { GripVertical, Plus, MoreHorizontal } from 'lucide-react';
import { TaskCard } from './task-card';
import type { MockColumn } from '@/lib/mock-tasks';

export function KanbanColumn({ column }: { column: MockColumn }) {
  return (
    <div className="w-72 shrink-0 flex flex-col">
      <div className="flex items-center justify-between px-1 py-1.5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <GripVertical size={14} className="text-gray-400" />
          {column.name}
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <button className="hover:text-gray-600"><Plus size={16} /></button>
          <button className="hover:text-gray-600"><MoreHorizontal size={16} /></button>
        </div>
      </div>
      <div className="flex flex-col gap-2 bg-gray-50 rounded-lg p-2 flex-1">
        {column.tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 px-1 py-1">
          <Plus size={14} /> Add Task
        </button>
      </div>
    </div>
  );
}