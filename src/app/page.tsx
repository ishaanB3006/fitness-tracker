import { getAllWorkouts, getAllMealPlans } from "@/lib/contentstack";
import { HomePageWrapper } from "@/components/home/HomePageWrapper";
import {
  workouts as staticWorkouts,
  mealPlans as staticMealPlans,
} from "@/cms/data";
import { Workout, MealPlan } from "@/cms/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let workouts: Workout[] = [];
  let mealPlans: MealPlan[] = [];

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
    workouts = staticWorkouts;
    mealPlans = staticMealPlans;
  }

  return <HomePageWrapper workouts={workouts} mealPlans={mealPlans} />;
}
