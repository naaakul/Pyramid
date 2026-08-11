'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbStore } from '@/store/breadcrumb-store';
import { usePathname } from 'next/navigation';

export function BreadcrumbSlot() {
  const pathname = usePathname();
  const crumbs = useBreadcrumbStore((s) => s.crumbs);

  let finalCrumbs = crumbs;

  if (pathname === '/projects') {
    finalCrumbs = [{ label: 'Projects' }];
  } else if (pathname === '/tasks') {
    finalCrumbs = [{ label: 'Tasks' }];
  }

  if (!finalCrumbs.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {finalCrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5 ">
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink href={crumb.href} className='text-ink-sec hover:text-ink-text mb-0.5'>
                  {crumb.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className='text-ink-text mb-0.5'>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {i < finalCrumbs.length - 1 && <BreadcrumbSeparator className='text-ink-sec' />}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}