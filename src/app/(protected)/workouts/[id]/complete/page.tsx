"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import {
  Trophy,
  Flame,
  Clock,
  Zap,
  Share2,
  Home,
  ArrowRight,
  Sparkles,
  Star,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { workouts, productPlacements, demoUserProgress } from "@/cms/data";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getWorkout } from "@/cms/client";
import { Workout } from "@/cms/types";

export default function PostWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get a relevant product placement for post-workout
  const placement = productPlacements.find(
    (p) => p.placementLocation === "post-workout" && p.isActive
  );

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch workout data and track completion
  useEffect(() => {
    async function fetchWorkoutAndTrack() {
      if (!params.id || typeof params.id !== "string") return;

      try {
        // Try to fetch from Contentstack first, fallback to local data
        const fetchedWorkout = await getWorkout(params.id);
        const workoutData = fetchedWorkout || workouts.find((w) => w.id === params.id);
        
        if (workoutData) {
          setWorkout(workoutData);
          
          // Track workout completion event
          trackEvent("workout_completed", {
            workout_id: workoutData.id,
            workout_title: workoutData.title,
            workout_duration: workoutData.duration, // in minutes
            calories_burned: workoutData.calories,
            exercises_count: workoutData.exercises.length,
            difficulty: workoutData.difficulty,
            muscle_groups: workoutData.muscleGroups,
            equipment: workoutData.equipment,
            completed_at: new Date().toISOString(),
            current_streak: demoUserProgress.currentStreak + 1,
            is_streak_milestone: (demoUserProgress.currentStreak + 1) % 7 === 0,
          });
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        // Fallback to local data
        const localWorkout = workouts.find((w) => w.id === params.id);
        if (localWorkout) {
          setWorkout(localWorkout);
          
          // Track workout completion event with local data
          trackEvent("workout_completed", {
            workout_id: localWorkout.id,
            workout_title: localWorkout.title,
            workout_duration: localWorkout.duration,
            calories_burned: localWorkout.calories,
            exercises_count: localWorkout.exercises.length,
            difficulty: localWorkout.difficulty,
            muscle_groups: localWorkout.muscleGroups,
            equipment: localWorkout.equipment,
            completed_at: new Date().toISOString(),
            current_streak: demoUserProgress.currentStreak + 1,
            is_streak_milestone: (demoUserProgress.currentStreak + 1) % 7 === 0,
          });
        }
      }
    }

    fetchWorkoutAndTrack();
  }, [params.id]);

  if (!workout) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Workout not found</h1>
        <Button onClick={() => router.push("/workouts")}>
          Back to Workouts
        </Button>
      </div>
    );
  }

  const newStreak = demoUserProgress.currentStreak + 1;
  const isStreakMilestone = newStreak % 7 === 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={["#10B981", "#34D399", "#6EE7B7", "#F59E0B", "#FBBF24"]}
        />
      )}

      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/20 via-background to-background" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block"
          >
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-2xl shadow-primary/30">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-2"
          >
            Workout Complete! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg"
          >
            You crushed {workout.title}!
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <Card className="text-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50">
            <CardContent className="p-4">
              <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{workout.calories}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50">
            <CardContent className="p-4">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{workout.duration}</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200/50">
            <CardContent className="p-4">
              <Zap className="h-8 w-8 mx-auto mb-2 text-violet-500" />
              <p className="text-2xl font-bold">{workout.exercises.length}</p>
              <p className="text-xs text-muted-foreground">Exercises</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak Update */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className={`overflow-hidden ${isStreakMilestone ? "ring-2 ring-orange-500" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{newStreak} Day Streak!</p>
                    <p className="text-sm text-muted-foreground">
                      {isStreakMilestone
                        ? "🎉 Milestone reached!"
                        : "Keep the momentum going!"}
                    </p>
                  </div>
                </div>
                {isStreakMilestone && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                    <Star className="h-3 w-3 mr-1" />
                    Milestone
                  </Badge>
                )}
              </div>

              {/* Weekly Progress */}
              <div className="flex gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div
                      className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        i < (newStreak % 7 || 7)
                          ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {day}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievement Unlocked */}
        {isStreakMilestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-300">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: 3, duration: 0.3 }}
                >
                  <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
                <h3 className="font-bold text-lg text-amber-800 dark:text-amber-300">
                  Achievement Unlocked!
                </h3>
                <p className="text-amber-700 dark:text-amber-400">
                  {newStreak}-Day Streak Champion 🏆
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sponsored Product Placement */}
        {placement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Sponsored
            </p>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex">
                <div className="relative w-1/3 min-h-[120px]">
                  <Image
                    src={placement.imageUrl}
                    alt={placement.productName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="flex-1 p-4 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-2 text-xs">
                    {placement.productType}
                  </Badge>
                  <h3 className="font-semibold mb-1">{placement.productName}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Refuel your body with premium nutrition
                  </p>
                  <a
                    href={placement.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                  >
                    Shop Now <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Recommended Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <h3 className="font-semibold mb-3">Up Next</h3>
          <Link href={`/workouts/${workouts[1]?.id || "w2"}`}>
            <Card className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={workouts[1]?.thumbnailUrl || workouts[0].thumbnailUrl}
                    alt={workouts[1]?.title || "Next workout"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{workouts[1]?.title || "Upper Body Strength"}</p>
                  <p className="text-sm text-muted-foreground">
                    {workouts[1]?.duration || 45} min • {workouts[1]?.calories || 280} kcal
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col gap-3"
        >
          <Button size="xl" variant="gradient" className="w-full" asChild>
            <Link href="/planner">
              <ArrowRight className="h-5 w-5 mr-2" />
              Continue to Planner
            </Link>
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

