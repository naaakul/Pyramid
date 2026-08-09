"use client";

import { MoreHorizontal } from "lucide-react";
import { PriorityBadge } from "../shared/priority-badge";
import { MembersCell } from "../shared/members-cell";
import type { ApiTask } from "@/lib/api/tasks";
import Link from "next/link";

const ROW_GRID =
  "grid grid-cols-[1fr_120px_60px_140px_50px] items-center gap-2";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TaskRow({ task }: { task: ApiTask }) {
  return (
    <Link href={`/tasks/${task.id}`} className="block">
      <div
        className={`${ROW_GRID} px-4 py-3 border-b last:border-b-0 text-sm hover:bg-gray-50`}
      >
        <span className="truncate">{task.title}</span>
        <PriorityBadge priority={task.priority} />
        <MembersCell assignees={task.assignees} />
        <span className="text-gray-600">{formatDate(task.dueDateEnd)}</span>
        <button className="text-gray-400 hover:text-gray-600 justify-self-end">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </Link>
  );
}

export { ROW_GRID };
