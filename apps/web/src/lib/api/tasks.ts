import { apiFetch } from './client';

export interface ApiUser { id: string; name: string; avatarColor: string | null; }
export interface ApiStatus { id: string; name: string; color: string; order: number; }
export interface ApiLabel { id: string; name: string; color: string; }
export interface ApiTask {
  id: string;
  title: string;
  priority: string;
  statusId: string;
  dueDateEnd: string | null;
  assignees: { user: ApiUser }[];
  labels: { label: ApiLabel }[];
}

export const getStatuses = () => apiFetch<ApiStatus[]>('/statuses');
export const getTasks = () => apiFetch<ApiTask[]>('/tasks');
export const createTask = (data: { title: string; statusId: string }) =>
  apiFetch<ApiTask>('/tasks', { method: 'POST', body: JSON.stringify(data) });
export const moveTask = (id: string, data: { statusId: string; position: number }) =>
  apiFetch<ApiTask>(`/tasks/${id}/position`, { method: 'PATCH', body: JSON.stringify(data) });