import { apiFetch } from './client';

export interface SearchedUser { id: string; name: string; email: string | null; avatarColor: string | null; avatarUrl: string | null; }

export const searchUsersByEmail = (email: string) =>
  apiFetch<SearchedUser[]>(`/users/search?email=${encodeURIComponent(email)}`);