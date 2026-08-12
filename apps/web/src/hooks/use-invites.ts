"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvite, getMyInvites, acceptInvite } from "@/lib/api/invites";

export const useMyInvites = () =>
  useQuery({
    queryKey: ["my-invites"],
    queryFn: getMyInvites,
    refetchInterval: 15000,
  });

export function useCreateInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createInvite,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-search"] }),
  });
}

export function useAcceptInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-invites"] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
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
