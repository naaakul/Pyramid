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
  getTaskAssignees,
} from "@/lib/api/tasks";
import {} from "@/lib/api/tasks";
import { apiFetch } from "@/lib/api/client";
import { createAttachment, deleteAttachment } from "@/lib/api/tasks";
import { createTeam, addTaskTeam, removeTaskTeam } from "@/lib/api/tasks";

export function useCreateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
}

export function useToggleTaskTeam(taskId: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["task", taskId] });
  const add = useMutation({
    mutationFn: (teamId: string) => addTaskTeam(taskId, teamId),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (teamId: string) => removeTaskTeam(taskId, teamId),
    onSuccess: invalidate,
  });
  return { add, remove };
}

export function useAddAttachment(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; url: string; type: "link" | "file" }) =>
      createAttachment(taskId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export function useRemoveAttachment(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAttachment(taskId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export function useRemoveTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/tasks/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task"] });
    },
  });
}

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
    qc.invalidateQueries({ queryKey: ["task-assignees", taskId] });
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

export function useDeleteLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/labels/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["labels"] }),
  });
}

export const useTaskAssignees = (taskId: string) =>
  useQuery({
    queryKey: ["task-assignees", taskId],
    queryFn: () => getTaskAssignees(taskId),
    enabled: !!taskId,
  });
