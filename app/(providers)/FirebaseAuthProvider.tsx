"use client";

import { useCreateUser, useFetchSelf } from "@/queries/user/user";
import { auth } from "@/configs/firebase";
import { useUserStore } from "@/stores/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkIfUserExists, UserToCreateType } from "@/services/userService";

interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

export default function FirebaseAuthProvider({
  children,
}: FirebaseAuthProviderProps) {
  const router = useRouter();
  const userStore = useUserStore();

  const createUserResult = useCreateUser();
  const fetchSelfResult = useFetchSelf();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("User changed", user);
      if (!user) {
        userStore.removeUser();
        router.push("/login", { scroll: false });
        return;
      }

      if (userStore.user) {
        return;
      }

      const userExists = await checkIfUserExists();

      if (!userExists) {
        if (!user.email || !user.displayName || !user.photoURL) {
          throw new Error("User does not have enough information");
        }

        const userToCreate: UserToCreateType = {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL,
        };

        const createdUser = await createUserResult.mutateAsync(userToCreate);
        userStore.setUser(createdUser);
      } else {
        const userFromDbResponse = await fetchSelfResult.refetch();

        if (!userFromDbResponse.data) {
          throw new Error("User not found in database");
        }

        userStore.setUser(userFromDbResponse.data);
      }
      router.push("/");
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
