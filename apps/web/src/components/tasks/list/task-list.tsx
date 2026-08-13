'use client';

import { useStatuses, useTasks } from '@/hooks/use-tasks';
import { useBoardFieldsStore } from '@/store/board-fields-store';
import { getVisibleColumns } from '../shared/column-defs';
import { TaskGroup } from './task-group';
import type { TaskQuery } from '@/lib/api/tasks';

export function TaskListView({
  query,
  projectId,
  canCreateTask = true,
}: {
  query: TaskQuery;
  projectId?: string;
  canCreateTask?: boolean;
}) {
  const { data: statuses, isLoading: statusesLoading } = useStatuses();
  const { data: tasks, isLoading: tasksLoading } = useTasks(query);
  const visible = useBoardFieldsStore((s) => s.visible);
  const columns = getVisibleColumns(visible);

  if (statusesLoading || tasksLoading) {
    return <div className="p-6 text-sm text-ink-500">Loading...</div>;
  }

  const groups = (statuses ?? []).map((status) => ({
    status,
    tasks: (tasks ?? []).filter((t) => t.status.name === status.name),
  }));

  const hasActiveFilter = Object.values(query).some(Boolean);
  const visibleGroups = hasActiveFilter
    ? groups.filter((g) => g.tasks.length > 0)
    : groups;

  if (hasActiveFilter && visibleGroups.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-ink-400">
        No tasks match these filters
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      {visibleGroups.map(({ status, tasks }) => (
        <TaskGroup
          key={status.id}
          status={status}
          tasks={tasks}
          columns={columns}
          projectId={projectId}
          canCreateTask={canCreateTask}
        />
      ))}
    </div>
  );
}