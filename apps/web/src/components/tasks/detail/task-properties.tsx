import { Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ApiUser } from '@/lib/api/tasks';

export function TaskProperties({ assignee, dueDateEnd }: { assignee: ApiUser | null; dueDateEnd: string | null }) {
  if (!assignee && !dueDateEnd) return null;
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm text-gray-500 w-24 shrink-0">Properties</span>
      <div className="flex items-center gap-2">
        {assignee && (
          <span className="flex items-center gap-1.5 border rounded-full pl-1 pr-2.5 py-1 text-sm">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px] text-white" style={{ backgroundColor: assignee.avatarColor ?? '#9ca3af' }}>
                {assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {assignee.name}
          </span>
        )}
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