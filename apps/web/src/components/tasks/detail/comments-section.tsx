"use client";

import { useRef, useState } from "react";
import { Paperclip, Send, Smile, MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CollapsibleSection } from "@/components/shared/collapsible-section";
import { UserLabel } from "@/components/shared/user-label";
import {
  useComments,
  usePostComment,
  useDeleteComment,
  useToggleReaction,
} from "@/hooks/use-comments";
import { useCurrentUser } from "@/lib/auth/current-user-context";
import { uploadToCloudinary } from "@/lib/api/uploads";
import type { ApiCommentFull } from "@/lib/api/tasks";

const EMOJIS = ["👍", "❤️", "😂", "🎉", "👀"];

function timeAgo(dateStr: string) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}

function Composer({
  onSubmit,
  placeholder,
}: {
  onSubmit: (body: string, imageUrl?: string) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Only JPG or PNG images allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("You can't upload more than 5MB");
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function submit() {
    if (!value.trim() && !imageUrl) return;
    onSubmit(value, imageUrl ?? undefined);
    setValue("");
    setImageUrl(null);
  }

  return (
    <div className="border rounded-lg px-3 py-2 border-ink-border">
      {imageUrl && (
        <div className="relative w-16 h-16 mb-2">
          <img
            src={imageUrl}
            className="w-16 h-16 object-cover rounded"
            alt="attachment"
          />
          <button
            onClick={() => setImageUrl(null)}
            className="absolute -top-1.5 -right-1.5 bg-ink-900 text-white rounded-full w-4 h-4 flex items-center justify-center"
          >
            <X size={10} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={placeholder}
          className="flex-1 min-w-0 text-sm outline-none placeholder:text-ink-400 text-ink-900"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="text-ink-400 hover:text-ink-600 shrink-0"
        >
          <Paperclip size={16} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleFile}
        />
        <button onClick={submit} className="text-ink-400 hover:text-ink-600 shrink-0">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

function CommentBubble({
  comment,
  taskId,
  isReporter,
  canReply,
}: {
  comment: ApiCommentFull;
  taskId: string;
  isReporter: boolean;
  canReply: boolean;
}) {
  const currentUser = useCurrentUser();
  const [replying, setReplying] = useState(false);
  const postComment = usePostComment(taskId);
  const deleteComment = useDeleteComment(taskId);
  const toggleReaction = useToggleReaction(taskId);

  const canDelete = comment.author.id === currentUser.id || isReporter;
  const grouped = comment.reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mb-3">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarFallback
              className="text-[10px] text-white"
              style={{
                backgroundColor: comment.author.avatarColor ?? "#9ca3af",
              }}
            >
              {comment.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <UserLabel user={comment.author} showAvatar={false} />
          <span className="text-xs text-ink-400 whitespace-nowrap">
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-ink-400 shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <button className="hover:text-ink-600">
                <Smile size={14} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1 flex gap-1">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() =>
                    toggleReaction.mutate({ commentId: comment.id, emoji: e })
                  }
                  className="text-lg hover:scale-125 transition-transform"
                >
                  {e}
                </button>
              ))}
            </PopoverContent>
          </Popover>
          {canDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-ink-600">
                <MoreHorizontal size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="ring-ink-border">
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => deleteComment.mutate(comment.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <p className="text-sm text-ink-700 pl-6 sm:pl-8 break-words">
        {comment.body}
      </p>
      {comment.imageUrl && (
        <img
          src={comment.imageUrl}
          className="mt-1 ml-6 sm:ml-8 max-w-[160px] rounded border"
          alt="attachment"
        />
      )}
      {Object.keys(grouped).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 ml-6 sm:ml-8">
          {Object.entries(grouped).map(([emoji, count]) => (
            <button
              key={emoji}
              onClick={() =>
                toggleReaction.mutate({ commentId: comment.id, emoji })
              }
              className="text-xs border border-ink-border text-ink-text rounded-full px-1.5 py-0.5 hover:bg-ink-50"
            >
              {emoji} {count}
            </button>
          ))}
        </div>
      )}
      {canReply && (
        <button
          onClick={() => setReplying((v) => !v)}
          className="text-xs text-ink-400 hover:text-ink-600 ml-6 sm:ml-8 mt-1"
        >
          Reply
        </button>
      )}
      {replying && (
        <div className="ml-6 sm:ml-8 mt-2">
          <Composer
            placeholder="Reply..."
            onSubmit={(body, imageUrl) => {
              postComment.mutate({
                body,
                imageUrl,
                parentCommentId: comment.id,
              });
              setReplying(false);
            }}
          />
        </div>
      )}
      {(comment.replies?.length ?? 0) > 0 && (
        <div className="ml-6 sm:ml-8 mt-2 border-l pl-3 space-y-3">
          {(comment.replies ?? []).map((reply) => (
            <CommentBubble
              key={reply.id}
              comment={reply}
              taskId={taskId}
              isReporter={isReporter}
              canReply={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentsSection({
  taskId,
  isReporter,
  isLocked,
}: {
  taskId: string;
  isReporter: boolean;
  isLocked: boolean;
}) {
  const { data: comments, isLoading } = useComments(taskId);
  const postComment = usePostComment(taskId);
  const canComment = isReporter || !isLocked;

  return (
    <CollapsibleSection title="Comments">
      {isLoading && <p className="text-sm text-ink-400">Loading comments...</p>}
      {(comments ?? []).map((c) => (
        <CommentBubble
          key={c.id}
          comment={c}
          taskId={taskId}
          isReporter={isReporter}
          canReply
        />
      ))}
      {canComment ? (
        <div className="mt-3">
          <Composer
            placeholder="Add a comment..."
            onSubmit={(body, imageUrl) =>
              postComment.mutate({ body, imageUrl })
            }
          />
        </div>
      ) : (
        <p className="text-sm text-ink-400 italic mt-3">
          This task is locked. Only the reporter can comment.
        </p>
      )}
    </CollapsibleSection>
  );
}