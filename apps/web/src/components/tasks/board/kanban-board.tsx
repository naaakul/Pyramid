'use client';
import { useStatuses, useTasks } from '@/hooks/use-tasks';
import { KanbanColumn } from './kanban-column';

export function KanbanBoard() {
  const { data: statuses, isLoading: statusesLoading } = useStatuses();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  if (statusesLoading || tasksLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading board...</div>;
  }
  if (!statuses?.length) {
    return <div className="p-6 text-sm text-gray-500">No statuses configured for this workspace.</div>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto p-6 pt-0">
      {statuses.map((status) => (
        <KanbanColumn
          key={status.id}
          status={status}
          tasks={(tasks ?? []).filter((t) => t.statusId === status.id)}
        />
      ))}
    </div>
  );
}