'use client';

import { useState } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './search-bar';
import { FieldsPopover } from './fields-popover';
import { FilterMenu } from './filter-menu';
import { NotificationBell } from './notification-bell';
import { KanbanBoard } from './board/kanban-board';
import { TaskListView } from './list/task-list';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTaskFiltersStore } from '@/store/task-filters-store';
import { useTaskComposerStore } from '@/store/task-composer-store';
import { useProject } from '@/hooks/use-projects';
import { useCurrentUser } from '@/lib/auth/current-user-context';
import type { TaskQuery } from '@/lib/api/tasks';
import { useSetActiveSection } from '@/hooks/use-set-active-section';

export function TasksToolbar({ initialView, projectId }: { initialView: 'list' | 'board'; projectId?: string }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const filters = useTaskFiltersStore((s) => s.filters);
  const openTask = useTaskComposerStore((s) => s.openTask);
  const currentUser = useCurrentUser();
  const { data: project } = useProject(projectId ?? '');
  useSetActiveSection('tasks');

  const canCreateTask = !projectId || project?.leadId === currentUser.id;

  const query: TaskQuery = { search: debouncedSearch, ...filters, ...(projectId && { projectId }) };

  return (
    <div>
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h1 className="text-lg font-semibold text-ink-900">Tasks</h1>
        <div className="flex items-center gap-2">
          <SearchBar value={search} onChange={setSearch} />
          <FieldsPopover />
          <FilterMenu />
          <NotificationBell type="task" />
          {canCreateTask && (
            <Button size="default" className="bg-ink-900 text-white hover:bg-ink-700" onClick={() => openTask({ projectId })}>
              <Plus/> Add Task
            </Button>
          )}
        </div>
      </div>
      {initialView === 'list' ? (
        <TaskListView query={query} projectId={projectId} canCreateTask={canCreateTask} />
      ) : (
        <KanbanBoard query={query} projectId={projectId} canCreateTask={canCreateTask} />
      )}
    </div>
  );
}