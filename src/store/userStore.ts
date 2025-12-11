// =============================================================================
// User Profile Store
// =============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  UserProfile,
  Difficulty,
  GoalType,
  DietType,
  Equipment,
  AllergyTag,
} from "@/cms/types";

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setFitnessLevel: (level: Difficulty) => void;
  setGoals: (goals: GoalType[]) => void;
  setDietPreference: (diet: DietType) => void;
  setAllergies: (allergies: AllergyTag[]) => void;
  setEquipment: (equipment: Equipment[]) => void;
  setWorkoutPreferences: (duration: number, perWeek: number) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  id: "user-1",
  name: "",
  email: "",
  fitnessLevel: "beginner",
  goals: [],
  allergies: [],
  availableEquipment: [],
  preferredWorkoutDuration: 30,
  workoutsPerWeek: 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isOnboarded: false,

      setProfile: (profile) =>
        set({
          profile: { ...profile, updatedAt: new Date().toISOString() },
        }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates, updatedAt: new Date().toISOString() }
            : { ...defaultProfile, ...updates },
        })),

      setFitnessLevel: (level) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, fitnessLevel: level, updatedAt: new Date().toISOString() }
            : { ...defaultProfile, fitnessLevel: level },
        })),

      setGoals: (goals) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, goals, updatedAt: new Date().toISOString() }
            : { ...defaultProfile, goals },
        })),

      setDietPreference: (diet) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, dietPreference: diet, updatedAt: new Date().toISOString() }
            : { ...defaultProfile, dietPreference: diet },
        })),

      setAllergies: (allergies) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, allergies, updatedAt: new Date().toISOString() }
            : { ...defaultProfile, allergies },
        })),

      setEquipment: (equipment) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, availableEquipment: equipment, updatedAt: new Date().toISOString() }
            : { ...defaultProfile, availableEquipment: equipment },
        })),

      setWorkoutPreferences: (duration, perWeek) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                preferredWorkoutDuration: duration,
                workoutsPerWeek: perWeek,
                updatedAt: new Date().toISOString(),
              }
            : {
                ...defaultProfile,
                preferredWorkoutDuration: duration,
                workoutsPerWeek: perWeek,
              },
        })),

      completeOnboarding: () => set({ isOnboarded: true }),

      resetProfile: () =>
        set({
          profile: null,
          isOnboarded: false,
        }),
    }),
    {
      name: "fitness-user-storage",
    }
  )
);

