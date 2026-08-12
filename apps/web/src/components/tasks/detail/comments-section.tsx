'use client';

import { useState } from 'react';
import { Paperclip, Send, Smile, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAddComment } from '@/hooks/use-tasks';
import type { ApiComment } from '@/lib/api/tasks';

function timeAgo(dateStr: string) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
}

function CommentInput({ placeholder, onSubmit }: { placeholder: string; onSubmit: (body: string) => void }) {
  const [value, setValue] = useState('');
  function submit() {
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  }
  return (
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder={placeholder}
        className="flex-1 text-sm outline-none placeholder:text-gray-400"
      />
      <button className="text-gray-400 hover:text-gray-600"><Paperclip size={16} /></button>
      <button onClick={submit} className="text-gray-400 hover:text-gray-600"><Send size={16} /></button>
    </div>
  );
}

export function CommentsSection({
  taskId,
  comments,
  isReporter,
  isLocked,
}: {
  taskId: string;
  comments: ApiComment[];
  isReporter: boolean;
  isLocked: boolean;
}) {
  const addComment = useAddComment(taskId);
  const canComment = isReporter || !isLocked;

  return (
    <div>
      <h3 className="text-sm font-medium text-ink-800 mb-3">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="border rounded-lg p-3 mb-2">
          {/* ...unchanged... */}
        </div>
      ))}
      {canComment ? (
        <>
          <div className="mb-4">
            <CommentInput placeholder="Leave a reply..." onSubmit={(body) => addComment.mutate(body)} />
          </div>
          <CommentInput placeholder="Add a comment..." onSubmit={(body) => addComment.mutate(body)} />
        </>
      ) : (
        <p className="text-sm text-ink-400 italic">This task is locked. Only the reporter can comment.</p>
      )}
    </div>
  );
}