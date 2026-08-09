import { MoreHorizontal, Calendar, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MockTask } from '@/lib/mock-tasks';

export function TaskCard({ task }: { task: MockTask }) {
  return (
    <Card className="p-3 gap-2 shadow-none border-gray-200">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium">{task.title}</p>
        <DropdownMenu>
          <DropdownMenuTrigger className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px] bg-gradient-to-br from-pink-400 to-purple-500 text-white">
              {task.assignee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600">{task.assignee.name}</span>
        </div>
        {task.dueDate && (
          <Badge variant="outline" className="gap-1 text-red-500 border-red-200 bg-red-50 text-[11px] px-1.5 py-0">
            <Calendar size={11} />
            {task.dueDate}
          </Badge>
        )}
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="gap-1 text-[11px] px-1.5 py-0 font-normal text-gray-600 bg-gray-100">
              <Tag size={10} />
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}