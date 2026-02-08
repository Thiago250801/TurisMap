import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserType } from "../store/useAuthStore";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  type: UserType;
  createdAt: string;
  photoURL?: string;
};

export const authService = {
  async registerUser(
    email: string,
    password: string,
    name: string,
    userType: UserType,
  ): Promise<UserProfile> {
    const userCredential = await createUserWithEmailAndPassword(
      auth as any,
      email,
      password,
    );
    const user = userCredential.user;

    const userProfile: UserProfile = {
      id: user.uid,
      email: user.email!,
      name,
      type: userType,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db as any, "users", user.uid), userProfile);

    return userProfile;
  },

  async loginUser(
    email: string,
    password: string,
  ): Promise<{ firebaseUser: FirebaseUser; profile: UserProfile }> {
    const userCredential = await signInWithEmailAndPassword(
      auth as any,
      email,
      password,
    );
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db as any, "users", user.uid));

    if (!userDoc.exists()) {
      throw new Error("Perfil de usuário não encontrado");
    }

    const profile = userDoc.data() as UserProfile;

    return { firebaseUser: user, profile };
  },

  async logoutUser(): Promise<void> {
    await signOut(auth as any);
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDoc = await getDoc(doc(db as any, "users", uid));

    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as UserProfile;
  },

  getCurrentUser(): FirebaseUser | null {
    return auth ? (auth as any).currentUser : null;
  },
};
