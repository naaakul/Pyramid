import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ApiActivity } from '@/lib/api/tasks';

const ACTIVITY_LABEL: Record<string, (a: ApiActivity) => string> = {
  PRIORITY_CHANGED: (a) => `changed priority from ${a.fromValue ?? 'No priority'} to ${a.toValue}`,
  STATUS_CHANGED: (a) => `changed status`,
  COMMENT_ADDED: () => `posted an update`,
};

export function UpdatesPanel({ activities }: { activities: ApiActivity[] }) {
  return (
    <div className="border rounded-lg p-3">
      <button className="flex items-center gap-1.5 text-sm font-medium text-gray-800 mb-2">
        <ChevronDown size={14} /> Updates
      </button>
      <div className="space-y-3">
        {activities.length === 0 && <p className="text-xs text-gray-400">No activity yet.</p>}
        {activities.map((a) => (
          <div key={a.id} className="flex items-start gap-2 text-xs">
            <Avatar className="h-5 w-5 mt-0.5">
              <AvatarFallback className="text-[9px] text-white" style={{ backgroundColor: a.actor.avatarColor ?? '#9ca3af' }}>
                {a.actor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium text-gray-800">{a.actor.name}</span>{' '}
              <span className="text-gray-500">{(ACTIVITY_LABEL[a.type] ?? (() => a.type))(a)}</span>
              <div className="text-gray-400 mt-0.5">{new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}