import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { TaskDetailClient } from '@/components/tasks/detail/task-detail-client';

async function fetchTask(taskId: string, cookieHeader: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load task');
  return res.json();
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const cookieStore = await cookies();
  const task = await fetchTask(taskId, cookieStore.toString());
  if (!task) notFound();
  return <TaskDetailClient initialTask={task} taskId={taskId} />;
}