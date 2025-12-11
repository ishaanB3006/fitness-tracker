"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import HomePageContent from "./home-content";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}

