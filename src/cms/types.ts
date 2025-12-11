// =============================================================================
// CMS Types - Strongly typed models for all content
// =============================================================================

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "core"
  | "legs"
  | "glutes"
  | "full-body"
  | "cardio";
export type Equipment =
  | "dumbbells"
  | "barbell"
  | "kettlebell"
  | "resistance-bands"
  | "pull-up-bar"
  | "bench"
  | "cable-machine"
  | "treadmill"
  | "bike"
  | "none";
export type DietType =
  | "balanced"
  | "keto"
  | "vegan"
  | "vegetarian"
  | "paleo"
  | "mediterranean"
  | "high-protein"
  | "low-carb";
export type AllergyTag =
  | "gluten-free"
  | "dairy-free"
  | "nut-free"
  | "soy-free"
  | "egg-free"
  | "shellfish-free";
export type GoalType =
  | "weight-loss"
  | "muscle-gain"
  | "endurance"
  | "flexibility"
  | "general-fitness"
  | "strength";

// =============================================================================
// Workout Model
// =============================================================================
export interface Workout {
  id: string;
  title: string;
  description: string;
  muscleGroups: MuscleGroup[];
  difficulty: Difficulty;
  duration: number; // in minutes
  equipment: Equipment[];
  calories: number;
  videoUrl?: string;
  thumbnailUrl: string;
  exercises: Exercise[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g., "12" or "12-15" or "30 sec"
  restSeconds: number;
  notes?: string;
  videoUrl?: string;
}

// =============================================================================
// Workout Program Model
// =============================================================================
export interface WorkoutProgram {
  id: string;
  title: string;
  description: string;
  goal: GoalType;
  duration: ProgramDuration;
  difficulty: Difficulty;
  workoutsByDay: DayWorkout[];
  thumbnailUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProgramDuration = "7-day" | "14-day" | "30-day" | "60-day" | "90-day";

export interface DayWorkout {
  day: number;
  workoutId: string | null; // null = rest day
  isRestDay: boolean;
  notes?: string;
}

// =============================================================================
// Meal Plan Model
// =============================================================================
export interface MealPlan {
  id: string;
  title: string;
  description: string;
  dietType: DietType;
  macros: Macros;
  allergyTags: AllergyTag[];
  meals: Meal[];
  totalCalories: number;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Macros {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber?: number; // grams
}

export interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  macros: Macros;
  ingredients: string[];
  instructions?: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  imageUrl?: string;
}

// =============================================================================
// Goals Model
// =============================================================================
export interface Goal {
  id: string;
  goalName: string;
  description: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// User Profile Model
// =============================================================================
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  fitnessLevel: Difficulty;
  goals: GoalType[];
  dietPreference?: DietType;
  allergies: AllergyTag[];
  availableEquipment: Equipment[];
  preferredWorkoutDuration: number; // minutes
  workoutsPerWeek: number;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Progress & Stats
// =============================================================================
export interface UserProgress {
  userId: string;
  workoutsCompleted: number;
  totalMinutes: number;
  totalCaloriesBurned: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: WeeklyProgress[];
  achievements: Achievement[];
}

export interface WeeklyProgress {
  weekStart: string;
  workoutsCompleted: number;
  minutesExercised: number;
  caloriesBurned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

// =============================================================================
// Brand Manager / B2B Types
// =============================================================================
export interface BrandCampaign {
  id: string;
  brandName: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  status: "draft" | "active" | "paused" | "completed";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  createdAt: string;
  updatedAt: string;
}

export interface SponsoredChallenge {
  id: string;
  brandId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  reward: string;
  participants: number;
  completions: number;
  thumbnailUrl: string;
  workoutProgramId?: string;
}

export interface ProductPlacement {
  id: string;
  brandId: string;
  productName: string;
  productType: "supplement" | "equipment" | "apparel" | "food" | "app" | "other";
  placementLocation: "workout-detail" | "meal-plan" | "home" | "post-workout";
  imageUrl: string;
  linkUrl: string;
  impressions: number;
  clicks: number;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  brandId: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase?: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

// =============================================================================
// Weekly Plan
// =============================================================================
export interface WeeklyPlan {
  id: string;
  userId: string;
  weekStart: string;
  days: PlannedDay[];
  createdAt: string;
  updatedAt: string;
}

export interface PlannedDay {
  date: string;
  dayOfWeek: number;
  workout?: Workout;
  mealPlan?: MealPlan;
  isRestDay: boolean;
  isCompleted: boolean;
  notes?: string;
}

// =============================================================================
// Recovery Model
// =============================================================================
export type RecoveryType = "mental-wellness" | "sports-massage" | "stretching" | "meditation" | "breathing" | "foam-rolling" | "cryotherapy" | "sauna";

export interface Recovery {
  id: string;
  title: string;
  description: string;
  type: RecoveryType;
  duration: number; // in minutes
  difficulty: Difficulty;
  thumbnailUrl: string;
  benefits: string[];
  instructions?: string[];
  videoUrl?: string;
  tags: string[];
  requiresBooking?: boolean; // true for cryotherapy and sauna
  price?: number; // price for bookable services
  createdAt: string;
  updatedAt: string;
}

