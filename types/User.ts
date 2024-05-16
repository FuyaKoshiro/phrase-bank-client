import { User as FirebaseUser } from "firebase/auth";

export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt?: string;
};

export function extractUserFromFirebaseUser(user: FirebaseUser) {
  return {
    id: user.uid,
    email: user.email || "",
    name: user.displayName || "",
    avatar: user.photoURL || "",
    createdAt: user.metadata.creationTime,
  } as User;
}
