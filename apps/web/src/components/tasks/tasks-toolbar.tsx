'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './search-bar';
import { FieldsPopover } from './fields-popover';
import { KanbanBoard } from './board/kanban-board';
import { TaskListView } from './list/task-list';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export function TasksToolbar({ initialView }: { initialView: 'list' | 'board' }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  return (
    <div>
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h1 className="text-lg font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <SearchBar value={search} onChange={setSearch} />
          <FieldsPopover />
          <Button variant="outline" size="icon"><SlidersHorizontal size={16} /></Button>
          <Button size="sm" className="bg-black text-white hover:bg-gray-800">+ Add Task</Button>
        </div>
      </div>
      {initialView === 'list' ? (
        <TaskListView search={debouncedSearch} />
      ) : (
        <KanbanBoard search={debouncedSearch} />
      )}
    </div>
  );
}