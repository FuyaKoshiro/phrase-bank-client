import { auth } from "@/configs/firebase";
import { User } from "@/schemas/userSchema";
import {
  checkIfUserExists,
  createUser,
  fetchSelf,
} from "@/services/userService";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import jsCookie from "js-cookie";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      jsCookie.set("token", token);

      const userExists = await checkIfUserExists();

      if (!userExists) {
        if (!user.email || !user.displayName || !user.photoURL) {
          throw new Error("User does not have enough information");
        }

        const userToCreate = {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL,
        };

        const createdUser = await createUser(userToCreate);
        setUser(createdUser);
        setLoading(false);
      } else {
        const fetchedUser = await fetchSelf();
        setUser(fetchedUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useAuth;
