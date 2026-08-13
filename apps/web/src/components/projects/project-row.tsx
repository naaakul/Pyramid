"use client";
import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PriorityBadge } from "../tasks/shared/priority-badge";
import { ProjectEditModal } from "./project-edit-modal";
import { useRemoveProject } from "@/hooks/use-projects";
import { useCurrentUser } from "@/lib/auth/current-user-context";
import type { ApiProject } from "@/lib/api/projects";

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
const GRID = "grid grid-cols-[1fr_140px_140px_140px_50px] items-center gap-2";

export function ProjectRow({ project }: { project: ApiProject }) {
  const currentUser = useCurrentUser();
  const isLead = project.leadId === currentUser.id;
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const removeProject = useRemoveProject();

  return (
    <>
      <div
        className={`${GRID} p-3 px-3.5 border-b last:border-b-0 text-sm hover:bg-ink-bg`}
      >
        <Link
          href={`/projects/${project.id}`}
          className="truncate"
        >
          {project.name}
        </Link>
        <PriorityBadge priority={project.priority} />
        <span className="text-ink-600">{project.lead?.name ?? "—"}</span>
        <span className="text-ink-600">{formatDate(project.dueDate)}</span>
        {isLead ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-ink-400 hover:text-ink-600 justify-self-end">
              <MoreHorizontal size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil size={13} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 size={13} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span />
        )}
      </div>
      {isLead && (
        <ProjectEditModal
          project={project}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{project.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeProject.mutate(project.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
export { GRID as PROJECT_GRID };
