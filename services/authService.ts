import { auth } from "@/configs/firebase";
import { setCookie } from "@/queries/auth/utils/helpers";
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

export async function signUpWithGoogle() {
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

export async function signOut() {
  try {
    firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
}
