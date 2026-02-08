import { create } from "zustand";
import { Place, popularPlaces, suggestions } from "../data/mockData";


type PlacesStore = {
  popular: Place[];
  suggestions: Place[];
  all: Place[];
};

export const usePlacesStore = create<PlacesStore>(() => {
  const all = [...popularPlaces, ...suggestions];

  return {
    popular: popularPlaces,
    suggestions,
    all,
  };
});
