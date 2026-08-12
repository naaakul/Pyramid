import { apiFetch } from './client';

export interface ApiInvite {
  id: string;
  status: string;
  createdAt: string;
  invitedBy: { name: string };
  task: { id: string; title: string } | null;
}

export const createInvite = (data: { invitedUserId: string; taskId?: string }) =>
  apiFetch<ApiInvite>('/invites', { method: 'POST', body: JSON.stringify(data) });

export const getMyInvites = () => apiFetch<ApiInvite[]>('/invites/me');
export const acceptInvite = (id: string) => apiFetch(`/invites/${id}/accept`, { method: 'POST' });