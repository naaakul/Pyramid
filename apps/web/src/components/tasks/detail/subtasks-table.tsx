"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Plus, MoreHorizontal } from "lucide-react";
import { PriorityBadge } from "../shared/priority-badge";
import { MembersCell } from "../shared/members-cell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRemoveTask } from "@/hooks/use-tasks";
import { useTaskComposerStore } from "@/store/task-composer-store";
import { useCurrentUser } from "@/lib/auth/current-user-context";
import type { ApiTask } from "@/lib/api/tasks";

const GRID = "grid grid-cols-[1fr_120px_100px_120px_50px] items-center gap-2";

function formatDate(d: string | null) {
  if (!d) return "—";

  return new Date(d).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function SubtasksTable({
  parentId,
  subtasks,
  isReporter,
}: {
  parentId: string;
  subtasks: ApiTask[];
  isReporter: boolean;
}) {
  const [open, setOpen] = useState(true);

  const currentUser = useCurrentUser();
  const removeTask = useRemoveTask();
  const openSubtask = useTaskComposerStore((s) => s.openSubtask);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-ink-900 mb-2"
      >
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "" : "-rotate-90"}`}
        />
        Subtasks
      </button>

      {open && (
        <div className="border rounded-lg overflow-hidden border-ink-border">
          <div
            className={`${GRID} p-3.5 bg-ink-bg text-xs font-medium text-ink-900 border-b`}
          >
            <span>Task</span>
            <span>Priority</span>
            <span>Members</span>
            <span>Due Date</span>
            {isReporter ? (
              <span className="justify-self-end">Actions</span>
            ) : (
              <span />
            )}
          </div>

          {subtasks.map((task) => (
            <Link href={`/tasks/${task.id}`} className="truncate">
              <div
                key={task.id}
                className={`${GRID} p-2.5 px-3.5 border-b text-sm items-center hover:bg-ink-bg`}
              >
                {isReporter ||
                task.assignees.some((a) => a.user.id === currentUser.id) ? (
                  <p>{task.title}</p>
                ) : (
                  <span className="truncate text-ink-400">{task.title}</span>
                )}

                <PriorityBadge priority={task.priority} />

                <MembersCell assignees={task.assignees} />

                <span className="text-ink-600 text-xs">
                  {formatDate(task.dueDateEnd)}
                </span>

                {isReporter ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-ink-400 hover:text-ink-600 justify-self-end">
                      <MoreHorizontal size={16} />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => removeTask.mutate(task.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span />
                )}
              </div>
            </Link>
          ))}

          {isReporter && (
            <button
              onClick={() => openSubtask(parentId)}
              className="flex items-center gap-1.5 text-sm text-ink-900 hover:text-ink-700 p-3 w-full text-left"
            >
              <Plus size={14} />
              Add Subtasks
            </button>
          )}
        </div>
      )}
    </div>
  );
}
