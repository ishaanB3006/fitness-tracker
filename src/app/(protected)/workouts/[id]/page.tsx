"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Clock,
  Flame,
  Dumbbell,
  Heart,
  Share2,
  ChevronDown,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getWorkout } from "@/cms/client";
import { formatDuration } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Workout } from "@/cms/types";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  useEffect(() => {
    async function fetchWorkout() {
      if (!params.id || typeof params.id !== "string") {
        setError("Invalid workout ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getWorkout(params.id);
        if (data) {
          setWorkout(data);
        } else {
          setError("Workout not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load workout");
        console.error("Error fetching workout:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {error || "Workout not found"}
        </h1>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const progress = (completedExercises.length / workout.exercises.length) * 100;

  const difficultyColors = {
    beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    advanced: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 sm:h-80 rounded-3xl overflow-hidden mb-8"
      >
        <Image
          src={workout.thumbnailUrl}
          alt={workout.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={difficultyColors[workout.difficulty]}>
              {workout.difficulty}
            </Badge>
            {workout.muscleGroups.map((muscle) => (
              <Badge key={muscle} variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm capitalize">
                {muscle.replace("-", " ")}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{workout.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formatDuration(workout.duration)}
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="h-4 w-4" />
              {workout.calories} kcal
            </span>
            <span className="flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4" />
              {workout.exercises.length} exercises
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30">
            <Heart className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-2">About This Workout</h2>
        <p className="text-muted-foreground">{workout.description}</p>
      </motion.div>

      {/* Equipment */}
      {workout.equipment.length > 0 && workout.equipment[0] !== "none" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-3">Equipment Needed</h2>
          <div className="flex flex-wrap gap-2">
            {workout.equipment.map((item) => (
              <Badge key={item} variant="outline" className="capitalize">
                {item.replace("-", " ")}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      {completedExercises.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Workout Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedExercises.length} / {workout.exercises.length}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-primary to-emerald-400"
            />
          </div>
        </motion.div>
      )}

      {/* Exercises */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Exercises</h2>
        <div className="space-y-3">
          {workout.exercises.map((exercise, index) => {
            const isCompleted = completedExercises.includes(exercise.id);
            const isExpanded = expandedExercise === exercise.id;
            
            return (
              <Card
                key={exercise.id}
                className={`transition-all duration-300 ${isCompleted ? 'bg-primary/5 border-primary/30' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleExercise(exercise.id)}
                      className={`flex-shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-primary border-primary text-white'
                          : 'border-muted-foreground/30 hover:border-primary'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps}
                        {exercise.restSeconds > 0 && ` • ${exercise.restSeconds}s rest`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                    >
                      <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                  
                  {isExpanded && exercise.notes && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t"
                    >
                      <p className="text-sm text-muted-foreground">{exercise.notes}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky bottom-24 md:bottom-8 bg-background/80 backdrop-blur-lg py-4 -mx-4 px-4 sm:-mx-6 sm:px-6"
      >
        {progress === 100 ? (
          <Button 
            size="xl" 
            className="w-full" 
            variant="gradient"
            onClick={() => router.push(`/workouts/${workout.id}/complete`)}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Complete Workout
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button 
              size="xl" 
              className="flex-1" 
              variant="gradient"
            >
              <Play className="h-5 w-5 mr-2" />
              {completedExercises.length > 0 ? 'Continue' : 'Start Workout'}
            </Button>
            {completedExercises.length > 0 && (
              <Button 
                size="xl" 
                variant="outline"
                onClick={() => router.push(`/workouts/${workout.id}/complete`)}
              >
                Finish Early
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

