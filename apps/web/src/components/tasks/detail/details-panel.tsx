"use client";

import { ChevronDown, Plus, Settings } from "lucide-react";
import { PrioritySelect } from "./priority-select";
import { StatusSelect } from "./status-select";
import { DateRangeSelect } from "./date-range-select";
import { MembersSelect } from "./members-select";
import { LabelsSelect } from "./labels-select";
import { useUpdateTask } from "@/hooks/use-tasks";
import type { ApiTaskDetail } from "@/lib/api/tasks";

export function DetailsPanel({ task }: { task: ApiTaskDetail }) {
  const updateTask = useUpdateTask(task.id);

  return (
    <div className="border rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
          <ChevronDown size={14} /> Details
        </button>
        <div className="flex items-center gap-1 text-gray-400">
          <button className="hover:text-gray-600">
            <Plus size={14} />
          </button>
          <button className="hover:text-gray-600">
            <Settings size={14} />
          </button>
        </div>
      </div>
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status</span>
          <StatusSelect
            value={task.status}
            onChange={(statusId) => updateTask.mutate({ statusId })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Priority</span>
          <PrioritySelect
            value={task.priority}
            onChange={(priority) => updateTask.mutate({ priority })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Members</span>
          <MembersSelect taskId={task.id} assignees={task.assignees} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Dates</span>
          <DateRangeSelect
            start={task.dueDateStart}
            end={task.dueDateEnd}
            onChange={(field, value) => updateTask.mutate({ [field]: value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Labels</span>
          <LabelsSelect taskId={task.id} current={task.labels} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Teams</span>
          <span className="text-gray-400">—</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Reporter</span>
          <span className="text-gray-700">{task.reporter.name}</span>
        </div>
      </div>
    </div>
  );
}
