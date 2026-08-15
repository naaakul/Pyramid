'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCurrentUser } from '@/lib/auth/current-user-context';
import type { ApiUser } from '@/lib/api/tasks';

export function UserLabel({ user, showAvatar = true }: { user: ApiUser; showAvatar?: boolean }) {
  const currentUser = useCurrentUser();
  const isYou = user.id === currentUser.id;
  return (
    <span className="flex items-center gap-1.5 text-ink-900">
      {showAvatar && (
        <Avatar className="h-5 w-5">
          <AvatarFallback className="text-[10px] text-white" style={{ backgroundColor: user.avatarColor ?? '#9ca3af' }}>
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
      {isYou ? 'You' : user.name}
    </span>
  );
}