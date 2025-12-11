// =============================================================================
// CMS Client - Fetching utilities for all content types
// Replace these with actual CMS API calls when integrating with Contentstack/Contentful/Strapi
// =============================================================================

import {
  Workout,
  WorkoutProgram,
  MealPlan,
  Goal,
  BrandCampaign,
  SponsoredChallenge,
  ProductPlacement,
  Coupon,
  Difficulty,
  GoalType,
  Equipment,
  DietType,
  AllergyTag,
} from "./types";
import {
  workouts,
  workoutPrograms,
  mealPlans,
  defaultGoals,
  brandCampaigns,
  sponsoredChallenges,
  productPlacements,
  coupons,
} from "./data";

// =============================================================================
// Workout Fetchers
// =============================================================================

export async function getWorkouts(): Promise<Workout[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return workouts;
}

export async function getWorkout(id: string): Promise<Workout | null> {
  // Try to fetch from Contentstack first
  try {
    const { getWorkoutById } = await import("@/lib/contentstack");
    return await getWorkoutById(id);
  } catch (error) {
    console.error("Error fetching workout from Contentstack, falling back to local data:", error);
    // Fallback to local data if Contentstack fails
    await new Promise((resolve) => setTimeout(resolve, 100));
    return workouts.find((w) => w.id === id) || null;
  }
}

export async function getWorkoutsByDifficulty(difficulty: Difficulty): Promise<Workout[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return workouts.filter((w) => w.difficulty === difficulty);
}

export async function getWorkoutsByEquipment(equipment: Equipment[]): Promise<Workout[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (equipment.length === 0 || equipment.includes("none")) {
    return workouts.filter(
      (w) => w.equipment.length === 0 || w.equipment.includes("none")
    );
  }
  return workouts.filter((w) =>
    w.equipment.every((eq) => equipment.includes(eq) || eq === "none")
  );
}

export async function getWorkoutsByDuration(maxMinutes: number): Promise<Workout[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return workouts.filter((w) => w.duration <= maxMinutes);
}

export async function getQuickWorkouts(): Promise<Workout[]> {
  return getWorkoutsByDuration(20);
}

// =============================================================================
// Workout Program Fetchers
// =============================================================================

export async function getWorkoutPrograms(): Promise<WorkoutProgram[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return workoutPrograms;
}

export async function getWorkoutProgram(id: string): Promise<WorkoutProgram | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return workoutPrograms.find((p) => p.id === id) || null;
}

export async function getFeaturedPrograms(): Promise<WorkoutProgram[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return workoutPrograms.filter((p) => p.featured);
}

export async function getProgramsByGoal(goal: GoalType): Promise<WorkoutProgram[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return workoutPrograms.filter((p) => p.goal === goal);
}

// =============================================================================
// Meal Plan Fetchers
// =============================================================================

export async function getMealPlans(): Promise<MealPlan[]> {
  // Try to fetch from Contentstack first
  try {
    const { getAllMealPlans } = await import("@/lib/contentstack");
    return await getAllMealPlans();
  } catch (error) {
    console.error("Error fetching meal plans from Contentstack, falling back to local data:", error);
    // Fallback to local data if Contentstack fails
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mealPlans;
  }
}

export async function getMealPlan(id: string): Promise<MealPlan | null> {
  // Try to fetch from Contentstack first
  try {
    const { getMealPlanById } = await import("@/lib/contentstack");
    return await getMealPlanById(id);
  } catch (error) {
    console.error("Error fetching meal plan from Contentstack, falling back to local data:", error);
    // Fallback to local data if Contentstack fails
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mealPlans.find((m) => m.id === id) || null;
  }
}

export async function getMealPlansByDiet(dietType: DietType): Promise<MealPlan[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mealPlans.filter((m) => m.dietType === dietType);
}

export async function getMealPlansWithoutAllergies(allergies: AllergyTag[]): Promise<MealPlan[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (allergies.length === 0) return mealPlans;
  return mealPlans.filter((m) =>
    allergies.every((allergy) => m.allergyTags.includes(allergy))
  );
}

// =============================================================================
// Goals Fetchers
// =============================================================================

export async function getGoals(): Promise<Goal[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return defaultGoals;
}

export async function getGoal(id: string): Promise<Goal | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return defaultGoals.find((g) => g.id === id) || null;
}

// =============================================================================
// Brand/B2B Fetchers
// =============================================================================

export async function getBrandCampaigns(): Promise<BrandCampaign[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return brandCampaigns;
}

export async function getBrandCampaign(id: string): Promise<BrandCampaign | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return brandCampaigns.find((c) => c.id === id) || null;
}

export async function getActiveCampaigns(): Promise<BrandCampaign[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return brandCampaigns.filter((c) => c.status === "active");
}

export async function getSponsoredChallenges(): Promise<SponsoredChallenge[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return sponsoredChallenges;
}

export async function getSponsoredChallenge(id: string): Promise<SponsoredChallenge | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return sponsoredChallenges.find((c) => c.id === id) || null;
}

export async function getProductPlacements(): Promise<ProductPlacement[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return productPlacements;
}

export async function getActiveProductPlacements(): Promise<ProductPlacement[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return productPlacements.filter((p) => p.isActive);
}

export async function getProductPlacementsByLocation(
  location: ProductPlacement["placementLocation"]
): Promise<ProductPlacement[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return productPlacements.filter((p) => p.placementLocation === location && p.isActive);
}

export async function getCoupons(): Promise<Coupon[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return coupons;
}

export async function getActiveCoupons(): Promise<Coupon[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return coupons.filter((c) => c.isActive);
}

export async function getCoupon(code: string): Promise<Coupon | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return coupons.find((c) => c.code === code) || null;
}

