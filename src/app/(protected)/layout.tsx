"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { usePageTracking } from "@/hooks/usePageTracking";

function PageTracking() {
  usePageTracking();
  return null;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTracking />
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}

