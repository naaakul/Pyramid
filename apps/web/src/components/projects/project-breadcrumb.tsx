'use client';
import { useSetBreadcrumb } from '@/hooks/use-set-breadcrumb';
import { useSetActiveSection } from '@/hooks/use-set-active-section';

export function ProjectBreadcrumb({ name }: { name: string }) {
  useSetActiveSection('projects');
  useSetBreadcrumb([{ label: 'Projects', href: '/projects' }, { label: name }]);
  return null;
}