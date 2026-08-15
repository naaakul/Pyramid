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
      <DialogContent className="max-w-sm ring-ink-border">
        <DialogHeader><DialogTitle className='text-ink-900'>New Project</DialogTitle></DialogHeader>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Project name"
          className="w-full text-base border border-ink-border rounded-md py-2 px-3 pb-2.5 placeholder:text-ink-sec text-ink-500 outline-none "
        />
        <DialogFooter className='bg-transparent pt-0 border-0'>
          <Button variant="outline" size="sm" onClick={close} className='hover:bg-ink-bg text-ink-900 border-ink-border hover:text-none'>Cancel</Button>
          <Button size="sm" disabled={!name.trim()} onClick={submit} className="bg-ink-900 text-white hover:bg-ink-700">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}