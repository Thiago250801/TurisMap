import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService, UserProfile } from "../services/authService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

export type UserType = "tourist" | "seller";

export type User = {
  id: string;
  email: string;
  name: string;
  type: UserType;
  createdAt: string;
  photoURL?: string;
};

export type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: UserType | null;

  login: (email: string, password: string, userType: UserType) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    userType: UserType,
  ) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  initAuthListener: () => void;

  isUserType: (type: UserType) => boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      userType: null,

      login: async (email: string, password: string, userType: UserType) => {
        set({ isLoading: true });

        try {
          const { profile } = await authService.loginUser(email, password);

          if (profile.type !== userType) {
            await authService.logoutUser();
            throw new Error(
              `Este email está registrado como ${
                profile.type === "tourist" ? "turista" : "comerciante"
              }`,
            );
          }

          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            type: profile.type,
            createdAt: profile.createdAt,
            photoURL: profile.photoURL,
          };

          set({
            user,
            isAuthenticated: true,
            userType: profile.type,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (
        email: string,
        password: string,
        name: string,
        userType: UserType,
      ) => {
        set({ isLoading: true });

        try {
          if (!email || !password || !name) {
            throw new Error("Preencha todos os campos");
          }

          if (password.length < 6) {
            throw new Error("Senha deve ter no mínimo 6 caracteres");
          }

          const profile = await authService.registerUser(
            email,
            password,
            name,
            userType,
          );

          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            type: profile.type,
            createdAt: profile.createdAt,
            photoURL: profile.photoURL,
          };

          set({
            user,
            isAuthenticated: true,
            userType,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logoutUser();

          set({
            user: null,
            isAuthenticated: false,
            userType: null,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw new Error("Falha ao fazer logout. Tente novamente.");
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initAuthListener: () => {
        // Guard against null `auth` (Firebase may have failed to initialize).
        // If `auth` is not available, ensure store is in a non-loading unauthenticated state.
        if (!auth) {
          set({
            user: null,
            isAuthenticated: false,
            userType: null,
            isLoading: false,
          });
          return;
        }

        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const profile = await authService.getUserProfile(firebaseUser.uid);

            if (profile) {
              const user: User = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                type: profile.type,
                createdAt: profile.createdAt,
                photoURL: profile.photoURL,
              };

              set({
                user,
                isAuthenticated: true,
                userType: profile.type,
                isLoading: false,
              });
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              userType: null,
              isLoading: false,
            });
          }
        });
      },

      isUserType: (type: UserType) => {
        return get().userType === type && get().isAuthenticated;
      },
    }),
    {
      name: "turismap-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        userType: state.userType,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
