'use client';

import { useTaskDetail } from '@/hooks/use-tasks';
import { useTaskPanelStore } from '@/store/task-panel-store';
import { useCurrentUser } from '@/lib/auth/current-user-context';
import { TaskDetailHeader } from './task-detail-header';
import { TaskProperties } from './task-properties';
import { TaskLabels } from './task-labels';
import { SubtasksTable } from './subtasks-table';
import { CommentsSection } from './comments-section';
import { DetailsPanel } from './details-panel';
import { UpdatesPanel } from './updates-panel';
import type { ApiTaskDetail } from '@/lib/api/tasks';
import { TaskResources } from './resources-modal';

export function TaskDetailClient({ initialTask, taskId }: { initialTask: ApiTaskDetail; taskId: string }) {
  const { data: task } = useTaskDetail(taskId, initialTask);
  const panelOpen = useTaskPanelStore((s) => s.open);
  const currentUser = useCurrentUser();
  if (!task) return null;

  const isReporter = task.reporter.id === currentUser.id;
  const isSubtask = task.parentTaskId !== null;

  return (
    <div className="flex gap-6 p-6 max-w-6xl mx-auto">
      <div className="flex-1 min-w-0">
        <TaskDetailHeader taskId={task.id} title={task.title} description={task.description}
          watcherCount={task.watcherCount} isLocked={task.isLocked} isReporter={isReporter} />
        <TaskProperties assignee={task.assignees[0]?.user ?? null} dueDateEnd={task.dueDateEnd} teams={task.teams} />
        {!isSubtask && <TaskLabels labels={task.labels} editable={isReporter} taskId={task.id} />}
        {!isSubtask && <TaskResources taskId={task.id} attachments={task.attachments} editable={isReporter} />}
        {!isSubtask && (
          <SubtasksTable parentId={task.id} subtasks={task.subtasks} isReporter={isReporter} />
        )}
        {!isSubtask && (
          <CommentsSection taskId={task.id} comments={task.comments} isReporter={isReporter} isLocked={task.isLocked} />
        )}
      </div>
      {panelOpen && (
        <div className="w-72 shrink-0">
          <DetailsPanel task={task} isReporter={isReporter} isSubtask={isSubtask} />
          {!isSubtask && <UpdatesPanel activities={task.activities} />}
        </div>
      )}
    </div>
  );
}