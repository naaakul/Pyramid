'use client';
import { create } from 'zustand';

export const FIELD_CONFIG = [
  { key: 'priority', label: 'Priority' },
  { key: 'members', label: 'Members' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'labels', label: 'Labels' },
  { key: 'status', label: 'Status' },
  { key: 'reporter', label: 'Reporter' },
] as const;

export type FieldKey = (typeof FIELD_CONFIG)[number]['key'];

interface BoardFieldsState {
  visible: Record<FieldKey, boolean>;
  toggle: (key: FieldKey) => void;
}

export const useBoardFieldsStore = create<BoardFieldsState>((set) => ({
  visible: {
  priority: true,
  members: true,
  dueDate: true,
  members2: true,
  labels: false,
  status: false,
  reporter: false,
},
  toggle: (key) =>
    set((state) => ({ visible: { ...state.visible, [key]: !state.visible[key] } })),
}));

export function isMembersVisible(visible: Record<FieldKey, boolean>) {
  return visible.members || visible.members2;
}