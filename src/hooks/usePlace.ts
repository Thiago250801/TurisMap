import { ImageSourcePropType } from "react-native";
import { suggestions, popularPlaces } from "../data/mockData";

export const getPlaceImage = (placeId: string): ImageSourcePropType | null => {
  // Combina os dois arrays
  const allPlaces = [...suggestions, ...popularPlaces];
  
  // Remove duplicatas (se houver) mantendo o primeiro
  const uniquePlaces = Array.from(
    new Map(allPlaces.map(p => [p.id, p])).values()
  );
  
  const place = uniquePlaces.find((p) => p.id === placeId);
  return place?.image || null;
};

export const getPlaceData = (placeId: string) => {
  let place = suggestions.find((p) => p.id === placeId);
  if (!place) {
    place = popularPlaces.find((p) => p.id === placeId);
  }
  return place || null;
};