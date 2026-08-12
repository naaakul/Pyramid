'use client';

import { useState } from 'react';
import { Paperclip, Link as LinkIcon, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAddAttachment, useRemoveAttachment } from '@/hooks/use-tasks';
import { uploadToCloudinary } from '@/lib/api/uploads';
import type { ApiAttachment } from '@/lib/api/tasks';

function fileExt(name: string) {
  return name.split('.').pop()?.toUpperCase() ?? 'FILE';
}

export function TaskResources({ taskId, attachments, editable }: { taskId: string; attachments: ApiAttachment[]; editable: boolean }) {
  const [open, setOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [uploading, setUploading] = useState(false);
  const addAttachment = useAddAttachment(taskId);
  const removeAttachment = useRemoveAttachment(taskId);

  async function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("You can't upload more than 5MB");
      e.target.value = '';
      return;
    }
    setUploading(true);
    try {
      const { url, name } = await uploadToCloudinary(file);
      addAttachment.mutate({ name, url, type: 'file' });
      setOpen(false);
    } catch {
      toast.error('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  }

  function submitLink() {
    if (!linkUrl.trim()) return;
    addAttachment.mutate({ name: linkName.trim() || linkUrl, url: linkUrl, type: 'link' });
    setLinkUrl('');
    setLinkName('');
    setOpen(false);
  }

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-ink-500 w-24 shrink-0">Resources</span>
        <div className="flex flex-wrap gap-1.5 items-center">
          {attachments.map((a) => (
            <span key={a.id} className="flex items-center gap-1.5 text-xs bg-ink-100 rounded-full pl-2.5 pr-1 py-1">
              {a.type === 'link' ? (
                <a href={a.url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  <LinkIcon size={11} /> {a.name}
                </a>
              ) : (
                <a href={a.url} download className="hover:underline flex items-center gap-1">
                  <Paperclip size={11} /> {a.name.length > 16 ? `${a.name.slice(0, 14)}…` : a.name} · {fileExt(a.name)}
                </a>
              )}
              {editable && (
                <button onClick={() => removeAttachment.mutate(a.id)} className="text-ink-400 hover:text-red-500">
                  <X size={11} />
                </button>
              )}
            </span>
          ))}
          {editable && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-600">
                  <Paperclip size={13} /> Add document or link...
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader><DialogTitle>Add Resource</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-ink-500 mb-1 block">Link</label>
                    <input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full border rounded px-2 py-1.5 text-sm mb-1.5"
                    />
                    <input
                      value={linkName}
                      onChange={(e) => setLinkName(e.target.value)}
                      placeholder="Display name (optional)"
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    />
                    <Button size="sm" className="mt-2 w-full" onClick={submitLink} disabled={!linkUrl.trim()}>
                      Add Link
                    </Button>
                  </div>
                  <div className="border-t pt-3">
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg py-4 text-sm text-ink-500 hover:bg-ink-50 cursor-pointer">
                      <Upload size={16} />
                      {uploading ? 'Uploading...' : 'Upload document (max 5MB)'}
                      <input type="file" className="hidden" onChange={handleFilePick} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}