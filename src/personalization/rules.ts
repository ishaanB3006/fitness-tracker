// =============================================================================
// Personalization Rules Engine
// =============================================================================

import { PersonalizationRule } from "./types";

export const personalizationRules: PersonalizationRule[] = [
  // Beginner Rules
  {
    id: "rule-beginner-weightloss",
    name: "Beginner + Weight Loss → Beginner HIIT",
    conditions: [
      { field: "fitnessLevel", operator: "equals", value: "beginner" },
      { field: "goals", operator: "contains", value: "weight-loss" },
    ],
    action: { type: "recommend_program", programId: "p3" }, // Beginner Bootcamp
    priority: 100,
  },
  {
    id: "rule-beginner-general",
    name: "Beginner → Show Beginner Content",
    conditions: [{ field: "fitnessLevel", operator: "equals", value: "beginner" }],
    action: { type: "show_beginner_content" },
    priority: 50,
  },

  // Equipment Rules
  {
    id: "rule-no-equipment",
    name: "No Equipment → Filter Bodyweight",
    conditions: [
      { field: "availableEquipment", operator: "equals", value: [] },
    ],
    action: { type: "filter_by_equipment", equipment: ["none"] },
    priority: 90,
  },

  // Time-Poor Rules
  {
    id: "rule-time-poor",
    name: "Time Poor (<20 min) → Quick Workouts",
    conditions: [{ field: "maxWorkoutDuration", operator: "lessThan", value: 20 }],
    action: { type: "filter_by_duration", maxMinutes: 20 },
    priority: 85,
  },

  // Engagement Rules
  {
    id: "rule-high-engagement-upgrade",
    name: "High Engagement (>80% completion) → Upgrade Difficulty",
    conditions: [{ field: "completionRate", operator: "greaterThan", value: 80 }],
    action: { type: "upgrade_difficulty" },
    priority: 75,
  },
  {
    id: "rule-low-engagement",
    name: "Low Engagement → Show Motivation",
    conditions: [{ field: "engagementScore", operator: "lessThan", value: 30 }],
    action: { type: "show_motivation" },
    priority: 70,
  },

  // Strength Goals
  {
    id: "rule-strength-intermediate",
    name: "Strength Goal + Intermediate → 30-Day Strength",
    conditions: [
      { field: "goals", operator: "contains", value: "strength" },
      { field: "fitnessLevel", operator: "in", value: ["intermediate", "advanced"] },
    ],
    action: { type: "recommend_program", programId: "p2" }, // 30-Day Strength Builder
    priority: 95,
  },

  // Weight Loss Goals
  {
    id: "rule-weightloss-intermediate",
    name: "Weight Loss + Not Beginner → Fat Burner",
    conditions: [
      { field: "goals", operator: "contains", value: "weight-loss" },
      { field: "fitnessLevel", operator: "in", value: ["intermediate", "advanced"] },
    ],
    action: { type: "recommend_program", programId: "p1" }, // 7-Day Fat Burner
    priority: 95,
  },
];

export function evaluateRule(
  rule: PersonalizationRule,
  profile: Record<string, unknown>
): boolean {
  return rule.conditions.every((condition) => {
    const value = profile[condition.field];

    switch (condition.operator) {
      case "equals":
        if (Array.isArray(value) && Array.isArray(condition.value)) {
          return JSON.stringify(value) === JSON.stringify(condition.value);
        }
        return value === condition.value;

      case "contains":
        if (Array.isArray(value)) {
          return value.includes(condition.value);
        }
        return false;

      case "greaterThan":
        return typeof value === "number" && value > (condition.value as number);

      case "lessThan":
        return typeof value === "number" && value < (condition.value as number);

      case "in":
        if (Array.isArray(condition.value)) {
          return condition.value.includes(value as string);
        }
        return false;

      default:
        return false;
    }
  });
}

export function getMatchingRules(
  profile: Record<string, unknown>
): PersonalizationRule[] {
  return personalizationRules
    .filter((rule) => evaluateRule(rule, profile))
    .sort((a, b) => b.priority - a.priority);
}

