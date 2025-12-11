// =============================================================================
// Personalization Types
// =============================================================================

import { Difficulty, GoalType, DietType, Equipment, AllergyTag } from "@/cms/types";

export type AudienceTag =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "weight-loss"
  | "strength"
  | "endurance"
  | "flexibility"
  | "time-poor"
  | "no-equipment"
  | "high-engagement"
  | "low-engagement";

export interface UserAudienceProfile {
  tags: AudienceTag[];
  fitnessLevel: Difficulty;
  goals: GoalType[];
  dietPreference?: DietType;
  allergies: AllergyTag[];
  availableEquipment: Equipment[];
  maxWorkoutDuration: number;
  weeklyWorkoutTarget: number;
  engagementScore: number; // 0-100
  completionRate: number; // 0-100
}

export interface PersonalizationRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  action: RuleAction;
  priority: number;
}

export interface RuleCondition {
  field: keyof UserAudienceProfile | "tag";
  operator: "equals" | "contains" | "greaterThan" | "lessThan" | "in";
  value: string | number | string[] | AudienceTag;
}

export type RuleAction =
  | { type: "recommend_program"; programId: string }
  | { type: "recommend_workout"; workoutId: string }
  | { type: "recommend_meal"; mealPlanId: string }
  | { type: "filter_by_difficulty"; difficulty: Difficulty }
  | { type: "filter_by_equipment"; equipment: Equipment[] }
  | { type: "filter_by_duration"; maxMinutes: number }
  | { type: "upgrade_difficulty" }
  | { type: "show_beginner_content" }
  | { type: "show_motivation" };

export interface PersonalizedRecommendation {
  type: "workout" | "program" | "mealPlan" | "challenge";
  id: string;
  score: number;
  reason: string;
}

