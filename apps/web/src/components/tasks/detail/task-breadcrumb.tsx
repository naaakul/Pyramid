'use client';
import { useSetBreadcrumb } from '@/hooks/use-set-breadcrumb';
import { useSetActiveSection } from '@/hooks/use-set-active-section';
import type { ApiTaskDetail } from '@/lib/api/tasks';

export function TaskBreadcrumb({ task }: { task: ApiTaskDetail }) {
  useSetActiveSection(task.project ? 'projects' : 'tasks');

  const crumbs = task.project
    ? [
        { label: 'Projects', href: '/projects' },
        { label: task.project.name, href: `/projects/${task.project.id}` },
        { label: task.title },
      ]
    : task.parentTask
    ? [{ label: 'Tasks', href: '/tasks' }, { label: task.parentTask.title, href: `/tasks/${task.parentTask.id}` }, { label: task.title }]
    : [{ label: 'Tasks', href: '/tasks' }, { label: task.title }];

  useSetBreadcrumb(crumbs);
  return null;
}