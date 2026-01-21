import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type FavoritePlace = {
  id: string;
  title: string;
  rating: number;
  image: any;
};

type FavoritesStore = {
  favorites: FavoritePlace[];

  addFavorite: (place: FavoritePlace) => void;
  removeFavorite: (id: string) => FavoritePlace | null;
  restoreFavorite: (place: FavoritePlace) => void;

  toggleFavorite: (place: FavoritePlace) => void;
  isFavorite: (id: string) => boolean;
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

      isFavorite: (id) =>
        get().favorites.some((p) => p.id === id),
    }),
    {
      name: "turismap-favorites",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
