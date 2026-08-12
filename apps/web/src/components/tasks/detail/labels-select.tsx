'use client';

import { useState } from 'react';
import { Check, Tag, Plus, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLabels, useCreateLabel, useDeleteLabel, useUpdateTask } from '@/hooks/use-tasks';
import type { ApiLabel } from '@/lib/api/tasks';

export function LabelsSelect({ taskId, current }: { taskId: string; current: { label: ApiLabel }[] }) {
  const { data: allLabels } = useLabels();
  const createLabel = useCreateLabel();
  const deleteLabel = useDeleteLabel();
  const updateTask = useUpdateTask(taskId);
  const [newName, setNewName] = useState('');
  const currentIds = new Set(current.map((c) => c.label.id));

  function toggle(labelId: string) {
    const next = currentIds.has(labelId) ? [...currentIds].filter((id) => id !== labelId) : [...currentIds, labelId];
    updateTask.mutate({ labelIds: next } as never);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-600">
          <Tag size={13} /> Add label...
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        {(allLabels ?? []).map((label) => (
          <div key={label.id} className="flex items-center justify-between px-2 py-1.5 text-sm hover:bg-ink-50 rounded">
            <button className="flex-1 text-left flex items-center gap-1.5" onClick={() => toggle(label.id)}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
              {label.name}
              {currentIds.has(label.id) && <Check size={14} className="ml-auto" />}
            </button>
            <button onClick={() => deleteLabel.mutate(label.id)} className="text-ink-400 hover:text-red-500 ml-1">
              <X size={13} />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-1 border-t mt-1 pt-1 px-1">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newName.trim()) {
                createLabel.mutate(newName);
                setNewName('');
              }
            }}
            placeholder="New label..."
            className="flex-1 text-sm px-1 py-1 outline-none"
          />
          <button onClick={() => newName.trim() && createLabel.mutate(newName)} className="text-ink-400 hover:text-ink-600">
            <Plus size={14} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}