'use client';

import { useState } from 'react';
import { Eye, Share2, MoreHorizontal, PanelRight } from 'lucide-react';
import { useUpdateTask } from '@/hooks/use-tasks';
import { useTaskPanelStore } from '@/store/task-panel-store';
import { LockButton } from './lock-button';

export function TaskDetailHeader({
  taskId,
  title,
  description,
  watcherCount,
  isLocked,
  isReporter,
}: {
  taskId: string;
  title: string;
  description: string | null;
  watcherCount: number;
  isLocked: boolean;
  isReporter: boolean;
}) {
  const updateTask = useUpdateTask(taskId);
  const togglePanel = useTaskPanelStore((s) => s.toggle);
  const [localTitle, setLocalTitle] = useState(title);
  const [localDesc, setLocalDesc] = useState(description ?? '');

  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        {isReporter ? (
          <>
            <input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={() => localTitle !== title && updateTask.mutate({ title: localTitle })}
              className="text-xl font-semibold w-full outline-none focus:bg-ink-50 rounded px-1 -mx-1"
            />
            <textarea
              value={localDesc}
              onChange={(e) => setLocalDesc(e.target.value)}
              onBlur={() => localDesc !== (description ?? '') && updateTask.mutate({ description: localDesc })}
              rows={2}
              placeholder="Add a description..."
              className="text-sm text-ink-500 mt-1 max-w-xl w-full outline-none resize-none focus:bg-ink-50 rounded px-1 -mx-1"
            />
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">{title}</h1>
            {description && <p className="text-sm text-ink-500 mt-1 max-w-xl">{description}</p>}
          </>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isReporter && <LockButton taskId={taskId} isLocked={isLocked} />}
        <button className="h-8 px-2 border rounded-md flex items-center gap-1 text-ink-500 hover:bg-ink-50 text-xs">
          <Eye size={14} /> {watcherCount}
        </button>
        {isReporter && (
          <>
            <button className="w-8 h-8 border rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-50"><Share2 size={14} /></button>
            <button className="w-8 h-8 border rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-50"><MoreHorizontal size={14} /></button>
          </>
        )}
        <button onClick={togglePanel} className="w-8 h-8 bg-ink-100 rounded-md flex items-center justify-center text-ink-600 hover:bg-ink-100/70">
          <PanelRight size={14} />
        </button>
      </div>
    </div>
  );
}