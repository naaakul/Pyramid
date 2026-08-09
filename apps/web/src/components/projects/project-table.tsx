"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { ProjectRow, PROJECT_GRID } from "./project-row";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { useProjectComposerStore } from "@/store/project-composer-store";

export function ProjectTable({ search }: { search?: string }) {
  const { data: projects, isLoading, error } = useProjects(search);
  const createProject = useCreateProject();
  const { isOpen, open, close } = useProjectComposerStore();
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  function submit() {
    if (!name.trim()) return close();
    createProject.mutate(
      { name },
      {
        onSuccess: () => {
          setName("");
          close();
        },
        onError: (err) => {
          // surfaced instead of failing silently like before
          alert(
            `Failed to create project: ${err instanceof Error ? err.message : "unknown error"}`,
          );
        },
      },
    );
  }

  if (isLoading)
    return <div className="px-6 text-sm text-gray-500">Loading...</div>;
  if (error)
    return (
      <div className="px-6 text-sm text-red-500">
        Failed to load projects: {(error as Error).message}
      </div>
    );

  return (
    <div className="px-6">
      <div className="border rounded-lg overflow-hidden">
        <div
          className={`${PROJECT_GRID} px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 border-b`}
        >
          <span>Projects</span>
          <span>Priority</span>
          <span>Lead</span>
          <span>Due Date</span>
          <span className="justify-self-end">Actions</span>
        </div>
        {(projects ?? []).map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
        {isOpen ? (
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={submit}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Project name..."
            className="w-full text-sm px-4 py-2.5 outline-none"
          />
        ) : (
          <button
            onClick={open}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 w-full text-left"
          >
            <Plus size={14} /> Add Projects
          </button>
        )}
      </div>
    </div>
  );
}
