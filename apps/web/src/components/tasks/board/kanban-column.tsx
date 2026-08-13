"use client";
import { GripVertical, Plus, MoreHorizontal } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./task-card";
import type { ApiStatus, ApiTask } from "@/lib/api/tasks";
import { useTaskComposerStore } from "@/store/task-composer-store";

export function KanbanColumn({
  status,
  tasks,
  projectId,
  canCreateTask = true,
  isOverlay = false,
}: {
  status: ApiStatus;
  tasks: ApiTask[];
  projectId?: string;
  canCreateTask?: boolean;
  isOverlay?: boolean;
}) {
  const openTask = useTaskComposerStore((s) => s.openTask);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: status.id,
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`w-[85vw] max-w-72 shrink-0 md:w-auto md:max-w-none md:flex-1 md:min-w-0 flex flex-col h-fit bg-ink-bg border border-ink-border rounded-lg ${
        isDragging ? "opacity-40" : ""
      } ${isOverlay ? "shadow-lg scale-105 rotate-1 w-72" : ""}`}
    >
      <div className="flex items-center justify-between p-2 pb-0">
        <div className="flex items-center gap-1.5 text-sm font-medium text-ink-900">
          <button
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none text-ink-500 hover:text-ink-900"
            aria-label={`Reorder ${status.name} column`}
          >
            <GripVertical size={14} />
          </button>
          {status.name}
        </div>
        {canCreateTask && (
          <div className="flex items-center gap-1 text-ink-900">
            <button
              onClick={() => openTask({ statusId: status.id, projectId })}
              className="hover:text-ink-600"
            >
              <Plus size={16} />
            </button>
            <button className="hover:text-ink-600">
              <MoreHorizontal size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 bg-ink-50 rounded-lg p-2 flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {canCreateTask && (
          <button
            onClick={() => openTask({ statusId: status.id, projectId })}
            className="text-sm text-ink-900 hover:text-ink-700 flex items-center gap-1 px-1 py-1 ml-2"
          >
            <Plus size={14} /> Add Task
          </button>
        )}
      </div>
    </div>
  );
}
