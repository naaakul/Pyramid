import { KanbanColumn } from './kanban-column';
import { MOCK_COLUMNS } from '@/lib/mock-tasks';

export function KanbanBoard() {
  return (
    <div className="flex gap-4 overflow-x-auto p-6 pt-0">
      {MOCK_COLUMNS.map((column) => <KanbanColumn key={column.id} column={column} />)}
    </div>
  );
}