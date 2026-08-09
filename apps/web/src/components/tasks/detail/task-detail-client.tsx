'use client';

import { useTaskDetail } from '@/hooks/use-tasks';
import { TaskDetailHeader } from './task-detail-header';
import { TaskProperties } from './task-properties';
import { TaskLabels } from './task-labels';
import { TaskResources } from './task-resources';
import { SubtasksTable } from './subtasks-table';
import { CommentsSection } from './comments-section';
import { DetailsPanel } from './details-panel';
import { UpdatesPanel } from './updates-panel';
import type { ApiTaskDetail } from '@/lib/api/tasks';

export function TaskDetailClient({ initialTask, taskId }: { initialTask: ApiTaskDetail; taskId: string }) {
  const { data: task } = useTaskDetail(taskId, initialTask);
  if (!task) return null;

  return (
    <div className="flex gap-6 p-6 max-w-6xl mx-auto">
      <div className="flex-1 min-w-0">
        <TaskDetailHeader taskId={task.id} title={task.title} description={task.description} watcherCount={task.watcherCount} />
        <TaskProperties assignee={task.assignees[0]?.user ?? null} dueDateEnd={task.dueDateEnd} />
        <TaskLabels labels={task.labels} />
        <TaskResources />
        <h3 className="text-sm font-medium text-gray-800 mb-2 mt-6">Subtasks</h3>
        <SubtasksTable parentId={task.id} subtasks={task.subtasks} />
        <CommentsSection taskId={task.id} comments={task.comments} />
      </div>
      <div className="w-72 shrink-0">
        <DetailsPanel task={task} />
        <UpdatesPanel activities={task.activities} />
      </div>
    </div>
  );
}