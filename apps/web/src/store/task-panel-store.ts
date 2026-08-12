'use client';
import { create } from 'zustand';

export const useTaskPanelStore = create<{ open: boolean; toggle: () => void }>((set) => ({
  open: true,
  toggle: () => set((s) => ({ open: !s.open })),
}));