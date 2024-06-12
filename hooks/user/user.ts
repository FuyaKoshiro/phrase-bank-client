import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosRequester } from "../axiosRequester";
import jsCookie from "js-cookie";
import { userSchema } from "@/schemas/userSchema";

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

export async function fetchSelf(token: string) {
  try {
    const response = await axiosRequester(token).get("/user/");
    return userSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
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

async function checkIfUserExists(token: string) {
  try {
    const response = await axiosRequester(token).get(
      "/user/check_if_user_exists/"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export interface UserToCreateType {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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

async function createUser(token: string, user: UserToCreateType) {
  try {
    const response = await axiosRequester(token).post("/user/", {
      ...user,
    });
    return userSchema.parse(response.data);
  } catch (error) {
    throw error;
  }
}
