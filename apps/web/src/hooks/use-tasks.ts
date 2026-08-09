'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStatuses, getTasks, createTask } from '@/lib/api/tasks';

export const useStatuses = () => useQuery({ queryKey: ['statuses'], queryFn: getStatuses });
export const useTasks = () => useQuery({ queryKey: ['tasks'], queryFn: getTasks });

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}