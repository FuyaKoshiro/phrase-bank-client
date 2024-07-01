"use client";

import { auth } from "@/configs/firebase";
import { useUserStore } from "@/stores/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  checkIfUserExists,
  createUser,
  fetchSelf,
  UserToCreateType,
} from "@/services/userService";

interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

export default function FirebaseAuthProvider({
  children,
}: FirebaseAuthProviderProps) {
  const routerRef = useRef(useRouter());
  const userStoreRef = useRef(useUserStore());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        userStoreRef.current.removeUser();
        routerRef.current.push("/login", { scroll: false });
        return;
      }

      if (userStoreRef.current.user) {
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

        const createdUser = await createUser(userToCreate);
        userStoreRef.current.setUser(createdUser);
      } else {
        const userFromDbResponse = await fetchSelf();

        if (!userFromDbResponse) {
          throw new Error("User not found in database");
        }

        userStoreRef.current.setUser(userFromDbResponse);
      }
      routerRef.current.push("/");
    });

    return () => unsubscribe();
  }, [routerRef, userStoreRef]);

  return <>{children}</>;
}
