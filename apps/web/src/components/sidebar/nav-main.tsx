'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FolderKanban } from 'lucide-react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useActiveSectionStore } from '@/store/active-section-store';

const NAV_ITEMS = [
  { href: '/tasks', label: 'Tasks', icon: LayoutGrid, section: 'tasks' as const },
  { href: '/projects', label: 'Projects', icon: FolderKanban, section: 'projects' as const },
];

export function NavMain() {
  const pathname = usePathname();
  const override = useActiveSectionStore((s) => s.section);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className='text-ink-900'>Workspace</SidebarGroupLabel>
      <SidebarMenu>
        {NAV_ITEMS.map(({ href, label, icon: Icon, section }) => {
          const isActive = override ? override === section : pathname.startsWith(href);
          return (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={href} ><Icon /><span>{label}</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}