'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStatuses, getTasks, createTask } from '@/lib/api/tasks';

export const useStatuses = () => useQuery({ queryKey: ['statuses'], queryFn: getStatuses });
export const useTasks = (search?: string) =>
  useQuery({ queryKey: ['tasks', search], queryFn: () => getTasks(search) });

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}