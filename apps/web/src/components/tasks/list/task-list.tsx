'use client';

import { useStatuses, useTasks } from '@/hooks/use-tasks';
import { TaskGroup } from './task-group';

export function TaskListView() {
  const { data: statuses, isLoading: statusesLoading } = useStatuses();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  if (statusesLoading || tasksLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="px-6 pb-6">
      {(statuses ?? []).map((status) => (
        <TaskGroup
          key={status.id}
          status={status}
          tasks={(tasks ?? []).filter((t) => t.statusId === status.id)}
        />
      ))}
    </div>
  );
}