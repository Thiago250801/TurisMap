import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FavoritePlace = {
  id: string;
  title: string;
  rating: number;
  image: any;
};

type FavoritesStore = {
  favorites: FavoritePlace[];
  toggleFavorite: (place: FavoritePlace) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (place) => {
        const exists = get().favorites.some(
          (item) => item.id === place.id
        );

        set({
          favorites: exists
            ? get().favorites.filter((item) => item.id !== place.id)
            : [...get().favorites, place],
        });
      },

      removeFavorite: (id) => {
        set({
          favorites: get().favorites.filter(
            (item) => item.id !== id
          ),
        });
      },

      isFavorite: (id) =>
        get().favorites.some((item) => item.id === id),
    }),
    {
      name: "turismap-favorites",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
