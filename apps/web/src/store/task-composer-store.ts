'use client';
import { create } from 'zustand';

interface ComposerState {
  isOpen: boolean;
  mode: 'task' | 'subtask';
  statusId?: string;
  projectId?: string;
  parentTaskId?: string;
  openTask: (opts?: { statusId?: string; projectId?: string }) => void;
  openSubtask: (parentTaskId: string) => void;
  close: () => void;
}

export const useTaskComposerStore = create<ComposerState>((set) => ({
  isOpen: false,
  mode: 'task',
  openTask: (opts) => set({ isOpen: true, mode: 'task', ...opts, parentTaskId: undefined }),
  openSubtask: (parentTaskId) => set({ isOpen: true, mode: 'subtask', parentTaskId, statusId: undefined, projectId: undefined }),
  close: () => set({ isOpen: false }),
}));