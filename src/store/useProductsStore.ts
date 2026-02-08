import { create } from "zustand";
import { productService, Product } from "../services/productService";

type ProductsStore = {
  products: Product[];
  isLoading: boolean;

  loadAllProducts: () => Promise<void>;
  loadAvailableProducts: () => Promise<void>;
  loadProductsByPlace: (placeId: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
};

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  isLoading: false,

  loadAllProducts: async () => {
    set({ isLoading: true });

    try {
      const products = await productService.getAllProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadAvailableProducts: async () => {
    set({ isLoading: true });

    try {
      const products = await productService.getAvailableProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadProductsByPlace: async (placeId: string) => {
    set({ isLoading: true });

    try {
      const products = await productService.getProductsByPlace(placeId);
      set({ products, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getProduct: (id: string) => {
    return get().products.find((p) => p.id === id);
  },
}));
