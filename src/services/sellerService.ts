import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type Seller = {
  id: string;
  userId: string;
  storeName: string;
  storeDescription: string;
  storeOwner: string;
  storeLogo?: string; // Base64 image
  pixKey: string;
  pixKeyType: "cpf" | "cnpj" | "email" | "phone" | "random";
  createdAt: string;
  updatedAt: string;
};

export const sellerService = {
  async createSeller(
    userId: string,
    sellerData: Omit<
      Seller,
      "id" | "userId" | "createdAt" | "updatedAt"
    >,
  ): Promise<Seller> {
    const sellerRef = doc(db, "sellers", userId);

    const seller: Seller = {
      ...sellerData,
      id: userId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(sellerRef, seller);

    return seller;
  },

  async updateSeller(
    userId: string,
    updates: Partial<Omit<Seller, "id" | "userId" | "createdAt">>,
  ): Promise<void> {
    const sellerRef = doc(db, "sellers", userId);

    await updateDoc(sellerRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async setSeller(
    userId: string,
    sellerData: Omit<
      Seller,
      "id" | "userId" | "createdAt" | "updatedAt"
    >,
  ): Promise<Seller> {
    const sellerRef = doc(db, "sellers", userId);

    // Verificar se já existe
    const existingDoc = await getDoc(sellerRef);
    const now = new Date().toISOString();

    const seller: Seller = {
      id: userId,
      userId,
      ...sellerData,
      createdAt: existingDoc.exists()
        ? (existingDoc.data() as Seller).createdAt
        : now,
      updatedAt: now,
    };

    await setDoc(sellerRef, seller, { merge: true });

    return seller;
  },

  async deleteSeller(userId: string): Promise<void> {
    const sellerRef = doc(db, "sellers", userId);
    await deleteDoc(sellerRef);
  },

  async getSeller(userId: string): Promise<Seller | null> {
    const sellerDoc = await getDoc(doc(db, "sellers", userId));

    if (!sellerDoc.exists()) {
      return null;
    }

    return sellerDoc.data() as Seller;
  },

  async getAllSellers(): Promise<Seller[]> {
    const querySnapshot = await getDocs(collection(db, "sellers"));

    return querySnapshot.docs.map((doc) => doc.data() as Seller);
  },

  async getSellersByOwner(ownerName: string): Promise<Seller[]> {
    const q = query(
      collection(db, "sellers"),
      where("storeOwner", "==", ownerName),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as Seller);
  },

  async updateStoreName(userId: string, storeName: string): Promise<void> {
    const sellerRef = doc(db, "sellers", userId);

    await updateDoc(sellerRef, {
      storeName,
      updatedAt: new Date().toISOString(),
    });
  },

  async updateStoreDescription(
    userId: string,
    storeDescription: string,
  ): Promise<void> {
    const sellerRef = doc(db, "sellers", userId);

    await updateDoc(sellerRef, {
      storeDescription,
      updatedAt: new Date().toISOString(),
    });
  },

  async updateStoreLogo(
    userId: string,
    storeLogo: string | null,
  ): Promise<void> {
    const sellerRef = doc(db, "sellers", userId);

    await updateDoc(sellerRef, {
      storeLogo: storeLogo || null,
      updatedAt: new Date().toISOString(),
    });
  },

  async updatePixInfo(
    userId: string,
    pixKey: string,
    pixKeyType: "cpf" | "cnpj" | "email" | "phone" | "random",
  ): Promise<void> {
    const sellerRef = doc(db, "sellers", userId);

    await updateDoc(sellerRef, {
      pixKey,
      pixKeyType,
      updatedAt: new Date().toISOString(),
    });
  },
};