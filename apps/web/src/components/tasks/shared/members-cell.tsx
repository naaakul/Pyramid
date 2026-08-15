import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ApiUser } from '@/lib/api/tasks';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function MembersCell({ assignees }: { assignees: { user: ApiUser }[] }) {
  if (assignees.length === 0) {
    return (
      <button className="w-6 h-6 rounded-full border border-dashed border-ink-border flex items-center justify-center text-ink-sec hover:bg-gray-100">
        <Plus size={12} />
      </button>
    );
  }

  const user = assignees[0].user;
  return (
    <Avatar className="h-6 w-6">
      <AvatarFallback
        className="text-[10px] text-white"
        style={{ backgroundColor: user.avatarColor ?? '#9ca3af' }}
      >
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}