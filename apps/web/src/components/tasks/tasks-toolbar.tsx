"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./search-bar";
import { FieldsPopover } from "./fields-popover";
import { FilterMenu } from "./filter-menu";
import { KanbanBoard } from "./board/kanban-board";
import { TaskListView } from "./list/task-list";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useTaskFiltersStore } from "@/store/task-filters-store";
import type { TaskQuery } from "@/lib/api/tasks";
import { Plus } from "lucide-react";
import { NotificationBell } from "./notification-bell";

export function TasksToolbar({
  initialView,
  projectId,
}: {
  initialView: "list" | "board";
  projectId?: string;
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const filters = useTaskFiltersStore((s) => s.filters);

  const query: TaskQuery = {
    search: debouncedSearch,
    ...filters,
    ...(projectId && { projectId }),
  };

  return (
    <div>
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h1 className="text-lg font-semibold text-ink-text">Tasks</h1>
        <div className="flex items-center gap-2">
          <SearchBar value={search} onChange={setSearch} />
          <FieldsPopover />
          <FilterMenu />
          <NotificationBell />
          <Button className="bg-ink-text text-white hover:bg-ink-700 gap-0">
            <Plus />
            <p className="mb-0.5">Add Task</p>
          </Button>
        </div>
      </div>
      {initialView === "list" ? (
        <TaskListView query={query} />
      ) : (
        <KanbanBoard query={query} />
      )}
    </div>
  );
}
