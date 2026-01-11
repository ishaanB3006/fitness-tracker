import { getAllWorkouts, getAllMealPlans } from "@/lib/contentstack";
import { HomeClient } from "@/components/home/HomeClient";
import {
  workouts as staticWorkouts,
  mealPlans as staticMealPlans,
} from "@/cms/data";
import { Workout, MealPlan } from "@/cms/types";

export const dynamic = "force-dynamic";

export default async function HomePageSSR() {
  let workouts: Workout[] = [];
  let mealPlans: MealPlan[] = [];
  let error: string | null = null;

  try {
    const [fetchedWorkouts, fetchedMealPlans] = await Promise.all([
      getAllWorkouts(),
      getAllMealPlans(),
    ]);

    workouts =
      fetchedWorkouts && fetchedWorkouts.length > 0
        ? fetchedWorkouts
        : staticWorkouts;
    mealPlans =
      fetchedMealPlans && fetchedMealPlans.length > 0
        ? fetchedMealPlans
        : staticMealPlans;
  } catch (err) {
    console.error("Failed to fetch data for home page SSR:", err);
    error =
      err instanceof Error ? err.message : "Failed to load home page content.";
    workouts = staticWorkouts;
    mealPlans = staticMealPlans;
  }

  return <HomeClient workouts={workouts} mealPlans={mealPlans} />;
}
