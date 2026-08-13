"use client";

import { useState } from "react";
import { useUpdateTask } from "@/hooks/use-tasks";
import type { ApiTaskDetail } from "@/lib/api/tasks";

export function TaskDetailHeader({
  task,
  isReporter,
}: {
  task: ApiTaskDetail;
  isReporter: boolean;
}) {
  const updateTask = useUpdateTask(task.id);
  const [localTitle, setLocalTitle] = useState(task.title);
  const [localDesc, setLocalDesc] = useState(task.description ?? "");

  return (
    <div className="mb-4">
      {isReporter ? (
        <>
          <input
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={() =>
              localTitle !== task.title &&
              updateTask.mutate({ title: localTitle })
            }
            className="text-xl font-semibold w-full outline-none focus:bg-ink-50 rounded px-1 -mx-1"
          />
          <textarea
            value={localDesc}
            onChange={(e) => setLocalDesc(e.target.value)}
            onBlur={() =>
              localDesc !== (task.description ?? "") &&
              updateTask.mutate({ description: localDesc })
            }
            placeholder="Add a description..."
            className="text-sm text-ink-500 mt-1 w-full outline-none resize-none overflow-hidden rounded px-1 -mx-1 focus:bg-ink-50 field-sizing-content min-h-0"
          />
        </>
      ) : (
        <>
          <h1 className="text-xl font-semibold">{task.title}</h1>
          {task.description && (
            <p className="text-sm text-ink-500 mt-1 max-w-xl">
              {task.description}
            </p>
          )}
        </>
      )}
    </div>
  );
}