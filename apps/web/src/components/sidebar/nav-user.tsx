import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function NavUser({ user }: { user: { name: string; avatarColor: string | null } }) {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <a href="/settings/profile">
              <Avatar className="h-6 w-6 rounded-full">
                <AvatarFallback
                  className="rounded-full text-white text-xs"
                  style={{ backgroundColor: user.avatarColor ?? '#94a3b8' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}