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

export default async function TaskDetailPage({ params }: { params: { taskId: string } }) {
  const cookieStore = await cookies();
  const task = await fetchTask(params.taskId, cookieStore.toString());
  if (!task) notFound();
  return <TaskDetailClient initialTask={task} taskId={params.taskId} />;
}