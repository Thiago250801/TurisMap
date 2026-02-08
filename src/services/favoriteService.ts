import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type Favorite = {
  id: string;
  userId: string;
  placeId: string;
  title: string;
  rating: number;
  image: string;
  createdAt: string;
};

export const favoriteService = {
  async addFavorite(
    userId: string,
    placeId: string,
    title: string,
    rating: number,
    image: string,
  ): Promise<Favorite> {
    const favoriteId = `${placeId}`;
    const favoriteRef = doc(collection(db, "favorites"));

    const favorite: Favorite = {
      id: favoriteId,
      userId,
      placeId,
      title,
      rating,
      image,
      createdAt: new Date().toISOString(),
    };

    await setDoc(favoriteRef, favorite);

    return favorite;
  },

  async removeFavorite(favoriteId: string): Promise<void> {
    const favoriteRef = doc(db, "favorites", favoriteId);
    await deleteDoc(favoriteRef);
  },

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const q = query(collection(db, "favorites"), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as Favorite);
  },

  async isFavorite(userId: string, placeId: string): Promise<boolean> {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("placeId", "==", placeId),
    );

    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  },

  async getFavoriteId(userId: string, placeId: string): Promise<string | null> {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("placeId", "==", placeId),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].id;
  },
};
