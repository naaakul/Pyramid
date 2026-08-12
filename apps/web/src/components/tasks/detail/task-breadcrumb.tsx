'use client';
import { useSetBreadcrumb } from '@/hooks/use-set-breadcrumb';
import type { ApiTaskDetail } from '@/lib/api/tasks';

export function TaskBreadcrumb({ task }: { task: ApiTaskDetail }) {
  const crumbs = task.parentTask
    ? [{ label: 'Tasks', href: '/tasks' }, { label: task.parentTask.title, href: `/tasks/${task.parentTask.id}` }, { label: task.title }]
    : [{ label: 'Tasks', href: '/tasks' }, { label: task.title }];
  useSetBreadcrumb(crumbs);
  return null;
}