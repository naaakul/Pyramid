"use client";

import { useTaskDetail } from "@/hooks/use-tasks";
import { useTaskPanelStore } from "@/store/task-panel-store";
import { useCurrentUser } from "@/lib/auth/current-user-context";
import { TaskDetailHeader } from "./task-detail-header";
import { TaskDetailActions } from "./task-detail-actions";
import { TaskProperties } from "./task-properties";
import { TaskLabels } from "./task-labels";
import { SubtasksTable } from "./subtasks-table";
import { CommentsSection } from "./comments-section";
import { DetailsPanel } from "./details-panel";
import { UpdatesPanel } from "./updates-panel";
import type { ApiTaskDetail } from "@/lib/api/tasks";
import { TaskResources } from "./resources-modal";
import { TaskBreadcrumb } from "./task-breadcrumb";

export function TaskDetailClient({
  initialTask,
  taskId,
}: {
  initialTask: ApiTaskDetail;
  taskId: string;
}) {
  const { data: task } = useTaskDetail(taskId, initialTask);
  const panelOpen = useTaskPanelStore((s) => s.open);
  const currentUser = useCurrentUser();
  if (!task) return null;

  const isReporter = task.reporter.id === currentUser.id;
  const isSubtask = task.parentTaskId !== null;
  const isProjectTask = task.projectId !== null;

  const actions = (
    <TaskDetailActions
      task={task}
      isReporter={isReporter}
      isSubtask={isSubtask}
      isProjectTask={isProjectTask}
    />
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <TaskBreadcrumb task={task} />

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <TaskDetailHeader task={task} isReporter={isReporter} />
            {!panelOpen && actions}
          </div>

          {!isSubtask && (
            <TaskProperties dueDateEnd={task.dueDateEnd} teams={task.teams} />
          )}
          {!isSubtask && (
            <TaskLabels
              labels={task.labels}
              editable={isReporter}
              taskId={task.id}
            />
          )}
          {!isSubtask && (
            <TaskResources
              taskId={task.id}
              attachments={task.attachments}
              editable={isReporter}
            />
          )}
          {!isSubtask && !isProjectTask && (
            <SubtasksTable
              parentId={task.id}
              subtasks={task.subtasks}
              isReporter={isReporter}
            />
          )}
          <CommentsSection
            taskId={task.id}
            isReporter={isReporter}
            isLocked={task.isLocked}
          />
        </div>

        {panelOpen && (
          <div className="w-72 shrink-0 sticky top-6">
            <div className="flex justify-end gap-2 mb-4">{actions}</div>
            <DetailsPanel
              task={task}
              isReporter={isReporter}
              isSubtask={isSubtask}
              isProjectTask={isProjectTask}
            />
            {!isSubtask && <UpdatesPanel activities={task.activities} />}
          </div>
        )}
      </div>
    </div>
  );
}