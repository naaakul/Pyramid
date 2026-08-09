'use client';
import { create } from 'zustand';

export interface TaskFilters {
  statusId?: string;
  priority?: string;
  assigneeId?: string;
  labelId?: string;
  reporterId?: string;
  dueDate?: 'overdue' | 'no_date';
}

interface FiltersState {
  filters: TaskFilters;
  setFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  toggleFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  clearAll: () => void;
}

export const useTaskFiltersStore = create<FiltersState>((set, get) => ({
  filters: {},
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  toggleFilter: (key, value) =>
    set((s) => ({
      filters: { ...s.filters, [key]: s.filters[key] === value ? undefined : value },
    })),
  clearAll: () => set({ filters: {} }),
}));

export function activeFilterCount(filters: TaskFilters) {
  return Object.values(filters).filter(Boolean).length;
}