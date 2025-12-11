"use client";

import { motion } from "framer-motion";
import {
  Flame,
  Timer,
  Trophy,
  TrendingUp,
  Award,
  Target,
  Calendar,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/shared/StatsCard";
import { useProgressStore } from "@/store";
import { defaultGoals } from "@/cms/data";
import { calculateProgress } from "@/lib/utils";

export default function ProgressPage() {
  const { progress } = useProgressStore();

  const achievementIcons: Record<string, React.ReactNode> = {
    trophy: <Trophy className="h-5 w-5" />,
    flame: <Flame className="h-5 w-5" />,
    sunrise: <Zap className="h-5 w-5" />,
    zap: <Zap className="h-5 w-5" />,
    award: <Award className="h-5 w-5" />,
    crown: <Trophy className="h-5 w-5" />,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">Track your fitness journey</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <StatsCard
          icon={Flame}
          label="Total Calories"
          value={progress.totalCaloriesBurned.toLocaleString()}
          subValue="kcal"
          gradient="energy"
          index={0}
        />
        <StatsCard
          icon={Timer}
          label="Active Minutes"
          value={progress.totalMinutes}
          subValue="min"
          gradient="wellness"
          index={1}
        />
        <StatsCard
          icon={Trophy}
          label="Workouts Done"
          value={progress.workoutsCompleted}
          gradient="strength"
          index={2}
        />
        <StatsCard
          icon={TrendingUp}
          label="Current Streak"
          value={progress.currentStreak}
          subValue="days"
          gradient="calm"
          index={3}
        />
      </motion.div>

      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-6 w-6 text-orange-500" />
                  <span className="text-lg font-bold text-orange-700 dark:text-orange-400">
                    {progress.currentStreak} Day Streak
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your longest streak: {progress.longestStreak} days
                </p>
              </div>
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Flame className="h-10 w-10 text-white" />
              </div>
            </div>
            {/* Weekly streak indicator */}
            <div className="mt-6 flex gap-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={i} className="flex-1 text-center">
                  <div
                    className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium ${
                      i < 5
                        ? "bg-orange-500 text-white"
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

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress.weeklyProgress.slice(-4).map((week, index) => (
                <div key={week.weekStart}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Week of {new Date(week.weekStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {week.workoutsCompleted} workouts
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-6 rounded ${
                          i < week.workoutsCompleted
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {defaultGoals.map((goal) => {
              const progressValue = calculateProgress(
                goal.currentValue || 0,
                goal.targetValue || 100
              );
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{goal.goalName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                    <Badge variant={progressValue >= 100 ? "success" : "outline"}>
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </Badge>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {progress.achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    achievement.isUnlocked
                      ? "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-2 border-amber-300 dark:border-amber-700"
                      : "bg-muted opacity-50"
                  }`}
                >
                  <div
                    className={`h-12 w-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      achievement.isUnlocked
                        ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    }`}
                  >
                    {achievementIcons[achievement.iconName] || <Award className="h-5 w-5" />}
                  </div>
                  <h4 className="font-medium text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                  {achievement.isUnlocked && achievement.unlockedAt && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

