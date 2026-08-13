'use client';
import { create } from 'zustand';

export const useActiveSectionStore = create<{ section: 'tasks' | 'projects' | null; set: (s: 'tasks' | 'projects' | null) => void }>((set) => ({
  section: null,
  set: (section) => set({ section }),
}));