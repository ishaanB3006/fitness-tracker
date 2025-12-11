"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  UtensilsCrossed,
  Moon,
  Check,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePlannerStore, useUserStore } from "@/store";
import { generateWeeklyPlan } from "@/personalization/engine";
import { workouts } from "@/cms/data";
import { format, addDays, startOfWeek } from "date-fns";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PlannerPage() {
  const { currentPlan, setPlan, markDayCompleted, toggleRestDay } = usePlannerStore();
  const { profile } = useUserStore();
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay());
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7));

  useEffect(() => {
    // Generate initial plan if none exists
    if (!currentPlan) {
      const defaultProfile = {
        tags: [],
        fitnessLevel: "beginner" as const,
        goals: ["general-fitness" as const],
        allergies: [],
        availableEquipment: ["none" as const],
        maxWorkoutDuration: 30,
        weeklyWorkoutTarget: 4,
        engagementScore: 50,
        completionRate: 60,
      };
      const plan = generateWeeklyPlan(
        profile ? { ...defaultProfile, fitnessLevel: profile.fitnessLevel, goals: profile.goals } : defaultProfile,
        weekStart.toISOString()
      );
      setPlan(plan);
    }
  }, [currentPlan, profile, setPlan, weekStart]);

  const regeneratePlan = () => {
    const defaultProfile = {
      tags: [],
      fitnessLevel: "beginner" as const,
      goals: ["general-fitness" as const],
      allergies: [],
      availableEquipment: ["none" as const],
      maxWorkoutDuration: 30,
      weeklyWorkoutTarget: 4,
      engagementScore: 50,
      completionRate: 60,
    };
    const plan = generateWeeklyPlan(
      profile ? { ...defaultProfile, fitnessLevel: profile.fitnessLevel, goals: profile.goals } : defaultProfile,
      weekStart.toISOString()
    );
    setPlan(plan);
  };

  const selectedDay = currentPlan?.days[selectedDayIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Weekly Planner</h1>
            <p className="text-muted-foreground">
              Your personalized fitness schedule
            </p>
          </div>
          <Button variant="outline" onClick={regeneratePlan} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        </div>
      </motion.div>

      {/* Week Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-semibold">
              {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Day Selector */}
        <div className="grid grid-cols-7 gap-2">
          {currentPlan?.days.map((day, index) => {
            const date = addDays(weekStart, index);
            const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            const isSelected = selectedDayIndex === index;

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDayIndex(index)}
                className={`relative p-3 rounded-xl text-center transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : day.isCompleted
                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : day.isRestDay
                    ? "bg-muted"
                    : "bg-card border hover:border-primary/50"
                }`}
              >
                <p className="text-xs font-medium mb-1">{dayNames[index]}</p>
                <p className={`text-lg font-bold ${isSelected ? "" : isToday ? "text-primary" : ""}`}>
                  {format(date, "d")}
                </p>
                {day.isCompleted && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
                {day.isRestDay && !isSelected && (
                  <Moon className="h-3 w-3 mx-auto mt-1 text-muted-foreground" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Day Details */}
      {selectedDay && (
        <motion.div
          key={selectedDayIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {format(addDays(weekStart, selectedDayIndex), "EEEE, MMMM d")}
            </h2>
            <div className="flex items-center gap-2">
              {selectedDay.isRestDay ? (
                <Badge variant="secondary">
                  <Moon className="h-3 w-3 mr-1" />
                  Rest Day
                </Badge>
              ) : selectedDay.isCompleted ? (
                <Badge variant="success">
                  <Check className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              ) : null}
            </div>
          </div>

          {/* Workout Card */}
          <Card className={selectedDay.isRestDay ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Workout</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedDay.isRestDay ? "Rest day - take it easy!" : "Today's training"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedDay.isRestDay ? (
                <div className="text-center py-8">
                  <Moon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Recovery is essential for progress. Enjoy your rest!
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4"
                    onClick={() => toggleRestDay(selectedDayIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add workout instead
                  </Button>
                </div>
              ) : selectedDay.workout ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedDay.workout.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedDay.workout.duration} min • {selectedDay.workout.calories} kcal
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {selectedDay.workout.difficulty}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" disabled={selectedDay.isCompleted}>
                      {selectedDay.isCompleted ? "Completed" : "Start Workout"}
                    </Button>
                    {!selectedDay.isCompleted && (
                      <Button
                        variant="outline"
                        onClick={() => markDayCompleted(selectedDayIndex)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No workout scheduled</p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add workout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meal Plan Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <UtensilsCrossed className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Nutrition</CardTitle>
                  <p className="text-sm text-muted-foreground">Today&apos;s meal plan</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedDay.mealPlan ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{selectedDay.mealPlan.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDay.mealPlan.totalCalories} kcal • {selectedDay.mealPlan.meals.length} meals
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <div className="flex-1 bg-rose-100 dark:bg-rose-900/30 rounded-lg p-2 text-center">
                      <p className="font-bold text-rose-700 dark:text-rose-400">
                        {selectedDay.mealPlan.macros.protein}g
                      </p>
                      <p className="text-muted-foreground">Protein</p>
                    </div>
                    <div className="flex-1 bg-amber-100 dark:bg-amber-900/30 rounded-lg p-2 text-center">
                      <p className="font-bold text-amber-700 dark:text-amber-400">
                        {selectedDay.mealPlan.macros.carbs}g
                      </p>
                      <p className="text-muted-foreground">Carbs</p>
                    </div>
                    <div className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 text-center">
                      <p className="font-bold text-blue-700 dark:text-blue-400">
                        {selectedDay.mealPlan.macros.fat}g
                      </p>
                      <p className="text-muted-foreground">Fat</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Full Meal Plan
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No meal plan assigned</p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add meal plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {selectedDay.notes && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{selectedDay.notes}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}

