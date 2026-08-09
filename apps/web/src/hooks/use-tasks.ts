"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStatuses,
  getTasks,
  getTask,
  updateTask,
  addComment,
  createTask,
  getTeams,
  type TaskQuery,
  type ApiTaskDetail,
} from "@/lib/api/tasks";
import {} from "@/lib/api/tasks";

export const useStatuses = () =>
  useQuery({ queryKey: ["statuses"], queryFn: getStatuses });

export const useTasks = (query: TaskQuery = {}) =>
  useQuery({ queryKey: ["tasks", query], queryFn: () => getTasks(query) });

export const useTeams = () =>
  useQuery({ queryKey: ["teams"], queryFn: getTeams });

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

import {
  getLabels,
  createLabel,
  getWorkspaceMembers,
  addAssignee,
  removeAssignee,
} from "@/lib/api/tasks";

export const useLabels = () =>
  useQuery({ queryKey: ["labels"], queryFn: getLabels });
export const useWorkspaceMembers = () =>
  useQuery({ queryKey: ["workspace-members"], queryFn: getWorkspaceMembers });

export function useCreateLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLabel,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["labels"] }),
  });
}

export function useToggleAssignee(taskId: string) {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["task", taskId] });
    qc.invalidateQueries({ queryKey: ["tasks"] });
  };
  const add = useMutation({
    mutationFn: (userId: string) => addAssignee(taskId, userId),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (userId: string) => removeAssignee(taskId, userId),
    onSuccess: invalidate,
  });
  return { add, remove };
}
