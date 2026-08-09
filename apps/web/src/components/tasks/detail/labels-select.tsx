'use client';

import { useState } from 'react';
import { Check, Tag, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLabels, useCreateLabel, useUpdateTask } from '@/hooks/use-tasks';
import type { ApiLabel } from '@/lib/api/tasks';

export function LabelsSelect({ taskId, current }: { taskId: string; current: { label: ApiLabel }[] }) {
  const { data: allLabels } = useLabels();
  const createLabel = useCreateLabel();
  const updateTask = useUpdateTask(taskId);
  const [newName, setNewName] = useState('');
  const currentIds = new Set(current.map((c) => c.label.id));

  function toggle(labelId: string) {
    const next = currentIds.has(labelId)
      ? [...currentIds].filter((id) => id !== labelId)
      : [...currentIds, labelId];
    updateTask.mutate({ labelIds: next } as never);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600">
          <Tag size={13} /> Add label...
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        {(allLabels ?? []).map((label) => (
          <button
            key={label.id}
            onClick={() => toggle(label.id)}
            className="flex items-center justify-between w-full px-2 py-1.5 text-sm hover:bg-gray-50 rounded"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
              {label.name}
            </span>
            {currentIds.has(label.id) && <Check size={14} />}
          </button>
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
          <button onClick={() => newName.trim() && createLabel.mutate(newName)} className="text-gray-400 hover:text-gray-600">
            <Plus size={14} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}