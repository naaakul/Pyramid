import { apiFetch } from "./client";
import type { ApiUser } from "./tasks";

export interface ApiProject {
  id: string;
  name: string;
  priority: string;
  leadId: string | null;
  lead: ApiUser | null;
  dueDate: string | null;
  _count?: { tasks: number };
}

export const getProjects = (search?: string) =>
  apiFetch<ApiProject[]>(
    `/projects${search ? `?search=${encodeURIComponent(search)}` : ""}`,
  );
export const getProject = (id: string) =>
  apiFetch<ApiProject>(`/projects/${id}`);
export const createProject = (data: { name: string }) =>
  apiFetch<ApiProject>("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateProject = (
  id: string,
  data: Partial<{
    name: string;
    priority: string;
    leadId: string;
    dueDate: string | null;
  }>,
) =>
  apiFetch<ApiProject>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
