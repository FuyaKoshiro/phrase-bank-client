"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut, signUpWithGoogle } from "@/services/authService";

const getAuthQueryKeys = {
  user: ["user"] as const,
};

export function useSignUpWithGoogle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signUpWithGoogle,
    onSuccess: (data) => {
      queryClient.setQueryData(getAuthQueryKeys.user, data.user);
    },
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: signOut,
  });
}
