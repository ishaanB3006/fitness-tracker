"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Heart, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecoveryCard } from "@/components/shared/RecoveryCard";
import { recoveries } from "@/cms/data";
import { RecoveryType, Difficulty } from "@/cms/types";
import { cn } from "@/lib/utils";

const recoveryTypes: RecoveryType[] = ["mental-wellness", "sports-massage", "stretching", "meditation", "breathing", "foam-rolling", "cryotherapy", "sauna"];
const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

const typeLabels: Record<RecoveryType, string> = {
  "mental-wellness": "Mental Wellness",
  "sports-massage": "Sports Massage",
  stretching: "Stretching",
  meditation: "Meditation",
  breathing: "Breathing",
  "foam-rolling": "Foam Rolling",
  cryotherapy: "Cryotherapy",
  sauna: "Sauna",
};

export default function RecoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<RecoveryType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const filteredRecoveries = recoveries.filter((recovery) => {
    const matchesSearch = recovery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recovery.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || recovery.type === selectedType;
    const matchesDifficulty = !selectedDifficulty || recovery.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const regularRecoveries = filteredRecoveries.filter((r) => !r.requiresBooking);
  const bookableRecoveries = filteredRecoveries.filter((r) => r.requiresBooking);

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedDifficulty(null);
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
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-rose-500 flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Recovery & Wellness</h1>
            <p className="text-muted-foreground">Mental well-being and sports recovery</p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recovery activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground self-center mr-2">Type:</span>
          {recoveryTypes.map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all",
                selectedType === type && "bg-primary text-white"
              )}
              onClick={() => setSelectedType(
                selectedType === type ? null : type
              )}
            >
              {typeLabels[type]}
            </Badge>
          ))}
          <span className="w-px h-6 bg-border mx-1" />
          <span className="text-sm text-muted-foreground self-center mr-2">Difficulty:</span>
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
        </div>

        {(selectedType || selectedDifficulty || searchQuery) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredRecoveries.length} activities found
            </span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </motion.div>

      {/* Regular Recovery Activities */}
      {regularRecoveries.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Self-Guided Recovery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularRecoveries.map((recovery, index) => (
              <RecoveryCard key={recovery.id} recovery={recovery} index={index} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Bookable Services */}
      {bookableRecoveries.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">Bookable Services</h2>
            <Badge variant="outline" className="text-sm">
              Professional Sessions
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookableRecoveries.map((recovery, index) => (
              <RecoveryCard key={recovery.id} recovery={recovery} index={index} />
            ))}
          </div>
        </motion.section>
      )}

      {filteredRecoveries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No recovery activities found matching your criteria.</p>
          <Button variant="ghost" onClick={clearFilters} className="mt-2">
            Clear filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}

