"use client";
import { Lock, LockOpen } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTask } from "@/hooks/use-tasks";

export function LockButton({
  taskId,
  isLocked,
}: {
  taskId: string;
  isLocked: boolean;
}) {
  const updateTask = useUpdateTask(taskId);

  function toggle() {
    updateTask.mutate({ isLocked: !isLocked } as never, {
      onSuccess: () =>
        toast(
          isLocked
            ? "Task unlocked — comments are enabled."
            : "Task locked — comments are disabled.",
        ),
    });
  }

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 border rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-50"
    >
      {isLocked ? (
        <Lock size={14} className="text-red-500" />
      ) : (
        <LockOpen size={14} />
      )}
    </button>
  );
}
