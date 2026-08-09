"use client";

import { useState } from "react";
import { Lock, Eye, Share2, MoreHorizontal, PanelRight } from "lucide-react";
import { useUpdateTask } from "@/hooks/use-tasks";

export function TaskDetailHeader({
  taskId,
  title,
  description,
  watcherCount,
}: {
  taskId: string;
  title: string;
  description: string | null;
  watcherCount: number;
}) {
  const updateTask = useUpdateTask(taskId);
  const [localTitle, setLocalTitle] = useState(title);
  const [localDesc, setLocalDesc] = useState(description ?? "");

  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <input
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          onBlur={() =>
            localTitle !== title && updateTask.mutate({ title: localTitle })
          }
          className="text-xl font-semibold w-full outline-none focus:bg-gray-50 rounded px-1 -mx-1"
        />
        <textarea
          value={localDesc}
          onChange={(e) => setLocalDesc(e.target.value)}
          onBlur={() =>
            localDesc !== (description ?? "") &&
            updateTask.mutate({ description: localDesc })
          }
          rows={2}
          placeholder="Add a description..."
          className="text-sm text-gray-500 mt-1 max-w-xl w-full outline-none resize-none focus:bg-gray-50 rounded px-1 -mx-1"
        />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button className="w-8 h-8 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50">
          <Lock size={14} />
        </button>
        <button className="h-8 px-2 border rounded-md flex items-center gap-1 text-gray-500 hover:bg-gray-50 text-xs">
          <Eye size={14} /> {watcherCount}
        </button>
        <button className="w-8 h-8 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50">
          <Share2 size={14} />
        </button>
        <button className="w-8 h-8 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50">
          <MoreHorizontal size={14} />
        </button>
        <button className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-200">
          <PanelRight size={14} />
        </button>
      </div>
    </div>
  );
}
