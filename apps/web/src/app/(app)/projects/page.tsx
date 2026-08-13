'use client';

import { useState } from 'react';
import { SlidersHorizontal, Columns3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/tasks/search-bar';
import { ProjectTable } from '@/components/projects/project-table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useProjectComposerStore } from '@/store/project-composer-store';
import { NotificationBell } from '@/components/tasks/notification-bell';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const openComposer = useProjectComposerStore((s) => s.open);

  return (
    <div>
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h1 className="text-lg font-semibold">Projects</h1>
        <div className="flex items-center gap-2">
          <SearchBar value={search} onChange={setSearch} />
          {/* <Button variant="outline" size="sm" disabled className="opacity-50">
            <Columns3 size={16} className="mr-1" /> Fields
          </Button> */}
          {/* <Button variant="outline" size="icon" disabled className="opacity-50">
            <SlidersHorizontal size={16} />
          </Button> */}
          <NotificationBell type="project" />
          <Button size="default" className="bg-ink-900 text-white hover:bg-ink-700" onClick={openComposer}>
            <Plus/> Add Task
          </Button>
        </div>
      </div>
      <ProjectTable search={debouncedSearch} />
    </div>
  );
}