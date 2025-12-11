// =============================================================================
// User Progress Store
// =============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProgress, Achievement, WeeklyProgress } from "@/cms/types";
import { demoUserProgress, achievements as defaultAchievements } from "@/cms/data";

interface ProgressState {
  progress: UserProgress;
  addWorkoutCompleted: (minutes: number, calories: number) => void;
  updateStreak: (isActive: boolean) => void;
  unlockAchievement: (achievementId: string) => void;
  addWeeklyProgress: (weekProgress: WeeklyProgress) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: demoUserProgress,

      addWorkoutCompleted: (minutes, calories) =>
        set((state) => ({
          progress: {
            ...state.progress,
            workoutsCompleted: state.progress.workoutsCompleted + 1,
            totalMinutes: state.progress.totalMinutes + minutes,
            totalCaloriesBurned: state.progress.totalCaloriesBurned + calories,
            currentStreak: state.progress.currentStreak + 1,
            longestStreak: Math.max(
              state.progress.longestStreak,
              state.progress.currentStreak + 1
            ),
          },
        })),

      updateStreak: (isActive) =>
        set((state) => ({
          progress: {
            ...state.progress,
            currentStreak: isActive ? state.progress.currentStreak + 1 : 0,
            longestStreak: isActive
              ? Math.max(state.progress.longestStreak, state.progress.currentStreak + 1)
              : state.progress.longestStreak,
          },
        })),

      unlockAchievement: (achievementId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            achievements: state.progress.achievements.map((a) =>
              a.id === achievementId
                ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
                : a
            ),
          },
        })),

      addWeeklyProgress: (weekProgress) =>
        set((state) => ({
          progress: {
            ...state.progress,
            weeklyProgress: [...state.progress.weeklyProgress, weekProgress],
          },
        })),

      resetProgress: () =>
        set({
          progress: {
            userId: "demo-user",
            workoutsCompleted: 0,
            totalMinutes: 0,
            totalCaloriesBurned: 0,
            currentStreak: 0,
            longestStreak: 0,
            weeklyProgress: [],
            achievements: defaultAchievements.map((a) => ({
              ...a,
              isUnlocked: false,
              unlockedAt: undefined,
            })),
          },
        }),
    }),
    {
      name: "fitness-progress-storage",
    }
  )
);

