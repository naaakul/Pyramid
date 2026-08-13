import { apiFetch } from "./client";

export interface ApiInvite {
  id: string;
  status: string;
  createdAt: string;
  invitedBy: { name: string };
  task: { id: string; title: string } | null;
  project: { id: string; name: string } | null;
}

export const createInvite = (data: {
  invitedUserId: string;
  taskId?: string;
  projectId?: string;
}) =>
  apiFetch<ApiInvite>("/invites", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMyInvites = (type?: "task" | "project") =>
  apiFetch<ApiInvite[]>(`/invites/me${type ? `?type=${type}` : ""}`);

export const acceptInvite = (id: string) =>
  apiFetch(`/invites/${id}/accept`, { method: "POST" });
