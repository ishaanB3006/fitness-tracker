// =============================================================================
// Weekly Planner Store
// =============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WeeklyPlan, PlannedDay, Workout, MealPlan } from "@/cms/types";

interface PlannerState {
  currentPlan: WeeklyPlan | null;
  savedPlans: WeeklyPlan[];
  setPlan: (plan: WeeklyPlan) => void;
  updateDay: (dayIndex: number, updates: Partial<PlannedDay>) => void;
  markDayCompleted: (dayIndex: number) => void;
  setDayWorkout: (dayIndex: number, workout: Workout | undefined) => void;
  setDayMealPlan: (dayIndex: number, mealPlan: MealPlan | undefined) => void;
  toggleRestDay: (dayIndex: number) => void;
  savePlan: () => void;
  loadPlan: (planId: string) => void;
  clearCurrentPlan: () => void;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      savedPlans: [],

      setPlan: (plan) =>
        set({
          currentPlan: { ...plan, updatedAt: new Date().toISOString() },
        }),

      updateDay: (dayIndex, updates) =>
        set((state) => {
          if (!state.currentPlan) return state;
          const newDays = [...state.currentPlan.days];
          newDays[dayIndex] = { ...newDays[dayIndex], ...updates };
          return {
            currentPlan: {
              ...state.currentPlan,
              days: newDays,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      markDayCompleted: (dayIndex) =>
        set((state) => {
          if (!state.currentPlan) return state;
          const newDays = [...state.currentPlan.days];
          newDays[dayIndex] = { ...newDays[dayIndex], isCompleted: true };
          return {
            currentPlan: {
              ...state.currentPlan,
              days: newDays,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      setDayWorkout: (dayIndex, workout) =>
        set((state) => {
          if (!state.currentPlan) return state;
          const newDays = [...state.currentPlan.days];
          newDays[dayIndex] = {
            ...newDays[dayIndex],
            workout,
            isRestDay: !workout,
          };
          return {
            currentPlan: {
              ...state.currentPlan,
              days: newDays,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      setDayMealPlan: (dayIndex, mealPlan) =>
        set((state) => {
          if (!state.currentPlan) return state;
          const newDays = [...state.currentPlan.days];
          newDays[dayIndex] = { ...newDays[dayIndex], mealPlan };
          return {
            currentPlan: {
              ...state.currentPlan,
              days: newDays,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      toggleRestDay: (dayIndex) =>
        set((state) => {
          if (!state.currentPlan) return state;
          const newDays = [...state.currentPlan.days];
          const isCurrentlyRest = newDays[dayIndex].isRestDay;
          newDays[dayIndex] = {
            ...newDays[dayIndex],
            isRestDay: !isCurrentlyRest,
            workout: isCurrentlyRest ? newDays[dayIndex].workout : undefined,
          };
          return {
            currentPlan: {
              ...state.currentPlan,
              days: newDays,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      savePlan: () =>
        set((state) => {
          if (!state.currentPlan) return state;
          const existingIndex = state.savedPlans.findIndex(
            (p) => p.id === state.currentPlan!.id
          );
          const newSavedPlans =
            existingIndex >= 0
              ? state.savedPlans.map((p, i) =>
                  i === existingIndex ? state.currentPlan! : p
                )
              : [...state.savedPlans, state.currentPlan];
          return { savedPlans: newSavedPlans };
        }),

      loadPlan: (planId) =>
        set((state) => {
          const plan = state.savedPlans.find((p) => p.id === planId);
          return plan ? { currentPlan: plan } : state;
        }),

      clearCurrentPlan: () => set({ currentPlan: null }),
    }),
    {
      name: "fitness-planner-storage",
    }
  )
);

