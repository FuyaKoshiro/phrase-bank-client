"use client";

import { useCreateUser, useFetchSelf } from "@/hooks/user/user";
import { auth } from "@/configs/firebase";
import { useUserStore } from "@/stores/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
      if (!user) {
        userStore.removeUser();
        router.push("/login", { scroll: false });
        return;
      }

      const userExists = await checkIfUserExists();
      console.log("userExists", userExists);

      if (!userExists) {
        const userToCreate: UserToCreateType = {
          id: user!.uid,
          email: user!.email!,
          name: user!.displayName!,
          avatar: user!.photoURL!,
        };

        const createdUser = await createUserResult.mutateAsync(userToCreate);
        userStore.setUser(createdUser);
      } else {
        const userFromDbResponse = await fetchSelfResult.refetch();
        userStore.setUser(userFromDbResponse.data!);
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
