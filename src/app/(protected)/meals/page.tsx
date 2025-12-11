"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MealCard } from "@/components/shared/MealCard";
import { DietType, MealPlan } from "@/cms/types";
import { cn } from "@/lib/utils";
import { getAllMealPlans } from "@/lib/contentstack";

const dietTypes: DietType[] = [
  "balanced",
  "high-protein",
  "keto",
  "mediterranean",
  "vegan",
  "vegetarian",
  "paleo",
  "low-carb",
];

export default function MealsPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiet, setSelectedDiet] = useState<DietType | null>(null);

  useEffect(() => {
    async function fetchMealPlans() {
      try {
        setLoading(true);
        setError(null);
        const fetchedMealPlans = await getAllMealPlans();
        setMealPlans(fetchedMealPlans);
      } catch (err) {
        console.error("Failed to fetch meal plans:", err);
        setError(err instanceof Error ? err.message : "Failed to load meal plans");
        setMealPlans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlans();
  }, []);

  const filteredMeals = mealPlans.filter((meal) => {
    const matchesSearch =
      meal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = !selectedDiet || meal.dietType === selectedDiet;
    return matchesSearch && matchesDiet;
  });

  const clearFilters = () => {
    setSelectedDiet(null);
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Meal Plans</h1>
        <p className="text-muted-foreground">
          Nutritious meal plans tailored to your goals
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meal plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Diet Type Pills */}
        <div className="flex flex-wrap gap-2">
          {dietTypes.map((diet) => (
            <Badge
              key={diet}
              variant={selectedDiet === diet ? "default" : "outline"}
              className={cn(
                "cursor-pointer capitalize transition-all",
                selectedDiet === diet && "bg-primary text-white"
              )}
              onClick={() =>
                setSelectedDiet(selectedDiet === diet ? null : diet)
              }
            >
              {diet.replace("-", " ")}
            </Badge>
          ))}
        </div>

        {(selectedDiet || searchQuery) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredMeals.length} meal plans found
            </span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading meal plans...</span>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-destructive mb-2">Error loading meal plans</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map((meal, index) => (
                  <MealCard key={meal.id} meal={meal} index={index} />
                ))}
              </div>
              {filteredMeals.length === 0 && mealPlans.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">
                    No meal plans found matching your criteria.
                  </p>
                  <Button variant="ghost" onClick={clearFilters} className="mt-2">
                    Clear filters
                  </Button>
                </motion.div>
              )}
              {filteredMeals.length === 0 && mealPlans.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">No meal plans available.</p>
                </motion.div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="recommended">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlans.slice(0, 2).map((meal, index) => (
                <MealCard key={meal.id} meal={meal} index={index} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No saved meal plans yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start exploring and save meal plans you love!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

