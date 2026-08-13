"use client";

import { Plus, Settings } from "lucide-react";
import { CollapsibleSection } from "@/components/shared/collapsible-section";
import { PrioritySelect } from "./priority-select";
import { StatusSelect } from "./status-select";
import { DateRangeSelect } from "./date-range-select";
import { AddMembersModal } from "./add-members-modal";
import { LabelsSelect } from "./labels-select";
import { useUpdateTask } from "@/hooks/use-tasks";
import type { ApiTaskDetail } from "@/lib/api/tasks";
import { TeamSelect } from "./team-select";

export function DetailsPanel({ task, isReporter, isSubtask, isProjectTask }: {
  task: ApiTaskDetail; isReporter: boolean; isSubtask: boolean; isProjectTask: boolean;
}) {
  const updateTask = useUpdateTask(task.id);

  return (
    <div className="border rounded-lg p-3 mb-4">
      <CollapsibleSection title="Details"
        actions={
          isReporter && (
            <div className="flex items-center gap-1 text-ink-400">
              <button className="hover:text-ink-600">
                <Plus size={14} />
              </button>
              <button className="hover:text-ink-600">
                <Settings size={14} />
              </button>
            </div>
          )
        }
      >
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Status</span>
            {isReporter ? (
              <StatusSelect
                value={task.status}
                onChange={(statusId) => updateTask.mutate({ statusId })}
              />
            ) : (
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: task.status.color }}
                />
                {task.status.name}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ink-500">Priority</span>
            <PrioritySelect
              value={task.priority}
              onChange={(priority) =>
                isReporter && updateTask.mutate({ priority })
              }
            />
          </div>

          {!isProjectTask && (
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Members</span>
              {isReporter ? <AddMembersModal taskId={task.id} assignees={task.assignees} /> : <span className="text-ink-700">{task.assignees.length} member{task.assignees.length !== 1 && 's'}</span>}
            </div>
          )}

          {!isSubtask && (
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Dates</span>
              {isReporter ? (
                <DateRangeSelect
                  start={task.dueDateStart}
                  end={task.dueDateEnd}
                  onChange={(field, value) =>
                    updateTask.mutate({ [field]: value })
                  }
                />
              ) : (
                <span className="text-ink-400">
                  {task.dueDateEnd
                    ? new Date(task.dueDateEnd).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })
                    : "—"}
                </span>
              )}
            </div>
          )}

          {!isSubtask && (
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Labels</span>
              {isReporter ? (
                <LabelsSelect taskId={task.id} current={task.labels} />
              ) : (
                <span className="text-ink-400">
                  {task.labels.length || "—"}
                </span>
              )}
            </div>
          )}

          {!isSubtask && (
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Team</span>
              {isReporter ? (
                <TeamSelect taskId={task.id} current={task.teams} />
              ) : (
                <span className="text-ink-400">
                  {task.teams.map((t) => t.team.name).join(", ") || "—"}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-ink-500">Reporter</span>
            <span className="text-ink-700">{task.reporter.name}</span>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
