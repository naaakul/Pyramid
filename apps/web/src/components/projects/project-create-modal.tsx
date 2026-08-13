'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreateProject } from '@/hooks/use-projects';
import { useProjectComposerStore } from '@/store/project-composer-store';

export function ProjectCreateModal() {
  const { isOpen, close } = useProjectComposerStore();
  const [name, setName] = useState('');
  const createProject = useCreateProject();

  function submit() {
    if (!name.trim()) return;
    createProject.mutate({ name }, { onSuccess: () => { setName(''); close(); } });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Project name"
          className="w-full text-base border-b pb-2 outline-none"
        />
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={close}>Cancel</Button>
          <Button size="sm" disabled={!name.trim()} onClick={submit} className="bg-ink-900 text-white hover:bg-ink-700">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}