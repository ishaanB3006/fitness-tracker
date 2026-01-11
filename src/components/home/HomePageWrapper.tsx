"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { HomeClient } from "./HomeClient";
import { Workout, MealPlan } from "@/cms/types";

interface HomePageWrapperProps {
  workouts: Workout[];
  mealPlans: MealPlan[];
}

export function HomePageWrapper({ workouts, mealPlans }: HomePageWrapperProps) {
  return (
    <ProtectedRoute>
      <HomeClient workouts={workouts} mealPlans={mealPlans} />
    </ProtectedRoute>
  );
}

