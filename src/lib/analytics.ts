// =============================================================================
// Lytics Analytics Integration
// =============================================================================
// Note: This file contains client-side code but does NOT use "use client" directive
// because "use client" is only for React components, not utility files.
// All functions properly guard against SSR with typeof window checks.
// =============================================================================

// TypeScript declarations for jstag
declare global {
  interface Window {
    jstag?: {
      init: (config: { src: string }) => void;
      pageView: () => void;
      send: (data?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
      mock: () => void;
      unblock: () => void;
      getid: () => string | null;
      setid: (id: string) => void;
      loadEntity: (entity: string) => void;
      getEntity: (entity: string) => void;
      on: (event: string, callback: Function) => void;
      once: (event: string, callback: Function) => void;
      call: (method: string, ...args: any[]) => void;
    };
  }
}

// Event queue for events sent before SDK loads
let eventQueue: Array<{
  eventStream: string;
  properties?: Record<string, any>;
}> = [];

// Process queued events once SDK is ready
const processEventQueue = () => {
  if (typeof window === "undefined" || !window.jstag) return;

  while (eventQueue.length > 0) {
    const { eventStream, properties } = eventQueue.shift()!;
    try {
      if (eventStream === "pageView") {
        window.jstag.pageView();
        if (properties) {
          window.jstag.send({
            eventName: "pageView",
            timestamp: new Date().toISOString(),
            ...properties,
          });
        }
      } else {
        window.jstag.send({
          eventName: eventStream,
          timestamp: new Date().toISOString(),
          ...properties,
        });
      }
    } catch (error) {
      console.error(`Error tracking queued event ${eventStream}:`, error);
    }
  }
};

// Track if SDK ready check is already running
let checkSDKReadyInterval: ReturnType<typeof setInterval> | null = null;

// Check if SDK is ready periodically and process queue (fallback)
const startSDKReadyCheck = () => {
  if (typeof window === "undefined" || checkSDKReadyInterval) return;

  checkSDKReadyInterval = setInterval(() => {
    if (window.jstag) {
      processEventQueue();
      if (checkSDKReadyInterval) {
        clearInterval(checkSDKReadyInterval);
        checkSDKReadyInterval = null;
      }
    }
  }, 100);

  // Stop checking after 10 seconds
  setTimeout(() => {
    if (checkSDKReadyInterval) {
      clearInterval(checkSDKReadyInterval);
      checkSDKReadyInterval = null;
    }
  }, 10000);
};

// Initialize Lytics
export const initLytics = () => {
  if (typeof window === "undefined") return;

  // Start the SDK ready check
  startSDKReadyCheck();

  if (!window.jstag) {
    // Create initialization script using eval to avoid TypeScript issues with minified code
    const initScript = document.createElement("script");
    initScript.type = "text/javascript";
    initScript.textContent = `
      !function(){"use strict";var o=window.jstag||(window.jstag={}),r=[];function n(e){o[e]=function(){for(var n=arguments.length,t=new Array(n),i=0;i<n;i++)t[i]=arguments[i];r.push([e,t])}}n("send"),n("mock"),n("identify"),n("pageView"),n("unblock"),n("getid"),n("setid"),n("loadEntity"),n("getEntity"),n("on"),n("once"),n("call"),o.loadScript=function(n,t,i){var e=document.createElement("script");e.async=!0,e.src=n,e.onload=t,e.onerror=i;var o=document.getElementsByTagName("script")[0],r=o&&o.parentNode||document.head||document.body,c=o||r.lastChild;return null!=c?r.insertBefore(e,c):r.appendChild(e),this},o.init=function n(t){return this.config=t,this.loadScript(t.src,function(){if(o.init===n)throw new Error("Load error!");o.init(o.config),function(){for(var n=0;n<r.length;n++){var t=r[n][0],i=r[n][1];o[t].apply(o,i)}r=void 0}()}),this}}();
      jstag.init({src:'https://c.lytics.io/api/tag/0a0a8ff5344b5f161002f0b0565ee7f1/latest.min.js'});
    `;

    // Process queued events once SDK loads
    initScript.onload = function () {
      // Wait a bit for jstag to fully initialize
      setTimeout(() => {
        processEventQueue();
        console.log("[Analytics] Lytics SDK loaded, processed queued events");
      }, 200);
    };

    initScript.onerror = function () {
      console.error("[Analytics] Failed to load Lytics initialization script");
    };

    document.head.appendChild(initScript);
  }
};

// Track page view
export const trackPageView = (
  pageName?: string,
  properties?: Record<string, any>
) => {
  if (typeof window === "undefined") return;

  // If SDK is ready, send immediately
  if (window.jstag) {
    try {
      window.jstag.pageView();
      if (pageName || properties) {
        window.jstag.send({
          eventName: "pageView",
          page: pageName,
          timestamp: new Date().toISOString(),
          ...properties,
        });
      }
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  } else {
    // Queue page view if SDK not ready
    eventQueue.push({
      eventStream: "pageView",
      properties: { page: pageName, ...properties },
    });
    console.log(`[Analytics] Page view queued (SDK loading): ${pageName}`);
  }
};

// Track custom events
export const trackEvent = (
  eventStream: string,
  properties?: Record<string, any>
) => {
  if (typeof window === "undefined") {
    // SSR - don't queue, just return
    return;
  }

  // If SDK is ready, send immediately
  if (window.jstag) {
    try {
      window.jstag.send({
        eventName: eventStream,
        timestamp: new Date().toISOString(),
        ...properties,
      });
    } catch (error) {
      console.error(`Error tracking event ${eventStream}:`, error);
    }
  } else {
    // SDK not ready yet - queue the event
    eventQueue.push({ eventStream, properties });
    console.log(
      `[Analytics] Event queued (SDK loading): ${eventStream}`,
      properties
    );
  }
};

// Identify user
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (typeof window === "undefined" || !window.jstag) return;

  try {
    window.jstag.identify(userId, {
      ...traits,
      identifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error identifying user:", error);
  }
};

// Track profile update
export const trackProfileUpdate = (profileData: Record<string, any>) => {
  trackEvent("profile_updated", {
    ...profileData,
    updated_at: new Date().toISOString(),
  });
};

// ah-http-key
// O3!xcwlqrieao
