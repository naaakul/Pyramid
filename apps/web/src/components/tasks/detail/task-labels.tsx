import { Tag } from 'lucide-react';
import type { ApiLabel } from '@/lib/api/tasks';

export function TaskLabels({ labels }: { labels: { label: ApiLabel }[] }) {
  if (labels.length === 0) return null;
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm text-gray-500 w-24 shrink-0">Labels</span>
      <div className="flex flex-wrap gap-1.5">
        {labels.map(({ label }) => (
          <span key={label.id} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            <Tag size={11} /> {label.name}
          </span>
        ))}
      </div>
    </div>
  );
}