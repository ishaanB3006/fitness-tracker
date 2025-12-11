"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Timer, Heart, Sparkles, ChevronRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recovery } from "@/cms/types";

interface RecoveryCardProps {
  recovery: Recovery;
  index?: number;
  compact?: boolean;
}

export function RecoveryCard({ recovery, index = 0, compact = false }: RecoveryCardProps) {
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

  if (compact) {
    return (
      <Link href={`/recovery/${recovery.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={recovery.thumbnailUrl}
                  alt={recovery.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{recovery.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Timer className="h-3.5 w-3.5" />
                    {recovery.duration} min
                  </span>
                  <Badge variant="secondary" className={typeColors[recovery.type] || typeColors["mental-wellness"]}>
                    {typeLabels[recovery.type] || recovery.type}
                  </Badge>
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
    <Link href={`/recovery/${recovery.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={recovery.thumbnailUrl}
              alt={recovery.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Badge className={typeColors[recovery.type] || typeColors["mental-wellness"]}>
                {typeLabels[recovery.type] || recovery.type}
              </Badge>
              {recovery.requiresBooking && (
                <Badge className="bg-primary text-white border-0">
                  <Calendar className="h-3 w-3 mr-1" />
                  Book Appointment
                </Badge>
              )}
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-bold text-white text-lg">{recovery.title}</h3>
              {recovery.price && (
                <p className="text-white/90 text-sm mt-1">${recovery.price} per session</p>
              )}
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {recovery.description}
            </p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Timer className="h-4 w-4 text-primary" />
                  {recovery.duration} min
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Heart className="h-4 w-4 text-rose-500" />
                  {recovery.benefits.length} benefits
                </span>
                {recovery.price && (
                  <Badge variant="outline" className="text-sm font-semibold">
                    ${recovery.price}
                  </Badge>
                )}
              </div>
            </div>
            {recovery.requiresBooking && (
              <div className="mb-3">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Calendar className="h-3 w-3 mr-1" />
                  Requires Booking
                </Badge>
              </div>
            )}
            {/* Benefits Preview */}
            <div className="flex flex-wrap gap-1.5">
              {recovery.benefits.slice(0, 2).map((benefit, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
              {recovery.benefits.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{recovery.benefits.length - 2} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}


