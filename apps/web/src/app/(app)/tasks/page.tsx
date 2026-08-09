import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/tasks/board/kanban-board';
import { TaskListView } from '@/components/tasks/list/task-list';
import { FieldsPopover } from '@/components/tasks/fields-popover';

export default function TasksPage({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const view = searchParams.view === 'list' ? 'list' : 'board';

  return (
    <div>
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h1 className="text-lg font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><Search size={16} /></Button>
          <FieldsPopover />
          <Button variant="outline" size="icon"><SlidersHorizontal size={16} /></Button>
          <Button size="sm" className="bg-black text-white hover:bg-gray-800">+ Add Task</Button>
        </div>
      </div>
      {view === 'list' ? <TaskListView /> : <KanbanBoard />}
    </div>
  );
}