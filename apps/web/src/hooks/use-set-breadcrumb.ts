'use client';
import { useEffect } from 'react';
import { useBreadcrumbStore, type Crumb } from '@/store/breadcrumb-store';

export function useSetBreadcrumb(crumbs: Crumb[]) {
  const set = useBreadcrumbStore((s) => s.set);
  const clear = useBreadcrumbStore((s) => s.clear);
  useEffect(() => {
    set(crumbs);
    return () => clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(crumbs)]);
}