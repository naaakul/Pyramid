'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, postComment, deleteComment, toggleReaction } from '@/lib/api/tasks';

export const useComments = (taskId: string) => useQuery({ queryKey: ['comments', taskId], queryFn: () => getComments(taskId) });

export function usePostComment(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { body: string; imageUrl?: string; parentCommentId?: string }) => postComment(taskId, v.body, v.imageUrl, v.parentCommentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', taskId] }),
  });
}
export function useDeleteComment(taskId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (commentId: string) => deleteComment(taskId, commentId), onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', taskId] }) });
}
export function useToggleReaction(taskId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (v: { commentId: string; emoji: string }) => toggleReaction(taskId, v.commentId, v.emoji), onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', taskId] }) });
}