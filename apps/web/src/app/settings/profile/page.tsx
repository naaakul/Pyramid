"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarPreviewModal } from "@/components/settings/avatar-preview-modal";
import { useCurrentUser } from "@/lib/auth/current-user-context";
import { useUpdateProfile } from "@/hooks/use-profile";

function EditableField({
  label,
  hint,
  value,
  onSave,
}: {
  label: string;
  hint?: string;
  value: string;
  onSave: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-ink-400">{hint}</div>}
      </div>
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => local !== value && onSave(local)}
        className="bg-ink-50 rounded-md px-3 py-1.5 text-sm text-right outline-none focus:bg-ink-100 w-48"
      />
    </div>
  );
}

export default function ProfilePage() {
  const currentUser = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const [avatarOpen, setAvatarOpen] = useState(false);

  function save(field: "name" | "title" | "username", value: string) {
    updateProfile.mutate({ [field]: value });
  }

  async function handleLeaveWorkspace() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-xl font-semibold mb-6">Profile</h1>

      <div className="border rounded-lg px-4 divide-y">
        <button
          onClick={() => setAvatarOpen(true)}
          className="w-full flex items-center justify-between py-4"
        >
          <span className="text-sm font-medium">Profile picture</span>
          <Avatar className="h-8 w-8 rounded-full overflow-hidden">
            {currentUser.avatarUrl ? (
              <Image
                src={currentUser.avatarUrl}
                alt=""
                height={32}
                width={32}
              />
            ) : (
              <AvatarFallback className="rounded-full bg-ink-900 text-white text-xs">
                {currentUser.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
        </button>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm font-medium">Email</span>
          <span className="flex items-center gap-2 text-sm text-ink-600">
            {currentUser.email ?? "—"}
            <button
              onClick={() =>
                toast(
                  "We\u2019re working on this feature — you\u2019ll be able to edit your email soon.",
                )
              }
              className="text-ink-400 hover:text-ink-600"
            >
              <Pencil size={13} />
            </button>
          </span>
        </div>

        <EditableField
          label="Full name"
          value={currentUser.name}
          onSave={(v) => save("name", v)}
        />
        <EditableField
          label="Title"
          hint="Your job title or role"
          value={(currentUser as any).title ?? ""}
          onSave={(v) => save("title", v)}
        />
        <EditableField
          label="Username"
          hint="One word, like a nickname or first name"
          value={(currentUser as any).username ?? ""}
          onSave={(v) => save("username", v)}
        />
      </div>

      <h2 className="text-sm font-medium text-ink-700 mt-8 mb-2">
        Workspace access
      </h2>
      <div className="border rounded-lg px-4 py-4 flex items-center justify-between">
        <span className="text-sm text-ink-500">
          Remove yourself from the workspace
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLeaveWorkspace}
          className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
        >
          <LogOut size={13} className="mr-1.5" /> Leave Workspace
        </Button>
      </div>

      <AvatarPreviewModal
        open={avatarOpen}
        onOpenChange={setAvatarOpen}
        avatarUrl={currentUser.avatarUrl ?? null}
        name={currentUser.name}
      />
    </div>
  );
}
