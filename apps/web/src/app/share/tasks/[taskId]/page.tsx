async function fetchPublicTask(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/tasks/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function SharedTaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = await fetchPublicTask(taskId);

  if (!task) {
    return <div className="min-h-screen flex items-center justify-center text-ink-400">No task exist</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-2 text-xs text-ink-400 uppercase tracking-wide">View only</div>
      <h1 className="text-2xl font-semibold mb-2">{task.title}</h1>
      {task.description && <p className="text-ink-600 mb-4">{task.description}</p>}
      <div className="flex items-center gap-2 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.status.color }} />
          {task.status.name}
        </span>
      </div>
    </div>
  );
}