"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvite, getMyInvites, acceptInvite } from "@/lib/api/invites";

export const useMyInvites = (type?: 'task' | 'project') =>
  useQuery({ queryKey: ['my-invites', type], queryFn: () => getMyInvites(type), refetchInterval: 15000 });

export function useAcceptInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-invites'] });
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useCreateInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createInvite,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-search"] }),
  });
}

// export function useAcceptInvite() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: acceptInvite,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['my-invites'] });
//       qc.invalidateQueries({ queryKey: ['workspace-members'] });
//       qc.invalidateQueries({ queryKey: ['tasks'] });
//     },
//   });
// }
