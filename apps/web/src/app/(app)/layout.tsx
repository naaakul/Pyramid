import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/api/auth";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BreadcrumbSlot } from "@/components/layout/breadcrumb-slot";
import { TaskComposerModal } from "@/components/tasks/task-composer-modal";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";
import  AuthenticatedLayout  from "@/components/auth/authenticated-layout";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const user = await getCurrentUser(cookieStore.toString());
  if (!user) redirect("/login");

  return (
    <AuthenticatedLayout>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 px-4 border-b border-ink-border pl-2">
            <SidebarTrigger className="text-ink-text hover:text-ink-700 hover:bg-ink-bg" />
            <BreadcrumbSlot />
          </header>
          <div className="flex-1">{children}</div>
          <TaskComposerModal />
          <ProjectCreateModal />
        </SidebarInset>
      </SidebarProvider>
    </AuthenticatedLayout>
  );
}
