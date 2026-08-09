import { TaskRow } from './task-row';
import type { ApiStatus, ApiTask } from '@/lib/api/tasks';

export function TaskGroup({ status, tasks }: { status: ApiStatus; tasks: ApiTask[] }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
        {status.name}
        <span className="text-gray-400 font-normal">{tasks.length}</span>
      </div>
      <div className="border rounded-lg overflow-hidden">
        {tasks.length === 0 ? (
          <div className="px-3 py-3 text-sm text-gray-400">No tasks</div>
        ) : (
          tasks.map((task) => <TaskRow key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}