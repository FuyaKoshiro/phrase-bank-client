"use client";

import { auth } from "@/configs/firebase";
import { useUserStore } from "@/stores/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  checkIfUserExists,
  createUser,
  fetchSelf,
  UserToCreateType,
} from "@/services/userService";
import { Loading } from "@lemonsqueezy/wedges";
import jsCookie from "js-cookie";

interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

export default function FirebaseAuthProvider({
  children,
}: FirebaseAuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const routerRef = useRef(useRouter());
  const userStoreRef = useRef(useUserStore());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        userStoreRef.current.removeUser();
        routerRef.current.push("/login", { scroll: false });
        return;
      }

      const token = await user.getIdToken();
      jsCookie.set("token", token);

      if (userStoreRef.current.user) {
        setLoading(false);
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

      setLoading(false);

      routerRef.current.push("/");
    });

    return () => unsubscribe();
  }, [routerRef, userStoreRef]);

  if (loading) {
    return (
      <body>
        <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
          <Loading type="dots" size="xs" />
        </div>
      </body>
    );
  }

  return <>{children}</>;
}
