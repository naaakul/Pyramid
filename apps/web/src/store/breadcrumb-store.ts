'use client';
import { create } from 'zustand';

export interface Crumb { label: string; href?: string; }

interface BreadcrumbState {
  crumbs: Crumb[];
  set: (crumbs: Crumb[]) => void;
  clear: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  crumbs: [],
  set: (crumbs) => set({ crumbs }),
  clear: () => set({ crumbs: [] }),
}));