'use client';
import { useState } from 'react';
import { Check, Users2, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTeams, useCreateTeam, useToggleTaskTeam } from '@/hooks/use-tasks';
import type { ApiTeam } from '@/lib/api/tasks';

export function TeamSelect({ taskId, current }: { taskId: string; current: { team: ApiTeam }[] }) {
  const { data: teams } = useTeams();
  const createTeam = useCreateTeam();
  const { add, remove } = useToggleTaskTeam(taskId);
  const [name, setName] = useState('');
  const currentIds = new Set(current.map((c) => c.team.id));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700">
          <Users2 size={14} />
          {current.length > 0 ? current.map((c) => c.team.name).join(', ') : 'Add team'}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1 border-ink-border">
        {(teams ?? []).map((team) => {
          const checked = currentIds.has(team.id);
          return (
            <button
              key={team.id}
              onClick={() => (checked ? remove.mutate(team.id) : add.mutate(team.id))}
              className="flex items-center text-ink-500 justify-between w-full px-2 py-1.5 text-sm bg-ink-100 hover:bg-ink-50 rounded-sm"
            >
              {team.name}
              {checked && <Check size={14} className='text-ink-500' />}
            </button>
          );
        })}
        <div className="flex items-center gap-1 mt-1 pt-1 px-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim()) {
                createTeam.mutate(name);
                setName('');
              }
            }}
            placeholder="New team..."
            className="flex-1 text-sm px-1 py-1 outline-none placeholder:text-ink-sec text-ink-500"
          />
          <button onClick={() => name.trim() && createTeam.mutate(name)} className="text-ink-400 hover:text-ink-600">
            <Plus size={14} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}