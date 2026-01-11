"use client";

import { useEffect } from "react";
import { initPersonalize, getVariantAliases } from "@/lib/personalize";

export function PersonalizeScript() {
  useEffect(() => {
    const init = async () => {
      await initPersonalize();
      getVariantAliases();
    };
    init();
  }, []);

  return null;
}
