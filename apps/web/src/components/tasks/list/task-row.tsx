'use client';

import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import type { ColumnDef } from '../shared/column-defs';
import type { ApiTask } from '@/lib/api/tasks';

export function TaskRow({ task, columns, gridTemplate }: { task: ApiTask; columns: ColumnDef[]; gridTemplate: string }) {
  return (
    <Link href={`/tasks/${task.id}`} className="contents">
      <div
        className="grid items-center gap-2 px-4 py-3 border-b last:border-b-0 text-sm hover:bg-gray-50"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        <span className="truncate">{task.title}</span>
        {columns.map((col) => (
          <div key={col.key}>{col.render(task)}</div>
        ))}
        <button className="text-gray-400 hover:text-gray-600 justify-self-end" onClick={(e) => e.preventDefault()}>
          <MoreHorizontal size={16} />
        </button>
      </div>
    </Link>
  );
}