"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, PanelRight, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRemoveTask } from "@/hooks/use-tasks";
import { useTaskPanelStore } from "@/store/task-panel-store";
import { LockButton } from "./lock-button";
import { ViewModal } from "./view-modal";
import { ShareButton } from "./share-button";
import type { ApiTaskDetail } from "@/lib/api/tasks";

export function TaskDetailActions({
  task,
  isReporter,
  isSubtask,
  isProjectTask,
}: {
  task: ApiTaskDetail;
  isReporter: boolean;
  isSubtask: boolean;
  isProjectTask: boolean;
}) {
  const router = useRouter();
  const removeTask = useRemoveTask();
  const togglePanel = useTaskPanelStore((s) => s.toggle);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const showViewShare = !isSubtask && !isProjectTask;

  function handleDelete() {
    removeTask.mutate(task.id, {
      onSuccess: () =>
        router.push(
          isSubtask && task.parentTaskId
            ? `/tasks/${task.parentTaskId}`
            : "/tasks",
        ),
    });
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {!isSubtask && isReporter && (
        <LockButton taskId={task.id} isLocked={task.isLocked} />
      )}
      {showViewShare && <ViewModal task={task} isReporter={isReporter} />}
      {showViewShare && isReporter && <ShareButton taskId={task.id} />}
      {isReporter && (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-8 h-8 border rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-50">
            <MoreHorizontal size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600 flex items-center gap-2"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 size={13} /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <button
        onClick={togglePanel}
        className="w-8 h-8 bg-ink-100 rounded-md flex items-center justify-center text-ink-600 hover:bg-ink-100/70"
      >
        <PanelRight size={14} />
      </button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{task.title}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}