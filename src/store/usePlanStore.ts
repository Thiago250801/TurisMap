import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { planService } from "../services/planService";

type Plan = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  offline: boolean;
  places: string[];
};

type PlansStore = {
  plans: Plan[];
  isLoading: boolean;

  loadPlans: (userId: string) => Promise<void>;
  addPlan: (userId: string, plan: Omit<Plan, "id">) => Promise<void>;
  removePlan: (id: string) => Promise<void>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
};

export const usePlansStore = create<PlansStore>()(
  persist(
    (set, get) => ({
      plans: [],
      isLoading: false,

      loadPlans: async (userId: string) => {
        set({ isLoading: true });

        try {
          const plans = await planService.getUserPlans(userId);

          const userPlans: Plan[] = plans.map((p) => ({
            id: p.id,
            name: p.name,
            startDate: p.startDate,
            endDate: p.endDate,
            offline: p.offline,
            places: p.places,
          }));

          set({ plans: userPlans, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      addPlan: async (userId: string, plan: Omit<Plan, "id">) => {
        set({ isLoading: true });

        try {
          const createdPlan = await planService.createPlan(userId, plan);

          const userPlan: Plan = {
            id: createdPlan.id,
            name: createdPlan.name,
            startDate: createdPlan.startDate,
            endDate: createdPlan.endDate,
            offline: createdPlan.offline,
            places: createdPlan.places,
          };

          set((state) => ({
            plans: [...state.plans, userPlan],
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      removePlan: async (id: string) => {
        set({ isLoading: true });

        try {
          await planService.deletePlan(id);

          set((state) => ({
            plans: state.plans.filter((plan) => plan.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updatePlan: async (id: string, updates: Partial<Plan>) => {
        set({ isLoading: true });

        try {
          await planService.updatePlan(id, updates);

          set((state) => ({
            plans: state.plans.map((plan) =>
              plan.id === id ? { ...plan, ...updates } : plan
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "turismap-plans",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        plans: state.plans,
      }),
    }
  )
);
