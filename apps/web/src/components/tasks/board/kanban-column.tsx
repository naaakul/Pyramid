"use client";
import { useState } from "react";
import { GripVertical, Plus, MoreHorizontal } from "lucide-react";
import { TaskCard } from "./task-card";
import { useCreateTask } from "@/hooks/use-tasks";
import type { ApiStatus, ApiTask } from "@/lib/api/tasks";
import { useTaskComposerStore } from "@/store/task-composer-store";

export function KanbanColumn({
  status,
  tasks,
  projectId,
}: {
  status: ApiStatus;
  tasks: ApiTask[];
  projectId?: string;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const createTask = useCreateTask();
  const openTask = useTaskComposerStore((s) => s.openTask);

  function submit() {
    if (!title.trim()) return setAdding(false);
    createTask.mutate({ title, statusId: status.id });
    setTitle("");
    setAdding(false);
  }

  return (
    <div className="w-72 shrink-0 flex flex-col rounded-lg bg-ink-bg border border-ink-border">
      <div className="flex items-center justify-between p-2 pb-0.5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-ink-text">
          <GripVertical size={14} className="text-ink-sec" />
          <p className="mb-0.5">{status.name}</p>
        </div>
        <div className="flex items-center gap-1 text-ink-sec">
          <button
            onClick={() => setAdding(true)}
            className="hover:text-ink-400"
          >
            <Plus size={16} />
          </button>
          <button className="hover:text-ink-400">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2 flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {/* {adding ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={submit}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="text-sm border rounded px-2 py-1.5 outline-none"
            placeholder="Task title..."
          />
        ) : ( */}
        <button
          onClick={() => openTask({ statusId: status.id, projectId })}
          className="..."
        >
          <Plus size={14} /> Add Task
        </button>
        {/* )} */}
      </div>
    </div>
  );
}
