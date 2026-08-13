"use client";

import { Bell, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useMyInvites, useAcceptInvite } from "@/hooks/use-invites";

export function NotificationBell({
  type = "task" as "task" | "project",
}: {
  type?: "task" | "project";
}) {
  const { data: invites } = useMyInvites(type);
  const acceptInvite = useAcceptInvite();
  const count = invites?.length ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative w-9 h-9 border rounded-md flex items-center justify-center text-ink-600 hover:bg-ink-50">
          <Bell size={16} />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-2">
        <div className="text-sm font-medium px-1 mb-1">
          {type === "task" ? "Task Requests" : "Project Requests"}
        </div>
        {count === 0 && (
          <div className="text-xs text-ink-400 px-1 py-3">
            No pending requests
          </div>
        )}
        {(invites ?? []).map((invite) => (
          <div
            key={invite.id}
            className="flex items-center justify-between px-1 py-2 border-b last:border-b-0"
          >
            <div className="text-sm">
              <div className="font-medium">
                {type === "task" ? invite.task?.title : invite.project?.name}
              </div>
              <div className="text-xs text-ink-400">
                from {invite.invitedBy.name}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                acceptInvite.mutate(invite.id, {
                  onSuccess: () => toast.success("Joined"),
                })
              }
            >
              <Check size={13} className="mr-1" /> Accept
            </Button>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
