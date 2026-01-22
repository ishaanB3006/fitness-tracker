"use client";

import { useState, useEffect } from "react";
import { getAllWorkouts, getAllMealPlans } from "@/lib/contentstack";
import { HomePageWrapper } from "@/components/home/HomePageWrapper";
import {
  workouts as staticWorkouts,
  mealPlans as staticMealPlans,
} from "@/cms/data";
import { Workout, MealPlan } from "@/cms/types";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>(staticWorkouts);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(staticMealPlans);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedWorkouts, fetchedMealPlans] = await Promise.all([
          getAllWorkouts(),
          getAllMealPlans(),
        ]);

        if (fetchedWorkouts && fetchedWorkouts.length > 0) {
          setWorkouts(fetchedWorkouts);
        }
        if (fetchedMealPlans && fetchedMealPlans.length > 0) {
          setMealPlans(fetchedMealPlans);
        }
      } catch (err) {
        console.error("Failed to fetch data for home page:", err);
        // Keep static data as fallback
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <HomePageWrapper workouts={workouts} mealPlans={mealPlans} />;
}
