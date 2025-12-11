"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, X, Sparkles, Ruler, Scale, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/store";
import { GoalType } from "@/cms/types";
import { trackEvent } from "@/lib/analytics";

type OnboardingGoal = "lose-weight" | "build-muscle" | "injury-rehab" | "diet-changes";

const goalMapping: Record<OnboardingGoal, GoalType> = {
  "lose-weight": "weight-loss",
  "build-muscle": "muscle-gain",
  "injury-rehab": "flexibility",
  "diet-changes": "general-fitness",
};

const goalLabels: Record<OnboardingGoal, string> = {
  "lose-weight": "Lose Weight",
  "build-muscle": "Build Muscle",
  "injury-rehab": "Injury Rehab",
  "diet-changes": "Diet Changes",
};

const goalDescriptions: Record<OnboardingGoal, string> = {
  "lose-weight": "Burn calories and shed pounds with targeted workouts",
  "build-muscle": "Gain strength and build lean muscle mass",
  "injury-rehab": "Recover safely with rehabilitation-focused exercises",
  "diet-changes": "Transform your nutrition with personalized meal plans",
};

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// BMI calculation and categorization
const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (heightCm === 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

const getBMICategory = (bmi: number): { label: string; color: string } => {
  if (bmi < 18.5) return { label: "Underweight", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
  if (bmi < 25) return { label: "Normal", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
  if (bmi < 30) return { label: "Overweight", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
  return { label: "Obese", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" };
};

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGoal, setSelectedGoal] = useState<OnboardingGoal | "">("");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const { setGoals, completeOnboarding, updateProfile } = useUserStore();

  // Calculate BMI
  const bmi = useMemo(() => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    if (weightNum > 0 && heightNum > 0) {
      return calculateBMI(weightNum, heightNum);
    }
    return 0;
  }, [weight, height]);

  const bmiCategory = useMemo(() => {
    if (bmi > 0) {
      return getBMICategory(bmi);
    }
    return null;
  }, [bmi]);

  const handleNext = () => {
    if (!selectedGoal) return;
    setStep(2);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedGoal("");
    setAge("");
    setWeight("");
    setHeight("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedGoal) return;

    const goalType = goalMapping[selectedGoal as OnboardingGoal];
    const ageNum = parseInt(age) || undefined;
    const weightNum = parseFloat(weight) || undefined;
    const heightNum = parseFloat(height) || undefined;

    setGoals([goalType]);
    completeOnboarding();
    
    // Update profile with all collected data
    updateProfile({
      fitnessLevel: "beginner",
      workoutsPerWeek: 3,
      preferredWorkoutDuration: 30,
      age: ageNum,
      weight: weightNum,
      height: heightNum,
    });

    // Send onboarding data to Lytics
    trackEvent("onboarding_flow", {
      goal: selectedGoal,
      goal_label: goalLabels[selectedGoal as OnboardingGoal],
      goal_type: goalType,
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      bmi: bmi > 0 ? parseFloat(bmi.toFixed(2)) : undefined,
      bmi_category: bmiCategory?.label,
      fitness_level: "beginner",
      workouts_per_week: 3,
      preferred_workout_duration: 30,
      onboarding_completed_at: new Date().toISOString(),
    });

    resetForm();
    onClose();
  };

  const canProceed = step === 1 ? selectedGoal : (age && weight && height);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className={`w-full ${step === 1 ? "max-w-md" : "max-w-lg"} relative overflow-hidden`}>
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-emerald-500/10 to-purple-500/10" />
              
              <CardContent className="p-6 relative z-10">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto mb-4">
                    {step === 1 ? (
                      <Target className="h-8 w-8 text-white" />
                    ) : (
                      <Scale className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {step === 1 ? "Welcome to FitFlow!" : "Tell Us About Yourself"}
                  </h2>
                  <p className="text-muted-foreground">
                    {step === 1
                      ? "Let's personalize your fitness journey. What's your main goal?"
                      : "Help us calculate your BMI and create a personalized plan"}
                  </p>
                  {/* Step indicator */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className={`h-2 w-8 rounded-full ${step === 1 ? "bg-primary" : "bg-muted"}`} />
                    <div className={`h-2 w-8 rounded-full ${step === 2 ? "bg-primary" : "bg-muted"}`} />
                  </div>
                </div>

                {/* Step 1: Goal Selection */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4 mb-6"
                  >
                    <label className="text-sm font-medium">Select Your Goal</label>
                    <Select
                      value={selectedGoal}
                      onValueChange={(value) => setSelectedGoal(value as OnboardingGoal)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your fitness goal..." />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(goalLabels) as OnboardingGoal[]).map((goal) => (
                          <SelectItem key={goal} value={goal}>
                            {goalLabels[goal]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Selected Goal Preview */}
                    {selectedGoal && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-primary/5 border border-primary/20"
                      >
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm mb-1">
                              {goalLabels[selectedGoal as OnboardingGoal]}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {goalDescriptions[selectedGoal as OnboardingGoal]}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Body Attributes */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 mb-6"
                  >
                    {/* Age */}
                    <div className="space-y-2">
                      <Label htmlFor="age" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        min="1"
                        max="120"
                      />
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="flex items-center gap-2">
                        <Scale className="h-4 w-4" />
                        Weight (kg)
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="Enter your weight in kg"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        min="1"
                        step="0.1"
                      />
                    </div>

                    {/* Height */}
                    <div className="space-y-2">
                      <Label htmlFor="height" className="flex items-center gap-2">
                        <Ruler className="h-4 w-4" />
                        Height (cm)
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="Enter your height in cm"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        min="1"
                        step="0.1"
                      />
                    </div>

                    {/* BMI Display */}
                    {bmi > 0 && bmiCategory && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-emerald-500/5 border border-primary/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">Your BMI</span>
                          </div>
                          <Badge className={bmiCategory.color}>
                            {bmiCategory.label}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold">{bmi.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Body Mass Index
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {step === 1 ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                      >
                        Skip for now
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!selectedGoal}
                        className="flex-1"
                      >
                        Next
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!canProceed}
                        className="flex-1"
                      >
                        Complete Setup
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

