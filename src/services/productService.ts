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
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type Product = {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  price: number;
  description: string;
  image?: string;
  available: boolean;
  placeIds?: string[]; // optional array of place IDs where this product is available
  createdAt: string;
  updatedAt: string;
};

export const productService = {
  async createProduct(
    sellerId: string,
    sellerName: string,
    productData: Omit<
      Product,
      "id" | "sellerId" | "sellerName" | "createdAt" | "updatedAt"
    >,
  ): Promise<Product> {
    const productRef = doc(collection(db as any, "products"));

    const product: Product = {
      ...productData,
      id: productRef.id,
      sellerId,
      sellerName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(productRef, product);

    return product;
  },

  async updateProduct(
    productId: string,
    updates: Partial<Omit<Product, "id" | "sellerId" | "createdAt">>,
  ): Promise<void> {
    const productRef = doc(db, "products", productId);

    await updateDoc(productRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async deleteProduct(productId: string): Promise<void> {
    const productRef = doc(db as any, "products", productId);
    await deleteDoc(productRef);
  },

  async getProduct(productId: string): Promise<Product | null> {
    const productDoc = await getDoc(doc(db as any, "products", productId));

    if (!productDoc.exists()) {
      return null;
    }

    return productDoc.data() as Product;
  },

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    const q = query(
      collection(db as any, "products"),
      where("sellerId", "==", sellerId),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as Product);
  },

  async getAllProducts(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db as any, "products"));

    return querySnapshot.docs.map((doc) => doc.data() as Product);
  },

  async getAvailableProducts(): Promise<Product[]> {
    const q = query(collection(db, "products"), where("available", "==", true));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as Product);
  },

  async getProductsByPlace(placeId: string): Promise<Product[]> {
    // Query products where the placeIds array contains the provided placeId
    // and the product is available.
    const q = query(
      collection(db as any, "products"),
      where("placeIds", "array-contains", placeId),
      where("available", "==", true),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as Product);
  },
};
