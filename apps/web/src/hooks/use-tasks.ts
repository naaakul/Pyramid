"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStatuses,
  getTasks,
  getTask,
  updateTask,
  addComment,
  createTask,
  type ApiTaskDetail,
} from "@/lib/api/tasks";

export const useStatuses = () =>
  useQuery({ queryKey: ["statuses"], queryFn: getStatuses });
export const useTasks = (search?: string) =>
  useQuery({ queryKey: ["tasks", search], queryFn: () => getTasks(search) });

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export const useTaskDetail = (id: string, initialData?: ApiTaskDetail) =>
  useQuery({ queryKey: ["task", id], queryFn: () => getTask(id), initialData });

export function useUpdateTask(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof updateTask>[1]) =>
      updateTask(taskId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useAddComment(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => addComment(taskId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export function useCreateSubtask(parentTaskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; statusId?: string }) =>
      createTask({ ...data, parentTaskId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["task", parentTaskId] }),
  });
}
