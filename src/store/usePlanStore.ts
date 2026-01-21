import { create } from "zustand";

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
  addPlan: (plan: Plan) => void;
  removePlan: (id: string) => void;
};

export const usePlansStore = create<PlansStore>((set) => ({
  plans: [],

  addPlan: (plan) =>
    set((state) => ({
      plans: [...state.plans, plan],
    })),

  removePlan: (id) =>
    set((state) => ({
      plans: state.plans.filter((plan) => plan.id !== id),
    })),
}));
