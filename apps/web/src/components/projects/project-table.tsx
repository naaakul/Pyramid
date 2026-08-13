'use client';

import { Plus } from 'lucide-react';
import { ProjectRow, PROJECT_GRID } from './project-row';
import { useProjects } from '@/hooks/use-projects';
import { useProjectComposerStore } from '@/store/project-composer-store';

export function ProjectTable({ search }: { search?: string }) {
  const { data: projects, isLoading, error } = useProjects(search);
  const open = useProjectComposerStore((s) => s.open);

  if (isLoading) return <div className="px-6 text-sm text-ink-500">Loading...</div>;
  if (error) return <div className="px-6 text-sm text-red-500">Failed to load projects: {(error as Error).message}</div>;

  return (
    <div className="px-6">
      <div className="border rounded-lg overflow-hidden">
        <div className={`${PROJECT_GRID} px-4 py-2 bg-ink-50 text-xs font-medium text-ink-500 border-b`}>
          <span>Projects</span><span>Priority</span><span>Lead</span><span>Due Date</span>
          <span className="justify-self-end">Actions</span>
        </div>
        {(projects ?? []).map((project) => <ProjectRow key={project.id} project={project} />)}
        <button onClick={open} className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700 px-4 py-2.5 w-full text-left">
          <Plus size={14} /> Add Projects
        </button>
      </div>
    </div>
  );
}