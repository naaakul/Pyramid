'use client';
import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '@/lib/api/users';

export function useUpdateProfile() {
  return useMutation({ mutationFn: updateProfile });
}