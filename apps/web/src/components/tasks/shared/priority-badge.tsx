import { Signal, SignalLow, SignalMedium, SignalHigh } from 'lucide-react';

const PRIORITY_CONFIG: Record<string, { icon: typeof Signal; color: string; label: string }> = {
  NO_PRIORITY: { icon: Signal, color: 'text-gray-400', label: 'No Priority' },
  LOW: { icon: SignalLow, color: 'text-gray-400', label: 'Low' },
  MEDIUM: { icon: SignalMedium, color: 'text-orange-500', label: 'Medium' },
  HIGH: { icon: SignalHigh, color: 'text-red-500', label: 'High' },
  URGENT: { icon: SignalHigh, color: 'text-red-700 font-medium', label: 'Urgent' },
};

export function PriorityBadge({ priority }: { priority: string }) {
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.NO_PRIORITY;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${config.color}`}>
      <Icon size={14} />
      {config.label}
    </span>
  );
}