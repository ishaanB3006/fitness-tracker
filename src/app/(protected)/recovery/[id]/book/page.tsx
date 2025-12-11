"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recoveries } from "@/cms/data";
import { format } from "date-fns";

const typeColors: Record<string, string> = {
  cryotherapy: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  sauna: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const typeLabels: Record<string, string> = {
  cryotherapy: "Cryotherapy",
  sauna: "Sauna",
};

// Generate available time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push(time);
    }
  }
  return slots;
};

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const recovery = recoveries.find((r) => r.id === params.id);

  if (!recovery || !recovery.requiresBooking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Service not available for booking</h1>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const timeSlots = generateTimeSlots();
  const minDate = format(new Date(), "yyyy-MM-dd");
  const maxDate = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"); // 30 days from now

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !name || !email || !phone) {
      return;
    }

    setIsBooking(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsBooking(false);
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Your appointment for {recovery.title} has been confirmed.
          </p>
          <Card className="max-w-md mx-auto mb-6">
            <CardContent className="p-6">
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-semibold">{selectedTime}</p>
                  </div>
                </div>
                {recovery.price && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-semibold">${recovery.price}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push("/recovery")}>
              View All Services
            </Button>
            <Button onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </motion.div>
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
          <Image
            src={recovery.thumbnailUrl}
            alt={recovery.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <Badge className={`${typeColors[recovery.type] || typeColors.cryotherapy} w-fit mb-2`}>
              {typeLabels[recovery.type] || recovery.type}
            </Badge>
            <h1 className="text-3xl font-bold text-white mb-2">{recovery.title}</h1>
            {recovery.price && (
              <p className="text-white/90">${recovery.price} per session</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Select Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="mt-2"
                />
              </div>

              {selectedDate && (
                <div>
                  <Label>Available Times</Label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Service</p>
                <p className="font-semibold">{recovery.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="font-semibold">{recovery.duration} minutes</p>
              </div>
              {selectedDate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-semibold">{format(new Date(selectedDate), "MMM d, yyyy")}</p>
                </div>
              )}
              {selectedTime && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time</p>
                  <p className="font-semibold">{selectedTime}</p>
                </div>
              )}
              {recovery.price && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">${recovery.price}</p>
                  </div>
                </div>
              )}
              <Button
                size="lg"
                className="w-full"
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || !name || !email || !phone || isBooking}
              >
                {isBooking ? "Processing..." : "Confirm Booking"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                You&apos;ll receive a confirmation email shortly
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

