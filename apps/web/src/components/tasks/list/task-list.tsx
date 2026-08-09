'use client';

import { useStatuses, useTasks } from '@/hooks/use-tasks';
import { TaskGroup } from './task-group';

export function TaskListView({ search }: { search?: string }) {
  const { data: statuses, isLoading: statusesLoading } = useStatuses();
  const { data: tasks, isLoading: tasksLoading } = useTasks(search);

  if (statusesLoading || tasksLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading...</div>;
  }

  const groups = (statuses ?? []).map((status) => ({
    status,
    tasks: (tasks ?? []).filter((t) => t.statusId === status.id),
  }));

  const visibleGroups = search ? groups.filter((g) => g.tasks.length > 0) : groups;

  if (search && visibleGroups.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-gray-400">
        No tasks match &quot;{search}&quot;
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      {visibleGroups.map(({ status, tasks }) => (
        <TaskGroup key={status.id} status={status} tasks={tasks} />
      ))}
    </div>
  );
}