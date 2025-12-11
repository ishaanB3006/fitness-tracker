"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Target,
  Dumbbell,
  Clock,
  UtensilsCrossed,
  Settings,
  ChevronRight,
  Save,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore, useThemeStore } from "@/store";
import { Difficulty, GoalType, DietType, Equipment } from "@/cms/types";
import { cn } from "@/lib/utils";

const fitnessLevels: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const goals: { value: GoalType; label: string }[] = [
  { value: "weight-loss", label: "Weight Loss" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "strength", label: "Build Strength" },
  { value: "endurance", label: "Improve Endurance" },
  { value: "flexibility", label: "Increase Flexibility" },
  { value: "general-fitness", label: "General Fitness" },
];

const dietTypes: { value: DietType; label: string }[] = [
  { value: "balanced", label: "Balanced" },
  { value: "high-protein", label: "High Protein" },
  { value: "keto", label: "Keto" },
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "mediterranean", label: "Mediterranean" },
];

const equipmentOptions: { value: Equipment; label: string }[] = [
  { value: "none", label: "No Equipment" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "barbell", label: "Barbell" },
  { value: "resistance-bands", label: "Resistance Bands" },
  { value: "pull-up-bar", label: "Pull-up Bar" },
  { value: "kettlebell", label: "Kettlebell" },
];

export default function ProfilePage() {
  const { profile, updateProfile, setGoals, setEquipment } = useUserStore();
  const { theme, setTheme } = useThemeStore();
  
  const [name, setName] = useState(profile?.name || "");
  const [selectedGoals, setSelectedGoals] = useState<GoalType[]>(profile?.goals || []);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(
    profile?.availableEquipment || []
  );

  const toggleGoal = (goal: GoalType) => {
    const newGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter((g) => g !== goal)
      : [...selectedGoals, goal];
    setSelectedGoals(newGoals);
    setGoals(newGoals);
  };

  const toggleEquipment = (equipment: Equipment) => {
    const newEquipment = selectedEquipment.includes(equipment)
      ? selectedEquipment.filter((e) => e !== equipment)
      : [...selectedEquipment, equipment];
    setSelectedEquipment(newEquipment);
    setEquipment(newEquipment);
  };

  const handleSave = () => {
    updateProfile({ name });
    // Show success toast here
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Customize your fitness experience</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {name ? name[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fitness Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Dumbbell className="h-5 w-5" />
              Fitness Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={profile?.fitnessLevel || "beginner"}
              onValueChange={(value) =>
                updateProfile({ fitnessLevel: value as Difficulty })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your fitness level" />
              </SelectTrigger>
              <SelectContent>
                {fitnessLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5" />
              Fitness Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {goals.map((goal) => (
                <Badge
                  key={goal.value}
                  variant={selectedGoals.includes(goal.value) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all py-2 px-4",
                    selectedGoals.includes(goal.value) && "bg-primary text-white"
                  )}
                  onClick={() => toggleGoal(goal.value)}
                >
                  {goal.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Equipment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Dumbbell className="h-5 w-5" />
              Available Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((equipment) => (
                <Badge
                  key={equipment.value}
                  variant={
                    selectedEquipment.includes(equipment.value) ? "default" : "outline"
                  }
                  className={cn(
                    "cursor-pointer transition-all py-2 px-4",
                    selectedEquipment.includes(equipment.value) && "bg-primary text-white"
                  )}
                  onClick={() => toggleEquipment(equipment.value)}
                >
                  {equipment.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Workout Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5" />
              Workout Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Preferred Workout Duration</Label>
              <Select
                value={String(profile?.preferredWorkoutDuration || 30)}
                onValueChange={(value) =>
                  updateProfile({ preferredWorkoutDuration: parseInt(value) })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Workouts Per Week</Label>
              <Select
                value={String(profile?.workoutsPerWeek || 3)}
                onValueChange={(value) =>
                  updateProfile({ workoutsPerWeek: parseInt(value) })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 days</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="4">4 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="6">6 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Diet Preference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UtensilsCrossed className="h-5 w-5" />
              Diet Preference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={profile?.dietPreference || "balanced"}
              onValueChange={(value) =>
                updateProfile({ dietPreference: value as DietType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your diet preference" />
              </SelectTrigger>
              <SelectContent>
                {dietTypes.map((diet) => (
                  <SelectItem key={diet.value} value={diet.value}>
                    {diet.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      {/* App Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-5 w-5" />
              App Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark theme
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Workout reminders and updates
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="sticky bottom-24 md:bottom-8 bg-background/80 backdrop-blur-lg py-4 -mx-4 px-4 sm:-mx-6 sm:px-6"
      >
        <Button size="xl" className="w-full" onClick={handleSave}>
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}

