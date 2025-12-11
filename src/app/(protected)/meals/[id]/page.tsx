"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Flame,
  Clock,
  ChefHat,
  Heart,
  Share2,
  UtensilsCrossed,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getMealPlan } from "@/cms/client";
import { useState, useEffect } from "react";
import { MealPlan } from "@/cms/types";

export default function MealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMealPlan() {
      if (!params.id || typeof params.id !== "string") {
        setError("Invalid meal plan ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMealPlan(params.id);
        if (data) {
          setMealPlan(data);
        } else {
          setError("Meal plan not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load meal plan");
        console.error("Error fetching meal plan:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlan();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading meal plan...</p>
        </div>
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {error || "Meal plan not found"}
        </h1>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const mealTypeColors = {
    breakfast: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    lunch: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    dinner: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    snack: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
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
          src={mealPlan.thumbnailUrl}
          alt={mealPlan.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <Badge className="w-fit mb-3 bg-white/20 backdrop-blur-sm border-0 text-white capitalize">
            {mealPlan.dietType.replace("-", " ")}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {mealPlan.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80">
            <span className="flex items-center gap-1.5">
              <Flame className="h-4 w-4" />
              {mealPlan.totalCalories} kcal/day
            </span>
            <span className="flex items-center gap-1.5">
              <UtensilsCrossed className="h-4 w-4" />
              {mealPlan.meals.length} meals
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* Macros Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Daily Macros</h2>
        <div className="grid grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <p className="text-2xl font-bold text-rose-500">{mealPlan.macros.protein}g</p>
            <p className="text-sm text-muted-foreground">Protein</p>
          </Card>
          <Card className="text-center p-4">
            <p className="text-2xl font-bold text-amber-500">{mealPlan.macros.carbs}g</p>
            <p className="text-sm text-muted-foreground">Carbs</p>
          </Card>
          <Card className="text-center p-4">
            <p className="text-2xl font-bold text-blue-500">{mealPlan.macros.fat}g</p>
            <p className="text-sm text-muted-foreground">Fat</p>
          </Card>
          <Card className="text-center p-4">
            <p className="text-2xl font-bold text-emerald-500">{mealPlan.macros.fiber || 0}g</p>
            <p className="text-sm text-muted-foreground">Fiber</p>
          </Card>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-2">About This Plan</h2>
        <p className="text-muted-foreground">{mealPlan.description}</p>
      </motion.div>

      {/* Allergy Tags */}
      {mealPlan.allergyTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-3">Dietary Info</h2>
          <div className="flex flex-wrap gap-2">
            {mealPlan.allergyTags.map((tag) => (
              <Badge key={tag} variant="success" className="capitalize">
                {tag.replace("-", " ")}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Meals</h2>
        <Tabs defaultValue={mealPlan.meals[0]?.type || "breakfast"}>
          <TabsList className="mb-4">
            {["breakfast", "lunch", "dinner", "snack"].map((type) => {
              const hasMeal = mealPlan.meals.some((m) => m.type === type);
              if (!hasMeal) return null;
              return (
                <TabsTrigger key={type} value={type} className="capitalize">
                  {type}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {["breakfast", "lunch", "dinner", "snack"].map((type) => {
            const typeMeals = mealPlan.meals.filter((m) => m.type === type);
            if (typeMeals.length === 0) return null;

            return (
              <TabsContent key={type} value={type}>
                <div className="space-y-4">
                  {typeMeals.map((meal) => (
                    <Card key={meal.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-48 sm:h-auto sm:w-1/3">
                          <Image
                            src={meal.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'}
                            alt={meal.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-6">
                          <Badge className={mealTypeColors[meal.type as keyof typeof mealTypeColors]} >
                            {meal.type}
                          </Badge>
                          <h3 className="text-xl font-bold mt-2 mb-2">{meal.name}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <Flame className="h-4 w-4" />
                              {meal.calories} kcal
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {meal.prepTime + meal.cookTime} min
                            </span>
                          </div>
                          
                          {/* Mini macros */}
                          <div className="flex gap-3 text-xs mb-4">
                            <span className="text-rose-600">P: {meal.macros.protein}g</span>
                            <span className="text-amber-600">C: {meal.macros.carbs}g</span>
                            <span className="text-blue-600">F: {meal.macros.fat}g</span>
                          </div>

                          {/* Ingredients */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">Ingredients</h4>
                            <div className="flex flex-wrap gap-1">
                              {meal.ingredients.map((ingredient, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-24 md:bottom-8 bg-background/80 backdrop-blur-lg py-4 -mx-4 px-4 sm:-mx-6 sm:px-6"
      >
        <Button size="xl" className="w-full" variant="gradient">
          <ChefHat className="h-5 w-5 mr-2" />
          Start This Meal Plan
        </Button>
      </motion.div>
    </div>
  );
}

