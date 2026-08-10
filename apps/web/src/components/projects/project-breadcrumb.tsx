'use client';
import { useSetBreadcrumb } from '@/hooks/use-set-breadcrumb';

export function ProjectBreadcrumb({ name }: { name: string }) {
  useSetBreadcrumb([{ label: 'Projects', href: '/projects' }, { label: name }]);
  return null;
}