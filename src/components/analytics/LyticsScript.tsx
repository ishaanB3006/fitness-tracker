"use client";

import { useEffect } from "react";
import { initLytics } from "@/lib/analytics";

export function LyticsScript() {
  useEffect(() => {
    initLytics();
  }, []);

  return null;
}

