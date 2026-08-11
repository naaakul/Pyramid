"use client";

import { Calendar, Tag, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  useBoardFieldsStore,
  isMembersVisible,
} from "@/store/board-fields-store";
import type { ApiTask } from "@/lib/api/tasks";
import { PriorityBadge } from "../shared/priority-badge";
import Link from "next/link";

export function TaskCard({ task }: { task: ApiTask }) {
  const { visible } = useBoardFieldsStore();
  const assignee = task.assignees[0]?.user;

  return (
    <Link href={`/tasks/${task.id}`} className="block">
      <Card className="p-3 pt-1.5 gap-2 shadow-none border-ink-border">
        <div className="flex items-start justify-between ">
          <p className="text-sm font-medium text-ink-text">{task.title}</p>
          <MoreHorizontal size={16} className="text-ink-sec shrink-0" />
        </div>

        {(isMembersVisible(visible) || visible.dueDate) && (
          <div className="flex items-center justify-between">
            {isMembersVisible(visible) && assignee && (
              <div className="flex items-center gap-1.5">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[10px] bg-gradient-to-br from-ink-400 to-ink-700 text-white">
                    {assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-ink-sec">{assignee.name}</span>
              </div>
            )}
            {visible.dueDate && task.dueDateEnd && (
              <Badge
                variant="outline"
                className="gap-1 text-red-500 border-0 bg-red-500/10 text-[11px] px-1.5 py-0"
              >
                <Calendar size={11} />
                {new Date(task.dueDateEnd).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                })}
              </Badge>
            )}
          </div>
        )}

        {/* {visible.priority && <PriorityBadge priority={task.priority} />} */}


        {visible.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
        {task.labels.map(({ label }) => (
          <Badge key={label.id} variant="secondary">
          <Tag size={10} />
          <p className="mb-0.5">
          {label.name}
          </p>
            </Badge>
          ))}
        </div>
      )}
      </Card>
    </Link>
  );
}
