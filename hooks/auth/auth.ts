"use client";

import { auth } from "../../configs/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  getAdditionalUserInfo,
  GoogleAuthProvider,
} from "firebase/auth";
import { setCookie } from "./utils/helpers";

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

async function signUpWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken(true);
    const user = result.user;
    const additionalUserInfo = getAdditionalUserInfo(result);
    setCookie("token", token); 
    return {
      token: token,
      user: user,
      additionalUserInfo: additionalUserInfo,
    };
  } catch (error) {
    throw error;
  }
}

export function useSignOut() {
  return useMutation({
    mutationFn: signOut,
  });
}

async function signOut() {
  try {
    firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
}
