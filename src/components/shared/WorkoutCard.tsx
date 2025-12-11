"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Flame, Dumbbell, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workout } from "@/cms/types";
import { formatDuration } from "@/lib/utils";

interface WorkoutCardProps {
  workout: Workout;
  index?: number;
  compact?: boolean;
}

export function WorkoutCard({ workout, index = 0, compact = false }: WorkoutCardProps) {
  const difficultyColors = {
    beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    advanced: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  if (compact) {
    return (
      <Link href={`/workouts/${workout.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={workout.thumbnailUrl}
                  alt={workout.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{workout.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDuration(workout.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5" />
                    {workout.calories} kcal
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Card>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/workouts/${workout.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={workout.thumbnailUrl}
              alt={workout.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge className={difficultyColors[workout.difficulty]}>
                {workout.difficulty}
              </Badge>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-bold text-white text-lg">{workout.title}</h3>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {workout.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatDuration(workout.duration)}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Flame className="h-4 w-4 text-orange-500" />
                  {workout.calories} kcal
                </span>
              </div>
              {workout.equipment.length > 0 && workout.equipment[0] !== "none" && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Dumbbell className="h-3.5 w-3.5" />
                  {workout.equipment.length}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

