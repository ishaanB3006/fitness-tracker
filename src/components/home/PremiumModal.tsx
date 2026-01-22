"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Trophy,
  Dumbbell,
  Salad,
  HeartPulse,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/analytics";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const premiumFeatures = [
  {
    icon: Dumbbell,
    title: "Unlimited Workouts",
    description: "Access 500+ premium workout routines",
  },
  {
    icon: Salad,
    title: "Custom Meal Plans",
    description: "AI-generated nutrition plans for your goals",
  },
  {
    icon: HeartPulse,
    title: "Recovery Sessions",
    description: "Exclusive spa & recovery bookings",
  },
  {
    icon: Trophy,
    title: "1-on-1 Coaching",
    description: "Personal trainer consultations",
  },
];

export function PremiumModal({ open, onOpenChange }: PremiumModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !name) return;

    setIsSubmitting(true);

    // Track premium subscription event to Lytics
    trackEvent("premium_subscription", {
      email: email,
      premium_users: true,
      name: name,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Close modal after showing success
    setTimeout(() => {
      onOpenChange(false);
      // Reset state after modal closes
      setTimeout(() => {
        setIsSuccess(false);
        setEmail("");
        setName("");
      }, 300);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gradient-to-b from-background to-background/95">
        {/* Premium Header */}
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-rose-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.15),transparent_50%)]" />
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <Crown className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold">
                Upgrade to{" "}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Premium
                </span>
              </DialogTitle>
              <DialogDescription className="text-base">
                Unlock your full potential with exclusive features
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-6 py-12 text-center"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Welcome to Premium!</h3>
              <p className="text-muted-foreground">
                Check your email for next steps
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 pb-6"
            >
              {/* Pricing */}
              <div className="flex items-center justify-center gap-2 mb-6 -mt-2">
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  50% OFF
                </Badge>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground line-through text-sm">
                    $19.99
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {premiumFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Form */}
              <div className="space-y-3 mb-4">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Subscribe Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                onClick={handleSubscribe}
                disabled={!email || !name || isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Zap className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Become Premium
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-3">
                Cancel anytime. No commitment required.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
