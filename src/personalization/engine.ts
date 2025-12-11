// =============================================================================
// Personalization Engine
// =============================================================================

import {
  UserAudienceProfile,
  PersonalizedRecommendation,
  AudienceTag,
} from "./types";
import { getMatchingRules } from "./rules";
import { workouts, workoutPrograms, mealPlans } from "@/cms/data";
import type { Workout, WorkoutProgram, MealPlan, WeeklyPlan, PlannedDay } from "@/cms/types";

// =============================================================================
// Audience Tagging
// =============================================================================

export function computeAudienceTags(profile: UserAudienceProfile): AudienceTag[] {
  const tags: AudienceTag[] = [];

  // Fitness level tags
  if (profile.fitnessLevel === "beginner") tags.push("beginner");
  if (profile.fitnessLevel === "intermediate") tags.push("intermediate");
  if (profile.fitnessLevel === "advanced") tags.push("advanced");

  // Goal tags
  if (profile.goals.includes("weight-loss")) tags.push("weight-loss");
  if (profile.goals.includes("strength") || profile.goals.includes("muscle-gain")) {
    tags.push("strength");
  }
  if (profile.goals.includes("endurance")) tags.push("endurance");
  if (profile.goals.includes("flexibility")) tags.push("flexibility");

  // Time tags
  if (profile.maxWorkoutDuration < 20) tags.push("time-poor");

  // Equipment tags
  if (
    profile.availableEquipment.length === 0 ||
    (profile.availableEquipment.length === 1 && profile.availableEquipment[0] === "none")
  ) {
    tags.push("no-equipment");
  }

  // Engagement tags
  if (profile.engagementScore >= 70) tags.push("high-engagement");
  if (profile.engagementScore < 30) tags.push("low-engagement");

  return tags;
}

// =============================================================================
// Personalized Workout Recommendations
// =============================================================================

export function getPersonalizedWorkouts(
  profile: UserAudienceProfile,
  limit: number = 5
): Workout[] {
  const matchingRules = getMatchingRules(profile as unknown as Record<string, unknown>);
  
  let filteredWorkouts = [...workouts];

  // Apply rules
  for (const rule of matchingRules) {
    switch (rule.action.type) {
      case "filter_by_difficulty": {
        const action = rule.action as { type: "filter_by_difficulty"; difficulty: string };
        filteredWorkouts = filteredWorkouts.filter(
          (w) => w.difficulty === action.difficulty
        );
        break;
      }

      case "filter_by_equipment": {
        const action = rule.action as { type: "filter_by_equipment"; equipment: string[] };
        filteredWorkouts = filteredWorkouts.filter(
          (w) =>
            w.equipment.length === 0 ||
            w.equipment.every((eq) => action.equipment.includes(eq)) ||
            w.equipment.includes("none")
        );
        break;
      }

      case "filter_by_duration": {
        const action = rule.action as { type: "filter_by_duration"; maxMinutes: number };
        filteredWorkouts = filteredWorkouts.filter(
          (w) => w.duration <= action.maxMinutes
        );
        break;
      }

      case "show_beginner_content":
        filteredWorkouts = filteredWorkouts.filter(
          (w) => w.difficulty === "beginner"
        );
        break;
    }
  }

  // Score and sort workouts
  const scoredWorkouts = filteredWorkouts.map((workout) => ({
    workout,
    score: calculateWorkoutScore(workout, profile),
  }));

  scoredWorkouts.sort((a, b) => b.score - a.score);

  return scoredWorkouts.slice(0, limit).map((s) => s.workout);
}

function calculateWorkoutScore(workout: Workout, profile: UserAudienceProfile): number {
  let score = 50;

  // Difficulty match
  if (workout.difficulty === profile.fitnessLevel) score += 20;
  
  // Duration preference
  if (workout.duration <= profile.maxWorkoutDuration) score += 15;
  
  // Equipment match
  if (
    workout.equipment.length === 0 ||
    workout.equipment.every((eq) => profile.availableEquipment.includes(eq) || eq === "none")
  ) {
    score += 10;
  }

  // Goal alignment
  if (profile.goals.includes("weight-loss") && workout.calories > 250) score += 10;
  if (profile.goals.includes("strength") && workout.muscleGroups.length > 2) score += 10;

  return score;
}

// =============================================================================
// Personalized Meal Plan Recommendations
// =============================================================================

export function getPersonalizedMealPlans(
  profile: UserAudienceProfile,
  limit: number = 3
): MealPlan[] {
  let filteredMeals = [...mealPlans];

  // Filter by diet preference
  if (profile.dietPreference) {
    const preferredMeals = filteredMeals.filter(
      (m) => m.dietType === profile.dietPreference
    );
    if (preferredMeals.length > 0) {
      filteredMeals = preferredMeals;
    }
  }

  // Filter by allergies
  if (profile.allergies.length > 0) {
    filteredMeals = filteredMeals.filter((meal) =>
      profile.allergies.every((allergy) => meal.allergyTags.includes(allergy))
    );
  }

  // Score meals based on goals
  const scoredMeals = filteredMeals.map((meal) => ({
    meal,
    score: calculateMealScore(meal, profile),
  }));

  scoredMeals.sort((a, b) => b.score - a.score);

  return scoredMeals.slice(0, limit).map((s) => s.meal);
}

function calculateMealScore(meal: MealPlan, profile: UserAudienceProfile): number {
  let score = 50;

  // Diet preference match
  if (meal.dietType === profile.dietPreference) score += 30;

  // Goal alignment
  if (profile.goals.includes("weight-loss") && meal.totalCalories < 2000) score += 15;
  if (profile.goals.includes("muscle-gain") && meal.macros.protein > 150) score += 15;
  if (profile.goals.includes("strength") && meal.macros.protein > 120) score += 10;

  return score;
}

// =============================================================================
// Personalized Program Recommendations
// =============================================================================

export function getPersonalizedPrograms(
  profile: UserAudienceProfile,
  limit: number = 3
): WorkoutProgram[] {
  const matchingRules = getMatchingRules(profile as unknown as Record<string, unknown>);
  
  // Check if any rule specifically recommends a program
  const recommendedProgramIds: string[] = [];
  for (const rule of matchingRules) {
    if (rule.action.type === "recommend_program") {
      recommendedProgramIds.push(rule.action.programId);
    }
  }

  // If we have recommended programs, prioritize them
  if (recommendedProgramIds.length > 0) {
    const recommended = workoutPrograms.filter((p) =>
      recommendedProgramIds.includes(p.id)
    );
    const others = workoutPrograms
      .filter((p) => !recommendedProgramIds.includes(p.id))
      .filter((p) => p.difficulty === profile.fitnessLevel);
    
    return [...recommended, ...others].slice(0, limit);
  }

  // Otherwise, filter and score
  const filteredPrograms = workoutPrograms.filter((p) => {
    // Match difficulty or one level adjacent
    const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
    const programDiff = difficultyOrder[p.difficulty];
    const userDiff = difficultyOrder[profile.fitnessLevel];
    return Math.abs(programDiff - userDiff) <= 1;
  });

  const scoredPrograms = filteredPrograms.map((program) => ({
    program,
    score: calculateProgramScore(program, profile),
  }));

  scoredPrograms.sort((a, b) => b.score - a.score);

  return scoredPrograms.slice(0, limit).map((s) => s.program);
}

function calculateProgramScore(
  program: WorkoutProgram,
  profile: UserAudienceProfile
): number {
  let score = 50;

  // Goal match
  if (profile.goals.includes(program.goal)) score += 30;

  // Difficulty match
  if (program.difficulty === profile.fitnessLevel) score += 20;

  // Featured bonus
  if (program.featured) score += 10;

  return score;
}

// =============================================================================
// Weekly Plan Generation
// =============================================================================

export function generateWeeklyPlan(
  profile: UserAudienceProfile,
  weekStart: string
): WeeklyPlan {
  const personalizedWorkouts = getPersonalizedWorkouts(profile, 10);
  const personalizedMeals = getPersonalizedMealPlans(profile, 5);
  
  const days: PlannedDay[] = [];
  const workoutsPerWeek = Math.min(profile.weeklyWorkoutTarget, 6);
  
  // Determine rest days (spread evenly)
  const restDayInterval = Math.floor(7 / (7 - workoutsPerWeek));
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    
    const isRestDay = (i + 1) % restDayInterval === 0 && days.filter(d => d.isRestDay).length < (7 - workoutsPerWeek);
    
    days.push({
      date: dateStr,
      dayOfWeek: i,
      workout: isRestDay ? undefined : personalizedWorkouts[i % personalizedWorkouts.length],
      mealPlan: personalizedMeals[i % personalizedMeals.length],
      isRestDay,
      isCompleted: false,
    });
  }

  return {
    id: `plan-${Date.now()}`,
    userId: "current-user",
    weekStart,
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// Get All Personalized Recommendations
// =============================================================================

export function getAllRecommendations(
  profile: UserAudienceProfile
): PersonalizedRecommendation[] {
  const recommendations: PersonalizedRecommendation[] = [];

  // Add workout recommendations
  const workouts = getPersonalizedWorkouts(profile, 3);
  workouts.forEach((workout, index) => {
    recommendations.push({
      type: "workout",
      id: workout.id,
      score: 100 - index * 10,
      reason: `Matches your ${profile.fitnessLevel} level and ${profile.goals[0] || "fitness"} goal`,
    });
  });

  // Add program recommendations
  const programs = getPersonalizedPrograms(profile, 2);
  programs.forEach((program, index) => {
    recommendations.push({
      type: "program",
      id: program.id,
      score: 95 - index * 10,
      reason: `Designed for ${program.goal} at ${program.difficulty} level`,
    });
  });

  // Add meal plan recommendations
  const meals = getPersonalizedMealPlans(profile, 2);
  meals.forEach((meal, index) => {
    recommendations.push({
      type: "mealPlan",
      id: meal.id,
      score: 90 - index * 10,
      reason: `${meal.dietType} diet with ${meal.macros.protein}g protein`,
    });
  });

  // Sort by score
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations;
}

