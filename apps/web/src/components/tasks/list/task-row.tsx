"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "../shared/column-defs";
import type { ApiTask } from "@/lib/api/tasks";

export function TaskRow({
  task,
  columns,
  gridTemplate,
}: {
  task: ApiTask;
  columns: ColumnDef[];
  gridTemplate: string;
}) {
  const dueDateCol = columns.find((c) => c.key === "dueDate");

  return (
    <Link href={`/tasks/${task.id}`} className="block hover:bg-ink-bg">
      <div
        className="hidden md:grid items-center gap-2 p-2.5 px-3.5 border-b text-sm"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        <span className="truncate text-ink-900">{task.title}</span>
        {columns.map((col) => (
          <div key={col.key} className="min-w-0 truncate">
            {col.render(task)}
          </div>
        ))}
        <button
          className="text-ink-sec hover:text-ink-900 justify-self-end"
          onClick={(e) => e.preventDefault()}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="md:hidden flex items-center justify-between gap-3 p-3 border-b text-sm">
        <span className="text-ink-900 truncate">{task.title}</span>
        {dueDateCol && (
          <span className="text-xs text-ink-sec shrink-0">
            {dueDateCol.render(task)}
          </span>
        )}
      </div>
    </Link>
  );
}