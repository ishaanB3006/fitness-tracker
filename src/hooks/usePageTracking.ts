// =============================================================================
// Page View Tracking Hook
// =============================================================================

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname, {
        path: pathname,
        timestamp: new Date().toISOString(),
      });
    }
  }, [pathname]);
}

