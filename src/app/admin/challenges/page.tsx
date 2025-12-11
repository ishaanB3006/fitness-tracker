"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Search, Users, Trophy, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useBrandStore } from "@/store";
import { SponsoredChallenge } from "@/cms/types";

export default function ChallengesPage() {
  const { challenges, addChallenge, updateChallenge, deleteChallenge } = useBrandStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<SponsoredChallenge | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: "",
    startDate: "",
    endDate: "",
  });

  const filteredChallenges = challenges.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (editingChallenge) {
      updateChallenge(editingChallenge.id, {
        title: formData.title,
        description: formData.description,
        reward: formData.reward,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
    } else {
      const newChallenge: SponsoredChallenge = {
        id: `sc-${Date.now()}`,
        brandId: "bc1",
        title: formData.title,
        description: formData.description,
        reward: formData.reward,
        startDate: formData.startDate,
        endDate: formData.endDate,
        participants: 0,
        completions: 0,
        thumbnailUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
      };
      addChallenge(newChallenge);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      reward: "",
      startDate: "",
      endDate: "",
    });
    setEditingChallenge(null);
  };

  const openEdit = (challenge: SponsoredChallenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      reward: challenge.reward,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
    });
    setIsDialogOpen(true);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sponsored Challenges</h1>
            <p className="text-muted-foreground">
              Create and manage fitness challenges for your brand
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Challenge
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingChallenge ? "Edit Challenge" : "Create New Challenge"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Challenge Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="30-Day Shred Challenge"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Complete 30 days of workouts..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reward</Label>
                  <Input
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                    placeholder="$100 gift card"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingChallenge ? "Save Changes" : "Create Challenge"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={challenge.thumbnailUrl}
                  alt={challenge.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{challenge.title}</h3>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {challenge.startDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5" />
                      {challenge.reward}
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {challenge.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.participants.toLocaleString()} joined</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.completions} completed</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(challenge)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteChallenge(challenge.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No challenges found</p>
          <Button variant="ghost" className="mt-2" onClick={() => setIsDialogOpen(true)}>
            Create your first challenge
          </Button>
        </div>
      )}
    </div>
  );
}

