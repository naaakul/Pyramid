import { Calendar, Tag } from 'lucide-react';
import { PriorityBadge } from './priority-badge';
import { MembersCell } from './members-cell';
import type { ApiTask } from '@/lib/api/tasks';
import type { FieldKey } from '@/store/board-fields-store';

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

export interface ColumnDef {
  key: string;
  label: string;
  width: string;
  render: (task: ApiTask) => React.ReactNode;
}

export const COLUMN_DEFS: ColumnDef[] = [
  { key: 'priority', label: 'Priority', width: '110px', render: (t) => <PriorityBadge priority={t.priority} /> },
  { key: 'members', label: 'Members', width: '80px', render: (t) => <MembersCell assignees={t.assignees} /> },
  {
    key: 'dueDate',
    label: 'Due Date',
    width: '130px',
    render: (t) => <span className="text-gray-600 text-sm">{formatDate(t.dueDateEnd)}</span>,
  },
  {
    key: 'labels',
    label: 'Labels',
    width: '180px',
    render: (t) =>
      t.labels.length === 0 ? (
        <span className="text-gray-300 text-sm">—</span>
      ) : (
        <div className="flex flex-wrap gap-1">
          {t.labels.map(({ label }) => (
            <span key={label.id} className="flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
              <Tag size={10} /> {label.name}
            </span>
          ))}
        </div>
      ),
  },
  {
    key: 'status',
    label: 'Status',
    width: '110px',
    render: () => <span className="text-gray-400 text-sm">—</span>,
  },
  {
    key: 'reporter',
    label: 'Reporter',
    width: '130px',
    render: () => <span className="text-gray-400 text-sm">—</span>,
  },
];

const FIELD_TO_COLUMN: Record<FieldKey, string> = {
  priority: 'priority',
  members: 'members',
  members2: 'members',
  dueDate: 'dueDate',
  labels: 'labels',
  status: 'status',
  reporter: 'reporter',
};

export function getVisibleColumns(visible: Record<FieldKey, boolean>): ColumnDef[] {
  const activeKeys = new Set(
    (Object.keys(visible) as FieldKey[])
      .filter((k) => visible[k])
      .map((k) => FIELD_TO_COLUMN[k]),
  );
  return COLUMN_DEFS.filter((col) => activeKeys.has(col.key));
}