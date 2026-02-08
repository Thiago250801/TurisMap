import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { dbAny as db } from "./firebase";

export type Plan = {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  offline: boolean;
  places: string[];
  createdAt: string;
  updatedAt: string;
};

export const planService = {
  async createPlan(
    userId: string,
    planData: Omit<Plan, "id" | "userId" | "createdAt" | "updatedAt">,
  ): Promise<Plan> {
    const planRef = doc(collection(db, "plans"));

    const plan: Plan = {
      ...planData,
      id: planRef.id,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(planRef, plan);

    return plan;
  },

  async updatePlan(
    planId: string,
    updates: Partial<Omit<Plan, "id" | "userId" | "createdAt">>,
  ): Promise<void> {
    const planRef = doc(db, "plans", planId);

    await updateDoc(planRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async deletePlan(planId: string): Promise<void> {
    const planRef = doc(db, "plans", planId);
    await deleteDoc(planRef);
  },

  async getPlan(planId: string): Promise<Plan | null> {
    const planDoc = await getDoc(doc(db, "plans", planId));

    if (!planDoc.exists()) {
      return null;
    }

    return planDoc.data() as Plan;
  },

  async getUserPlans(userId: string): Promise<Plan[]> {
    const q = query(collection(db, "plans"), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as Plan);
  },
};
