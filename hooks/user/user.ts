import { useMutation, useQuery } from "@tanstack/react-query";
import jsCookie from "js-cookie";
import {
  createUser,
  fetchSelf,
  UserToCreateType,
} from "@/services/userService";

export const userQueryKeys = {
  self: ["self"] as const,
  selfCheck: ["selfCheck"] as const,
};

export function useFetchSelf() {
  return useQuery({
    queryKey: userQueryKeys.self,
    queryFn: fetchSelf,
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (user: UserToCreateType) => {
      return createUser(user);
    },
  });
}
