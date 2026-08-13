import { Tag } from "lucide-react";
import { LabelsSelect } from "./labels-select";
import type { ApiLabel } from "@/lib/api/tasks";

export function TaskLabels({
  labels,
  editable,
  taskId,
}: {
  labels: { label: ApiLabel }[];
  editable: boolean;
  taskId: string;
}) {
  if (labels.length === 0 && !editable) return null;
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm text-ink-500 w-24 shrink-0">Labels</span>
      <div className="flex flex-wrap gap-1.5 items-center">
        {labels.map(({ label }) => (
          <span
            key={label.id}
            className="flex items-center gap-1 text-xs bg-ink-100 text-ink-900 rounded-full px-2.5 py-1"
          >
            <Tag strokeWidth={3} size={11} />
            <p className="font-medium">{label.name}</p>
          </span>
        ))}
        {editable && <LabelsSelect taskId={taskId} current={labels} />}
      </div>
    </div>
  );
}
