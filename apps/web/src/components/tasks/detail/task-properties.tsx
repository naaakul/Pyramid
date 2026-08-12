import { Calendar } from 'lucide-react';
import type { ApiTeam } from '@/lib/api/tasks';

export function TaskProperties({ dueDateEnd, teams }: { assignee?: unknown; dueDateEnd: string | null; teams: { team: ApiTeam }[] }) {
  if (teams.length === 0 && !dueDateEnd) return null;
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm text-ink-500 w-24 shrink-0">Properties</span>
      <div className="flex items-center gap-2">
        {teams.map(({ team }) => (
          <span key={team.id} className="text-sm border rounded-full px-2.5 py-1">{team.name}</span>
        ))}
        {dueDateEnd && (
          <span className="flex items-center gap-1.5 border border-red-200 bg-red-50 text-red-500 rounded-full px-2.5 py-1 text-sm">
            <Calendar size={13} />
            {new Date(dueDateEnd).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
          </span>
        )}
      </div>
    </div>
  );
}