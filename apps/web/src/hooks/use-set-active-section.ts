'use client';
import { useEffect } from 'react';
import { useActiveSectionStore } from '@/store/active-section-store';

export function useSetActiveSection(section: 'tasks' | 'projects') {
  const set = useActiveSectionStore((s) => s.set);
  useEffect(() => {
    set(section);
    return () => set(null);
  }, [section]);
}