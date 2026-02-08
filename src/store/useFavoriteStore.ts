import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageSourcePropType } from "react-native";
import { favoriteService } from "../services/favoriteService";

export type FavoritePlace = {
  id: string;
  title: string;
  rating: number;
  image: ImageSourcePropType | string;
};

type FavoritesStore = {
  favorites: FavoritePlace[];
  // Local-only helpers
  addFavorite: (place: FavoritePlace) => void;
  removeFavorite: (id: string) => FavoritePlace | null;
  restoreFavorite: (place: FavoritePlace) => void;
  toggleFavorite: (place: FavoritePlace) => void;
  isFavorite: (id: string) => boolean;
  // Remote / Firestore-aware methods
  loadFavorites: (userId: string) => Promise<void>;
  addFavoriteRemote: (userId: string, place: FavoritePlace) => Promise<void>;
  removeFavoriteRemote: (userId: string, placeId: string) => Promise<void>;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (place) =>
        set({
          favorites: [...get().favorites, place],
        }),
      removeFavorite: (id) => {
        const place = get().favorites.find((p) => p.id === id);
        if (!place) return null;
        set({
          favorites: get().favorites.filter((p) => p.id !== id),
        });
        return place;
      },
      restoreFavorite: (place) =>
        set({
          favorites: [place, ...get().favorites],
        }),
      toggleFavorite: (place) => {
        const exists = get().favorites.some((p) => p.id === place.id);
        set({
          favorites: exists
            ? get().favorites.filter((p) => p.id !== place.id)
            : [...get().favorites, place],
        });
      },
      isFavorite: (id) => get().favorites.some((p) => p.id === id),
      
      // Load favorites from Firestore
      // Só recupera id, title, rating (sem imagem)
      // A imagem é buscada localmente no componente
      loadFavorites: async (userId: string) => {
        try {
          const favs = await favoriteService.getUserFavorites(userId);
          const mapped = favs.map((f) => ({
            id: f.placeId,
            title: f.title,
            rating: f.rating,
            image: "", // Vazio aqui, busca localmente no componente
          }));
          set({ favorites: mapped });
        } catch (error) {
          console.error("Failed to load favorites:", error);
          set({ favorites: [] });
          throw error;
        }
      },
      
      // Add favorite remotely
      // Não envia imagem ao Firebase, só metadata
      addFavoriteRemote: async (userId: string, place: FavoritePlace) => {
        try {
          await favoriteService.addFavorite(
            userId,
            place.id,
            place.title,
            place.rating,
            "", 
          );
          set({ favorites: [...get().favorites, place] });
        } catch (error) {
          console.error("Failed to add favorite:", error);
          throw error;
        }
      },
      
      // Remove favorite remotely and update local state
      removeFavoriteRemote: async (userId: string, placeId: string) => {
        try {
          const favId = await favoriteService.getFavoriteId(userId, placeId);
          if (favId) {
            await favoriteService.removeFavorite(favId);
          }
          set({ favorites: get().favorites.filter((p) => p.id !== placeId) });
        } catch (error) {
          console.error("Failed to remove favorite:", error);
          throw error;
        }
      },
    }),
    {
      name: "turismap-favorites",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);