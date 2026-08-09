'use client';
import { create } from 'zustand';

interface ProjectComposerState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useProjectComposerStore = create<ProjectComposerState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));