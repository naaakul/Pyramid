import { TasksToolbar } from '@/components/tasks/tasks-toolbar';

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;

  const view = params.view === 'list' ? 'list' : 'board';

  return <TasksToolbar initialView={view} />;

}