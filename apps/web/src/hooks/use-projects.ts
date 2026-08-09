"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  type ApiProject,
} from "@/lib/api/projects";

export const useProjects = (search?: string) =>
  useQuery({
    queryKey: ["projects", search],
    queryFn: () => getProjects(search),
  });
export const useProject = (id: string, initialData?: ApiProject) =>
  useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
    initialData,
  });

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof updateProject>[1]) =>
      updateProject(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project", id] });
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
