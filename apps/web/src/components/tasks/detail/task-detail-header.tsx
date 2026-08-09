import { Lock, Eye, Share2, MoreHorizontal, PanelRight } from 'lucide-react';

export function TaskDetailHeader({ title, description, watcherCount }: { title: string; description: string | null; watcherCount: number }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1 max-w-xl">{description}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button className="w-8 h-8 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50"><Lock size={14} /></button>
        <button className="h-8 px-2 border rounded-md flex items-center gap-1 text-gray-500 hover:bg-gray-50 text-xs">
          <Eye size={14} /> {watcherCount}
        </button>
        <button className="w-8 h-8 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50"><Share2 size={14} /></button>
        <button className="w-8 h-8 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50"><MoreHorizontal size={14} /></button>
        <button className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-200"><PanelRight size={14} /></button>
      </div>
    </div>
  );
}