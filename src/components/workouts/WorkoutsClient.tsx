"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkoutCard } from "@/components/shared/WorkoutCard";
import { workoutPrograms } from "@/cms/data";
import { Difficulty, MuscleGroup, Workout } from "@/cms/types";
import { cn } from "@/lib/utils";

const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];
const muscleGroups: MuscleGroup[] = ["full-body", "chest", "back", "legs", "core", "arms", "cardio"];

interface WorkoutsClientProps {
  initialWorkouts: Workout[];
}

export function WorkoutsClient({ initialWorkouts }: WorkoutsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);

  const filteredWorkouts = initialWorkouts.filter((workout) => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || workout.difficulty === selectedDifficulty;
    const matchesMuscle = !selectedMuscle || workout.muscleGroups.includes(selectedMuscle);
    return matchesSearch && matchesDifficulty && matchesMuscle;
  });

  const clearFilters = () => {
    setSelectedDifficulty(null);
    setSelectedMuscle(null);
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
        <h1 className="text-3xl font-bold mb-2">Workouts</h1>
        <p className="text-muted-foreground">Find the perfect workout for your goals</p>
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
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {difficulties.map((difficulty) => (
            <Badge
              key={difficulty}
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              className={cn(
                "cursor-pointer capitalize transition-all",
                selectedDifficulty === difficulty && "bg-primary text-white"
              )}
              onClick={() => setSelectedDifficulty(
                selectedDifficulty === difficulty ? null : difficulty
              )}
            >
              {difficulty}
            </Badge>
          ))}
          <span className="w-px h-6 bg-border mx-1" />
          {muscleGroups.map((muscle) => (
            <Badge
              key={muscle}
              variant={selectedMuscle === muscle ? "default" : "outline"}
              className={cn(
                "cursor-pointer capitalize transition-all",
                selectedMuscle === muscle && "bg-primary text-white"
              )}
              onClick={() => setSelectedMuscle(
                selectedMuscle === muscle ? null : muscle
              )}
            >
              {muscle.replace("-", " ")}
            </Badge>
          ))}
        </div>

        {(selectedDifficulty || selectedMuscle || searchQuery) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredWorkouts.length} workouts found
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
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout, index) => (
              <WorkoutCard key={workout.id} workout={workout} index={index} />
            ))}
          </div>
          {filteredWorkouts.length === 0 && initialWorkouts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No workouts found matching your criteria.</p>
              <Button variant="ghost" onClick={clearFilters} className="mt-2">
                Clear filters
              </Button>
            </motion.div>
          )}
          {filteredWorkouts.length === 0 && initialWorkouts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No workouts available.</p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="programs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workoutPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-500/10 border p-6 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex flex-col h-full">
                  <Badge className="w-fit mb-3">{program.duration.replace("-", " ")}</Badge>
                  <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{program.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">{program.difficulty}</Badge>
                    <Badge variant="outline" className="capitalize">{program.goal.replace("-", " ")}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No favorite workouts yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start exploring and save workouts you love!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

