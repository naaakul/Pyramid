'use client';
import { useStatuses, useTasks } from '@/hooks/use-tasks';
import { KanbanColumn } from './kanban-column';
import type { TaskQuery } from '@/lib/api/tasks';

export function KanbanBoard({ query }: { query: TaskQuery }) {
  const { data: statuses, isLoading: statusesLoading } = useStatuses();
  const { data: tasks, isLoading: tasksLoading } = useTasks(query);

  if (statusesLoading || tasksLoading) return <div className="p-6 text-sm text-ink-500">Loading board...</div>;
  if (!statuses?.length) return <div className="p-6 text-sm text-ink-500">No statuses configured for this workspace.</div>;

  return (
    <div className="flex gap-4 overflow-x-auto p-6 pt-0">
      {statuses.map((status) => (
        <KanbanColumn
          key={status.id}
          status={status}
          tasks={(tasks ?? []).filter((t) => t.status.name === status.name)}
        />
      ))}
    </div>
  );
}