'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '../tasks/shared/priority-badge';
import { ProjectMembersEditor } from './project-members-editor';
import { useUpdateProject } from '@/hooks/use-projects';
import type { ApiProject } from '@/lib/api/projects';

const PRIORITIES = ['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'];

export function ProjectEditModal({ project, open, onOpenChange }: { project: ApiProject; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [name, setName] = useState(project.name);
  const [priority, setPriority] = useState(project.priority);
  const [dueDate, setDueDate] = useState<Date | undefined>(project.dueDate ? new Date(project.dueDate) : undefined);
  const updateProject = useUpdateProject(project.id);

  function save() {
    updateProject.mutate(
      { name, priority, dueDate: dueDate ? dueDate.toISOString() : null } as never,
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm ring-ink-border">
        <DialogHeader><DialogTitle className='text-ink-900'>Edit Project</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 pb-2 rounded-md border-ink-border placeholder:text-ink-sec text-ink-500 py-1.5 text-sm outline-none" placeholder="Project name" />
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild><button className="border border-ink-border rounded-full px-2.5 py-0.5 text-xs"><PriorityBadge priority={priority} /></button></PopoverTrigger>
              <PopoverContent className="w-40 p-1 border-ink-border">
                {PRIORITIES.map((p) => (
                  <button key={p} onClick={() => setPriority(p)} className="flex w-full px-2 py-1.5 text-sm hover:bg-ink-50 rounded"><PriorityBadge priority={p} /></button>
                ))}
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild><button className="border rounded-full border-ink-border text-ink-500 px-2.5 py-1 text-xs">{dueDate ? dueDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Due date'}</button></PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-ink-border"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} /></PopoverContent>
            </Popover>
          </div>
          <div className=" pt-2">
            <div className="text-xs text-ink-500 mb-1.5">Members</div>
            <ProjectMembersEditor projectId={project.id} members={project.members ?? []} />
          </div>
        </div>
        <DialogFooter className='bg-transparent border-0 pt-0'><Button size="sm" onClick={save} className="bg-ink-900 text-white hover:opacity-60">Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}