import { apiFetch } from "./client";

export interface ApiUser {
  id: string;
  name: string;
  avatarColor: string | null;
}
export interface ApiStatus {
  id: string;
  name: string;
  color: string;
  order: number;
}
export interface ApiLabel {
  id: string;
  name: string;
  color: string;
}
export interface ApiTask {
  id: string;
  title: string;
  priority: string;
  statusId: string;
  dueDateEnd: string | null;
  assignees: { user: ApiUser }[];
  labels: { label: ApiLabel }[];
}

export interface ApiComment {
  id: string;
  body: string;
  createdAt: string;
  author: ApiUser;
}

export interface ApiActivity {
  id: string;
  type: string;
  fromValue: string | null;
  toValue: string | null;
  createdAt: string;
  actor: ApiUser;
}

export interface ApiTaskDetail extends ApiTask {
  description: string | null;
  status: ApiStatus;
  reporter: ApiUser;
  subtasks: ApiTask[];
  comments: ApiComment[];
  activities: ApiActivity[];
  watcherCount: number;
}

export const getTask = (id: string) => apiFetch<ApiTaskDetail>(`/tasks/${id}`);

export const updateTask = (
  id: string,
  data: Partial<{ priority: string; statusId: string; title: string }>,
) =>
  apiFetch<ApiTask>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const addComment = (taskId: string, body: string) =>
  apiFetch<ApiComment>(`/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });

export const createTask = (data: {
  title: string;
  statusId?: string;
  parentTaskId?: string;
}) =>
  apiFetch<ApiTask>("/tasks", { method: "POST", body: JSON.stringify(data) });

export const getStatuses = () => apiFetch<ApiStatus[]>("/statuses");

export const getTasks = (search?: string) =>
  apiFetch<ApiTask[]>(
    `/tasks${search ? `?search=${encodeURIComponent(search)}` : ""}`,
  );

export const moveTask = (
  id: string,
  data: { statusId: string; position: number },
) =>
  apiFetch<ApiTask>(`/tasks/${id}/position`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
