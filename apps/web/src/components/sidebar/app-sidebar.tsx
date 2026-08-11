import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavMain } from "./nav-main";
import { CurrentUser } from "@/lib/api/auth";

export function AppSidebar({
  user,
}: {
  user: CurrentUser;
  workspaceName?: string;
}) {
  return (
    <Sidebar collapsible="icon" className="border-ink-border">
      <SidebarHeader className="bg-ink-bg">
        <WorkspaceSwitcher user={user} />
      </SidebarHeader>
      <SidebarContent className="bg-ink-bg">
        <NavMain />
      </SidebarContent>
      <SidebarRail className="hover:after:bg-ink-border" />
    </Sidebar>
  );
}
