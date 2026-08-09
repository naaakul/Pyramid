import { Paperclip } from 'lucide-react';

export function TaskResources() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-gray-500 w-24 shrink-0">Resources</span>
      <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600">
        <Paperclip size={13} /> Add document or link...
      </button>
    </div>
  );
}