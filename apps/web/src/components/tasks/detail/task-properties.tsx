import { Calendar } from "lucide-react";
import type { ApiTeam } from "@/lib/api/tasks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function TaskProperties({
  dueDateEnd,
  teams,
}: {
  assignee?: unknown;
  dueDateEnd: string | null;
  teams: { team: ApiTeam }[];
}) {
  if (teams.length === 0 && !dueDateEnd) return null;
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm text-ink-500 w-24 shrink-0">Properties</span>
      <div className="flex items-center gap-2">
        {teams.map(({ team }) => (
          <div className="flex items-center ">
            <Avatar className="h-6 w-6 after:border-none">
              <AvatarFallback className="text-[10px] text-ink-500 bg-ink-100">
                {team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              key={team.id}
              className="text-sm rounded-full px-2.5 py-1 font-medium text-ink-900"
            >
              {team.name.charAt(0).toUpperCase() + team.name.slice(1)}
            </span>
          </div>
        ))}
        {dueDateEnd && (
          <Badge
            className="gap-1 text-red-500 border-0 bg-red-500/10 text-[11px] px-1.5 py-0 ml-auto"
          >
            <Calendar size={11} />
            {new Date(dueDateEnd).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            })}
          </Badge>
        )}
      </div>
    </div>
  );
}
