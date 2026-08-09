import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { WorkspaceSwitcher } from './workspace-switcher';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

export function AppSidebar({
  user,
  workspaceName = 'Dexter',
}: {
  user: { name: string; avatarColor: string | null };
  workspaceName?: string;
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher name={workspaceName} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <NavUser user={user} />
      <SidebarRail />
    </Sidebar>
  );
}