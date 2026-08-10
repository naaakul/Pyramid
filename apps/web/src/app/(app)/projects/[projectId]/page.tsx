import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { TasksToolbar } from "@/components/tasks/tasks-toolbar";
import { ProjectBreadcrumb } from '@/components/projects/project-breadcrumb';

async function fetchProject(id: string, cookieHeader: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load project");
  return res.json();
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { projectId } = await params;
  const { view: viewParam } = await searchParams;
  const view = viewParam === "list" ? "list" : "board";

  const cookieStore = await cookies();
  const project = await fetchProject(projectId, cookieStore.toString());
  if (!project) notFound();

  return (
    <div>
      <ProjectBreadcrumb name={project.name} />
      <TasksToolbar initialView={view} projectId={projectId} />
    </div>
  );
}
