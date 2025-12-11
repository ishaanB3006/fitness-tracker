"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Flame,
  Timer,
  Trophy,
  TrendingUp,
  ChevronRight,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { WorkoutCard } from "@/components/shared/WorkoutCard";
import { MealCard } from "@/components/shared/MealCard";
import { StatsCard } from "@/components/shared/StatsCard";
import { workouts, mealPlans, workoutPrograms, demoUserProgress } from "@/cms/data";
import { getGreeting, getDayOfWeek, calculateProgress } from "@/lib/utils";

export default function HomePage() {
  const [greeting, setGreeting] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    setDayOfWeek(getDayOfWeek());
  }, []);

  const todayWorkout = workouts[0];
  const featuredProgram = workoutPrograms.find((p) => p.featured);
  const recommendedMeals = mealPlans.slice(0, 2);
  const quickWorkouts = workouts.filter((w) => w.duration <= 20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-muted-foreground mb-1">{dayOfWeek}</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {greeting}, <span className="text-primary">Athlete</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              You&apos;re on a 5-day streak! Keep the momentum going today.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-orange-700 dark:text-orange-400">
                {demoUserProgress.currentStreak} Day Streak
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <section className="mb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={Flame}
            label="Calories Burned"
            value={demoUserProgress.totalCaloriesBurned.toLocaleString()}
            subValue="kcal"
            trend="up"
            trendValue="12%"
            gradient="energy"
            index={0}
          />
          <StatsCard
            icon={Timer}
            label="Minutes Active"
            value={demoUserProgress.totalMinutes}
            subValue="min"
            trend="up"
            trendValue="8%"
            gradient="wellness"
            index={1}
          />
          <StatsCard
            icon={Trophy}
            label="Workouts Done"
            value={demoUserProgress.workoutsCompleted}
            trend="up"
            trendValue="3"
            gradient="strength"
            index={2}
          />
          <StatsCard
            icon={TrendingUp}
            label="Best Streak"
            value={demoUserProgress.longestStreak}
            subValue="days"
            gradient="calm"
            index={3}
          />
        </div>
      </section>

      {/* Today's Workout */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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

      {/* Weekly Goal Progress */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <h2 className="text-xl font-bold mb-4">Weekly Goal Progress</h2>
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Workouts Completed</span>
                <span className="text-sm text-muted-foreground">3 / 5</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Minutes</span>
                <span className="text-sm text-muted-foreground">120 / 200 min</span>
              </div>
              <Progress value={60} className="h-2" indicatorClassName="from-amber-400 to-orange-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Calories Burned</span>
                <span className="text-sm text-muted-foreground">850 / 1500 kcal</span>
              </div>
              <Progress value={56} className="h-2" indicatorClassName="from-rose-400 to-red-500" />
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Quick Workouts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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

      {/* Featured Program */}
      {featuredProgram && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold mb-4">Featured Program</h2>
          <Link href={`/workouts/programs/${featuredProgram.id}`}>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="relative h-64">
                <Image
                  src={featuredProgram.thumbnailUrl}
                  alt={featuredProgram.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <Badge className="w-fit mb-2 bg-white/20 backdrop-blur-sm border-0 text-white">
                    {featuredProgram.duration.replace("-", " ")} program
                  </Badge>
                  <h3 className="text-2xl font-bold text-white mb-1">{featuredProgram.title}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{featuredProgram.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        </motion.section>
      )}

      {/* Recommended Meals */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
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
    </div>
  );
}

