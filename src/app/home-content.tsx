"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Flame,
  Timer,
  ChevronRight,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkoutCard } from "@/components/shared/WorkoutCard";
import { MealCard } from "@/components/shared/MealCard";
import { RecoveryCard } from "@/components/shared/RecoveryCard";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { workouts, mealPlans, recoveries } from "@/cms/data";
import { getGreeting, getDayOfWeek } from "@/lib/utils";
import { useUserStore } from "@/store";

export default function HomePageContent() {
  const [greeting, setGreeting] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isOnboarded } = useUserStore();

  useEffect(() => {
    setGreeting(getGreeting());
    setDayOfWeek(getDayOfWeek());
    
    // Show onboarding if user hasn't completed it
    if (!isOnboarded) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOnboarded]);

  const todayWorkout = workouts[0];
  const recommendedMeals = mealPlans.slice(0, 2);
  const quickWorkouts = workouts.filter((w) => w.duration <= 20);
  const featuredRecoveries = recoveries.slice(0, 3);

  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
          <div>
            <p className="text-muted-foreground mb-1">{dayOfWeek}</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {greeting}, <span className="text-primary">Athlete</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
            Ready to crush your fitness goals today?
            </p>
        </div>
      </motion.section>

      {/* Today's Workout */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Today&apos;s Workout</h2>
          <Link href="/workouts" className="text-sm text-primary flex items-center gap-1 hover:underline">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-emerald-500/5 border-primary/20">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
              <Image
                src={todayWorkout.thumbnailUrl}
                alt={todayWorkout.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </div>
            <CardContent className="flex-1 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default" className="bg-primary/20 text-primary border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Personalized
                </Badge>
                <Badge variant="secondary">{todayWorkout.difficulty}</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">{todayWorkout.title}</h3>
              <p className="text-muted-foreground mb-4">{todayWorkout.description}</p>
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                <span className="flex items-center gap-1.5">
                  <Timer className="h-4 w-4 text-primary" />
                  {todayWorkout.duration} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-500" />
                  {todayWorkout.calories} kcal
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" />
                  {todayWorkout.exercises.length} exercises
                </span>
              </div>
              <Link href={`/workouts/${todayWorkout.id}`}>
                <Button size="lg" className="w-full md:w-auto">
                  <Play className="h-4 w-4 mr-2" />
                  Start Workout
                </Button>
              </Link>
            </CardContent>
          </div>
        </Card>
      </motion.section>

      {/* Quick Workouts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Quick Workouts</h2>
            <p className="text-sm text-muted-foreground">Under 20 minutes</p>
          </div>
          <Link href="/workouts?filter=quick" className="text-sm text-primary flex items-center gap-1 hover:underline">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickWorkouts.map((workout, index) => (
            <WorkoutCard key={workout.id} workout={workout} index={index} />
          ))}
        </div>
      </motion.section>

      {/* Recommended Meals */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Meal Plans For You</h2>
            <p className="text-sm text-muted-foreground">Personalized nutrition</p>
          </div>
          <Link href="/meals" className="text-sm text-primary flex items-center gap-1 hover:underline">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedMeals.map((meal, index) => (
            <MealCard key={meal.id} meal={meal} index={index} />
          ))}
        </div>
      </motion.section>

      {/* Recovery Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Recovery & Wellness</h2>
            <p className="text-sm text-muted-foreground">Mental well-being and sports recovery</p>
          </div>
          <Link href="/recovery" className="text-sm text-primary flex items-center gap-1 hover:underline">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredRecoveries.map((recovery, index) => (
            <RecoveryCard key={recovery.id} recovery={recovery} index={index} />
          ))}
        </div>
      </motion.section>
      </div>
    </>
  );
}
