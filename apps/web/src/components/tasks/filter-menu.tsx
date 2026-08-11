'use client';

import {
  Circle, Signal, Users2, CalendarDays, UsersRound, Tag, UserCircle2, Check, Filter as FilterIcon, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useStatuses, useWorkspaceMembers, useLabels, useTeams } from '@/hooks/use-tasks';
import { useTaskFiltersStore, activeFilterCount } from '@/store/task-filters-store';

const PRIORITY_OPTIONS = ['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'];

export function FilterMenu() {
  const { filters, toggleFilter, clearAll } = useTaskFiltersStore();
  const { data: statuses } = useStatuses();
  const { data: members } = useWorkspaceMembers();
  const { data: labels } = useLabels();
  const { data: teams } = useTeams();
  const count = activeFilterCount(filters);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='border-ink-border text-ink-text hover:bg-ink-bg hover:text-none'>
        <Button variant="outline" size="icon" className={count > 0 ? 'border-black' : ''}>
          <FilterIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Circle size={14} className="mr-2" /> Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {(statuses ?? []).map((s) => (
              <DropdownMenuItem key={s.id} onClick={() => toggleFilter('statusId', s.id)} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /> {s.name}
                </span>
                {filters.statusId === s.id && <Check size={14} />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Signal size={14} className="mr-2" /> Priority</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {PRIORITY_OPTIONS.map((p) => (
              <DropdownMenuItem key={p} onClick={() => toggleFilter('priority', p)} className="flex items-center justify-between">
                {p.replace('_', ' ')}
                {filters.priority === p && <Check size={14} />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Users2 size={14} className="mr-2" /> Members</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {(members ?? []).length === 0 && <div className="px-2 py-1.5 text-xs text-gray-400">No members</div>}
            {(members ?? []).map((m) => (
              <DropdownMenuItem key={m.id} onClick={() => toggleFilter('assigneeId', m.id)} className="flex items-center justify-between">
                {m.name}
                {filters.assigneeId === m.id && <Check size={14} />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger><CalendarDays size={14} className="mr-2" /> Due Date</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => toggleFilter('dueDate', 'overdue')} className="flex items-center justify-between">
              Overdue {filters.dueDate === 'overdue' && <Check size={14} />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleFilter('dueDate', 'no_date')} className="flex items-center justify-between">
              No due date {filters.dueDate === 'no_date' && <Check size={14} />}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger><UsersRound size={14} className="mr-2" /> Teams</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {(teams ?? []).length === 0 ? (
              <div className="px-2 py-1.5 text-xs text-gray-400">No teams yet</div>
            ) : (
              teams!.map((t) => <DropdownMenuItem key={t.id}>{t.name}</DropdownMenuItem>)
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Tag size={14} className="mr-2" /> Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {(labels ?? []).length === 0 && <div className="px-2 py-1.5 text-xs text-gray-400">No labels yet</div>}
            {(labels ?? []).map((l) => (
              <DropdownMenuItem key={l.id} onClick={() => toggleFilter('labelId', l.id)} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} /> {l.name}
                </span>
                {filters.labelId === l.id && <Check size={14} />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger><UserCircle2 size={14} className="mr-2" /> Reporter</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {(members ?? []).map((m) => (
              <DropdownMenuItem key={m.id} onClick={() => toggleFilter('reporterId', m.id)} className="flex items-center justify-between">
                {m.name}
                {filters.reporterId === m.id && <Check size={14} />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {count > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearAll} className="text-red-600 flex items-center gap-2">
              <X size={14} /> Clear filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}