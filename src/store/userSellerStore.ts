import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { productService } from "../services/productService";

export type SellerProduct = {
  id: string;
  title: string;
  price: number;
  description: string;
  image?: string;
  available: boolean;
  placeIds: string[];
};

export type SellerStore = {
  products: SellerProduct[];
  isLoading: boolean;

  loadProducts: (sellerId: string) => Promise<void>;
  addProduct: (
    sellerId: string,
    sellerName: string,
    product: Omit<SellerProduct, "id">,
  ) => Promise<void>;
  updateProduct: (id: string, updates: Partial<SellerProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => SellerProduct | undefined;

  // Store Info
  storeName: string;
  storeOwner: string;
  storeDescription: string;
  storeLogo: string | null;
  pixKey: string;
  pixKeyType: "cpf" | "cnpj" | "email" | "phone" | "random";

  // Store Info Methods
  setStoreInfo: (name: string, owner: string, description: string) => void;
  setStoreLogo: (logo: string | null) => void;
  setPixInfo: (key: string, type: "cpf" | "cnpj" | "email" | "phone" | "random") => void;
};

export const useSellerStore = create<SellerStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,

      // Store Info
      storeName: "",
      storeOwner: "",
      storeDescription: "",
      storeLogo: null,
      pixKey: "",
      pixKeyType: "cpf",

      loadProducts: async (sellerId: string) => {
        set({ isLoading: true });

        try {
          const products = await productService.getProductsBySeller(sellerId);

          const sellerProducts: SellerProduct[] = products.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            description: p.description,
            image: p.image,
            available: p.available,
            // Some product documents may not include placeIds — default to empty array
            placeIds: (p as any).placeIds || [],
          }));

          set({ products: sellerProducts, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      addProduct: async (
        sellerId: string,
        sellerName: string,
        product: Omit<SellerProduct, "id">,
      ) => {
        set({ isLoading: true });

        try {
          const createdProduct = await productService.createProduct(
            sellerId,
            sellerName,
            product,
          );

          const sellerProduct: SellerProduct = {
            id: createdProduct.id,
            title: createdProduct.title,
            price: createdProduct.price,
            description: createdProduct.description,
            image: createdProduct.image,
            available: createdProduct.available,
            // createdProduct may not include placeIds — ensure SellerProduct has the field
            placeIds: (createdProduct as any).placeIds || [],
          };

          set((state) => ({
            products: [...state.products, sellerProduct],
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateProduct: async (id: string, updates: Partial<SellerProduct>) => {
        set({ isLoading: true });

        try {
          await productService.updateProduct(id, updates);

          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? { ...p, ...updates } : p,
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteProduct: async (id: string) => {
        set({ isLoading: true });

        try {
          await productService.deleteProduct(id);

          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      getProduct: (id) => {
        const products = get().products;
        return products.find((p) => p.id === id);
      },

      setStoreInfo: (name, owner, description) =>
        set({
          storeName: name,
          storeOwner: owner,
          storeDescription: description,
        }),

      setStoreLogo: (logo) =>
        set({
          storeLogo: logo,
        }),

      setPixInfo: (key, type) =>
        set({
          pixKey: key,
          pixKeyType: type,
        }),
    }),
    {
      name: "turismap-seller",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        products: state.products,
        storeName: state.storeName,
        storeOwner: state.storeOwner,
        storeDescription: state.storeDescription,
        storeLogo: state.storeLogo,
        pixKey: state.pixKey,
        pixKeyType: state.pixKeyType,
      }),
    },
  ),
);