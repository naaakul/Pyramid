'use client';

import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { PriorityBadge } from '../tasks/shared/priority-badge';
import { useUpdateProject } from '@/hooks/use-projects';
import type { ApiProject } from '@/lib/api/projects';

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

const GRID = 'grid grid-cols-[1fr_120px_140px_140px_50px] items-center gap-2';

export function ProjectRow({ project }: { project: ApiProject }) {
  return (
    <Link href={`/projects/${project.id}`} className="contents">
      <div className={`${GRID} px-4 py-3 border-b last:border-b-0 text-sm hover:bg-gray-50`}>
        <span className="truncate font-medium">{project.name}</span>
        <PriorityBadge priority={project.priority} />
        <span className="text-gray-600">{project.lead?.name ?? '—'}</span>
        <span className="text-gray-600">{formatDate(project.dueDate)}</span>
        <button className="text-gray-400 hover:text-gray-600 justify-self-end" onClick={(e) => e.preventDefault()}>
          <MoreHorizontal size={16} />
        </button>
      </div>
    </Link>
  );
}

export { GRID as PROJECT_GRID };