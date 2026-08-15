"use client";

import {
  Circle,
  Signal,
  Users2,
  CalendarDays,
  UsersRound,
  Tag,
  UserCircle2,
  Check,
  Filter as FilterIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  useStatuses,
  useWorkspaceMembers,
  useLabels,
  useTeams,
} from "@/hooks/use-tasks";
import {
  useTaskFiltersStore,
  activeFilterCount,
} from "@/store/task-filters-store";

const PRIORITY_OPTIONS = ["NO_PRIORITY", "URGENT", "HIGH", "MEDIUM", "LOW"];

const subTriggerClass = `
  text-ink-900
  hover:bg-ink-bg
  hover:text-ink-900
  focus:bg-ink-bg
  focus:text-ink-900
  data-[state=open]:bg-ink-bg
  data-[state=open]:text-ink-900
`;

const itemClass = `
  text-ink-900
  hover:bg-ink-bg
  hover:text-ink-900
  focus:bg-ink-bg
  focus:text-ink-900
`;

export function FilterMenu() {
  const { filters, toggleFilter, clearAll } = useTaskFiltersStore();

  const { data: statuses } = useStatuses();
  const { data: members } = useWorkspaceMembers();
  const { data: labels } = useLabels();
  const { data: teams } = useTeams();

  const count = activeFilterCount(filters);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`
            border-ink-border
            text-ink-900
            hover:bg-ink-bg
            hover:text-ink-900
            data-[state=open]:bg-ink-bg
            data-[state=open]:text-ink-900
            ${count > 0 ? "border-black" : ""}
          `}
        >
          <FilterIcon size={16} className="text-ink-900" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 text-ink-900 shadow-ink-100 border border-ink-100 ring-0"
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={subTriggerClass}>
            <Circle size={14} className="mr-2 text-ink-900" />
            Status
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="text-ink-900 border border-ink-100 ring-0">
            {(statuses ?? []).map((s) => (
              <DropdownMenuItem
                key={s.id}
                onSelect={(e) => e.preventDefault()}
                onClick={() => toggleFilter("statusId", s.id)}
                className={`flex items-center justify-between ${itemClass}`}
              >
                <span className="flex items-center gap-1.5 text-ink-900">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.name}
                </span>

                {filters.statusId === s.id && (
                  <Check size={14} className="text-ink-900" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={subTriggerClass}>
            <Signal size={14} className="mr-2 text-ink-900" />
            Priority
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="text-ink-900 border border-ink-100 ring-0">
            {PRIORITY_OPTIONS.map((p) => (
              <DropdownMenuItem
                key={p}
                onSelect={(e) => e.preventDefault()}
                onClick={() => toggleFilter("priority", p)}
                className={`flex items-center justify-between ${itemClass}`}
              >
                <span className="text-ink-900">{p.replace("_", " ")}</span>

                {filters.priority === p && (
                  <Check size={14} className="text-ink-900" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={subTriggerClass}>
            <Users2 size={14} className="mr-2 text-ink-900" />
            Members
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="text-ink-900 border border-ink-100 ring-0">
            {(members ?? []).length === 0 && (
              <div className="px-2 py-1.5 text-xs text-ink-900">No members</div>
            )}

            {(members ?? []).map((m) => (
              <DropdownMenuItem
                key={m.id}
                onSelect={(e) => e.preventDefault()}
                onClick={() => toggleFilter("assigneeId", m.id)}
                className={`flex items-center justify-between ${itemClass}`}
              >
                <span className="text-ink-900">{m.name}</span>

                {filters.assigneeId === m.id && (
                  <Check size={14} className="text-ink-900" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={subTriggerClass}>
            <CalendarDays size={14} className="mr-2 text-ink-900" />
            Due Date
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="text-ink-900 border border-ink-100 ring-0">
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => toggleFilter("dueDate", "overdue")}
              className={`flex items-center justify-between ${itemClass}`}
            >
              <span className="text-ink-900">Overdue</span>

              {filters.dueDate === "overdue" && (
                <Check size={14} className="text-ink-900" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => toggleFilter("dueDate", "no_date")}
              className={`flex items-center justify-between ${itemClass}`}
            >
              <span className="text-ink-900">No due date</span>

              {filters.dueDate === "no_date" && (
                <Check size={14} className="text-ink-900" />
              )}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={subTriggerClass}>
            <UsersRound size={14} className="mr-2 text-ink-900" />
            Teams
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="text-ink-900 border border-ink-100 ring-0">
            {(teams ?? []).length === 0 ? (
              <div className="px-2 py-1.5 text-xs text-ink-900">
                No teams yet
              </div>
            ) : (
              teams!.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onSelect={(e) => e.preventDefault()}
                  className={itemClass}
                >
                  {t.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={subTriggerClass}>
            <Tag size={14} className="mr-2 text-ink-900" />
            Labels
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="text-ink-900 border border-ink-100 ring-0">
            {(labels ?? []).length === 0 && (
              <div className="px-2 py-1.5 text-xs text-ink-900">
                No labels yet
              </div>
            )}

            {(labels ?? []).map((l) => (
              <DropdownMenuItem
                key={l.id}
                onSelect={(e) => e.preventDefault()}
                onClick={() => toggleFilter("labelId", l.id)}
                className={`flex items-center justify-between ${itemClass}`}
              >
                <span className="flex items-center gap-1.5 text-ink-900">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  {l.name}
                </span>

                {filters.labelId === l.id && (
                  <Check size={14} className="text-ink-900" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={subTriggerClass}>
            <UserCircle2 size={14} className="mr-2 text-ink-900" />
            Reporter
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="text-ink-900 border border-ink-100 ring-0">
            {(members ?? []).map((m) => (
              <DropdownMenuItem
                key={m.id}
                onSelect={(e) => e.preventDefault()}
                onClick={() => toggleFilter("reporterId", m.id)}
                className={`flex items-center justify-between ${itemClass}`}
              >
                <span className="text-ink-900">{m.name}</span>

                {filters.reporterId === m.id && (
                  <Check size={14} className="text-ink-900" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {count > 0 && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={clearAll}
              className={`
                flex items-center gap-2
                text-red-600
                hover:bg-ink-bg
                hover:text-ink-900
                focus:bg-ink-bg
                focus:text-ink-900
              `}
            >
              <X size={14} />
              Clear filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
