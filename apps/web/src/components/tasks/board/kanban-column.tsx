"use client";
import { useState } from "react";
import { GripVertical, Plus, MoreHorizontal } from "lucide-react";
import { TaskCard } from "./task-card";
import { useCreateTask } from "@/hooks/use-tasks";
import type { ApiStatus, ApiTask } from "@/lib/api/tasks";
import { useTaskComposerStore } from "@/store/task-composer-store";

export function KanbanColumn({ status, tasks, projectId, canCreateTask = true }: {
  status: ApiStatus; tasks: ApiTask[]; projectId?: string; canCreateTask?: boolean;
}) {
  const openTask = useTaskComposerStore((s) => s.openTask);
  return (
    <div className="w-72 shrink-0 flex flex-col">
      <div className="flex items-center justify-between px-1 py-1.5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-ink-700">
          <GripVertical size={14} className="text-ink-400" />
          {status.name}
        </div>
        {canCreateTask && (
          <div className="flex items-center gap-1 text-ink-400">
            <button onClick={() => openTask({ statusId: status.id, projectId })} className="hover:text-ink-600"><Plus size={16} /></button>
            <button className="hover:text-ink-600"><MoreHorizontal size={16} /></button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 bg-ink-50 rounded-lg p-2 flex-1">
        {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        {canCreateTask && (
          <button onClick={() => openTask({ statusId: status.id, projectId })} className="text-sm text-ink-500 hover:text-ink-700 flex items-center gap-1 px-1 py-1">
            <Plus size={14} /> Add Task
          </button>
        )}
      </div>
    </div>
  );
}
