"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Timer,
  Heart,
  Share2,
  CheckCircle2,
  Sparkles,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { recoveries } from "@/cms/data";
import { useState } from "react";

const typeColors: Record<string, string> = {
  "mental-wellness": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "sports-massage": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  stretching: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  meditation: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  breathing: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "foam-rolling": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  cryotherapy: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  sauna: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const typeLabels: Record<string, string> = {
  "mental-wellness": "Mental Wellness",
  "sports-massage": "Sports Massage",
  stretching: "Stretching",
  meditation: "Meditation",
  breathing: "Breathing",
  "foam-rolling": "Foam Rolling",
  cryotherapy: "Cryotherapy",
  sauna: "Sauna",
};

const difficultyColors = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  advanced: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function RecoveryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const recovery = recoveries.find((r) => r.id === params.id);

  if (!recovery) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Recovery activity not found</h1>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

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
          src={recovery.thumbnailUrl}
          alt={recovery.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={typeColors[recovery.type] || typeColors["mental-wellness"]}>
              {typeLabels[recovery.type] || recovery.type}
            </Badge>
            <Badge className={difficultyColors[recovery.difficulty]}>
              {recovery.difficulty}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{recovery.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80">
            <span className="flex items-center gap-1.5">
              <Timer className="h-4 w-4" />
              {recovery.duration} minutes
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              {recovery.benefits.length} benefits
            </span>
            {recovery.price && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                ${recovery.price} per session
              </span>
            )}
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
        <h2 className="text-lg font-semibold mb-2">About This Activity</h2>
        <p className="text-muted-foreground">{recovery.description}</p>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recovery.benefits.map((benefit, index) => (
            <Card key={index} className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">{benefit}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Instructions */}
      {recovery.instructions && recovery.instructions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-3">How to Practice</h2>
          <div className="space-y-3">
            {recovery.instructions.map((instruction, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm pt-1">{instruction}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Booking Info */}
      {recovery.requiresBooking && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-emerald-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Appointment Required</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This service requires a scheduled appointment. Book your session to ensure availability and professional supervision.
                  </p>
                  {recovery.price && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold">${recovery.price}</span>
                      <span className="text-muted-foreground">per session</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tags */}
      {recovery.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: recovery.requiresBooking ? 0.5 : 0.4 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {recovery.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize">
                {tag.replace("-", " ")}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: recovery.requiresBooking ? 0.6 : 0.5 }}
        className="sticky bottom-24 md:bottom-8 bg-background/80 backdrop-blur-lg py-4 -mx-4 px-4 sm:-mx-6 sm:px-6"
      >
        {recovery.requiresBooking ? (
          <Button
            size="xl"
            className="w-full"
            onClick={() => router.push(`/recovery/${recovery.id}/book`)}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book Appointment
          </Button>
        ) : (
          <Button
            size="xl"
            className="w-full"
            variant={isCompleted ? "outline" : "default"}
            onClick={() => {
              const newCompleted = !isCompleted;
              setIsCompleted(newCompleted);
            }}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Heart className="h-5 w-5 mr-2" />
                Start Recovery Session
              </>
            )}
          </Button>
        )}
      </motion.div>
    </div>
  );
}

