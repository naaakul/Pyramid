'use client';

import { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
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
      <PopoverContent align="start" className="w-64 rounded-xl border border-ink-border bg-white p-3 shadow-lg gap-0">
        <div className="flex flex-wrap gap-2">
          {(allLabels ?? []).map((label) => {
            const selected = currentIds.has(label.id);
            return (
              <button
                type="button"
                key={label.id}
                onClick={() => toggle(label.id)}
                className={`
                  relative
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  px-3
                  pb-0.5
                  text-sm
                  transition-colors
                  bg-ink-bg
                  text-ink-text
                  hover:bg-ink-100
                  ${
                    selected
                      ? 'border-ink-border'
                      : 'border-transparent'
                  }
                `}
              >
                <span className="truncate">{label.name}</span>

                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLabel.mutate(label.id);
                  }}
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-ink-border
                    bg-white
                    text-ink-text
                    hover:border-red-500
                    hover:bg-red-50
                    hover:text-red-500
                  "
                >
                  <X size={9} />
                </span>
              </button>
            );
          })}

          {(allLabels ?? []).length === 0 && (
            <div className="px-1 py-1 text-xs text-ink-400">No labels yet</div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
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
            className="
              h-9
              min-w-0
              flex-1
              rounded-lg
              border
              border-ink-border
              bg-white
              px-3
              text-sm
              outline-none
              focus:border-ink-400
              placeholder:text-ink-sec
            "
          />
          <Button
            type="button"
            size="sm"
            disabled={!newName.trim()}
            onClick={() => {
              if (!newName.trim()) return;
              createLabel.mutate(newName);
              setNewName('');
            }}
            className="h-9 rounded-lg bg-ink-900 px-4 text-white hover:bg-ink-700 disabled:opacity-55"
          >
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}