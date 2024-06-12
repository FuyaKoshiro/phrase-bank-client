import { useMutation, useQuery } from "@tanstack/react-query";
import jsCookie from "js-cookie";
import {
  checkIfUserExists,
  createUser,
  fetchSelf,
  UserToCreateType,
} from "@/services/userService";

export const userQueryKeys = {
  self: ["self"] as const,
  selfCheck: ["selfCheck"] as const,
};

export function useFetchSelf() {
  const token = jsCookie.get("token");

  return useQuery({
    queryKey: userQueryKeys.self,
    queryFn: () => fetchSelf(token!),
    enabled: !!token,
  });
}

export function useCheckIfUserExists() {
  const token = jsCookie.get("token");

  return useQuery({
    queryKey: userQueryKeys.selfCheck,
    queryFn: () => checkIfUserExists(token!),
    enabled: !!token,
    staleTime: 0,
  });
}

export function useCreateUser() {
  const token = jsCookie.get("token");

  return useMutation({
    mutationFn: (user: UserToCreateType) => {
      if (!token) {
        throw new Error("Token is not found.");
      }
      return createUser(token, user);
    },
  });
}
