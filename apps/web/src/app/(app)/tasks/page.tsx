import { TasksToolbar } from "@/components/tasks/tasks-toolbar";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: viewParam } = await searchParams;
  const view = viewParam === "list" ? "list" : "board";

  return <TasksToolbar initialView={view} />;
}
