"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, ChefHat, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MealPlan } from "@/cms/types";

interface MealCardProps {
  meal: MealPlan;
  index?: number;
  compact?: boolean;
}

export function MealCard({ meal, index = 0, compact = false }: MealCardProps) {
  const dietColors: Record<string, string> = {
    "high-protein": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    mediterranean: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    keto: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    vegan: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    vegetarian: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    paleo: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    balanced: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
    "low-carb": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };

  if (compact) {
    return (
      <Link href={`/meals/${meal.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={meal.thumbnailUrl}
                  alt={meal.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{meal.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5" />
                    {meal.totalCalories} kcal
                  </span>
                  <span className="flex items-center gap-1">
                    <ChefHat className="h-3.5 w-3.5" />
                    {meal.meals.length} meals
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
    <Link href={`/meals/${meal.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={meal.thumbnailUrl}
              alt={meal.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge className={dietColors[meal.dietType] || dietColors.balanced}>
                {meal.dietType.replace("-", " ")}
              </Badge>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-bold text-white text-lg">{meal.title}</h3>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {meal.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Flame className="h-4 w-4 text-orange-500" />
                  {meal.totalCalories} kcal
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <ChefHat className="h-4 w-4" />
                  {meal.meals.length} meals
                </span>
              </div>
            </div>
            {/* Macros Bar */}
            <div className="mt-3 flex gap-2 text-xs">
              <div className="flex-1 bg-rose-100 dark:bg-rose-900/30 rounded-full px-2 py-1 text-center">
                <span className="font-medium text-rose-700 dark:text-rose-400">
                  P: {meal.macros.protein}g
                </span>
              </div>
              <div className="flex-1 bg-amber-100 dark:bg-amber-900/30 rounded-full px-2 py-1 text-center">
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  C: {meal.macros.carbs}g
                </span>
              </div>
              <div className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-full px-2 py-1 text-center">
                <span className="font-medium text-blue-700 dark:text-blue-400">
                  F: {meal.macros.fat}g
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

