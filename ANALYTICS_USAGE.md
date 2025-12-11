# Lytics Analytics Integration Guide

This document explains how to use the Lytics tracking SDK (`jstag`) in the FitFlow app.

## Setup

The Lytics script is automatically loaded when the app starts via the `LyticsScript` component in the root layout.

## Available Functions

### Basic Tracking

```typescript
import { trackEvent, trackPageView, identifyUser } from "@/lib/analytics";

// Track a custom event
trackEvent("custom_event_name", {
  property1: "value1",
  property2: "value2",
});

// Track a page view
trackPageView("/workouts", {
  page_title: "Workouts Page",
});

// Identify a user
identifyUser("user-123", {
  email: "user@example.com",
  name: "John Doe",
});
```

### Pre-built Event Functions

The `analytics` object provides convenient functions for common events:

```typescript
import { analytics } from "@/lib/analytics";

// User Events
analytics.onboardingCompleted({
  goal: "weight-loss",
  age: 25,
  weight: 70,
  height: 175,
  bmi: 22.9,
});

// Workout Events
analytics.workoutStarted("w1", "Morning HIIT Blast");
analytics.workoutCompleted("w1", "Morning HIIT Blast", 25, 320);
analytics.workoutViewed("w1", "Morning HIIT Blast");

// Meal Events
analytics.mealPlanViewed("m1", "High Protein Meal Plan");
analytics.mealPlanSelected("m1", "High Protein Meal Plan", 2150);

// Recovery Events
analytics.recoveryActivityStarted("r1", "Guided Meditation", "mental-wellness");
analytics.recoveryActivityCompleted("r1", "Guided Meditation", "mental-wellness");
analytics.recoveryBookingInitiated("r7", "Cryotherapy Session", 45);
analytics.recoveryBookingCompleted("r7", "Cryotherapy Session", 45, "2024-02-15", "10:00");

// Navigation Events
analytics.navigationClick("/workouts", "navbar");

// Search Events
analytics.searchPerformed("HIIT", "workouts", 5);

// Filter Events
analytics.filterApplied({ difficulty: "beginner", muscleGroup: "full-body" }, "workouts");
```

## Current Implementation

Events are automatically tracked in:

1. **Onboarding** - When users complete onboarding with their goal and body attributes
2. **Workouts** - When users view, start, or complete workouts
3. **Meals** - When users view meal plans
4. **Recovery** - When users start recovery activities or book appointments
5. **Page Views** - Automatically tracked on all protected routes

## Adding New Events

To add a new event, you can either:

1. **Use the generic `trackEvent` function:**
```typescript
trackEvent("my_custom_event", {
  custom_property: "value",
});
```

2. **Add a new function to the `analytics` object** in `/lib/analytics.ts`:
```typescript
export const analytics = {
  // ... existing functions
  myCustomEvent: (data: { prop1: string; prop2: number }) => {
    trackEvent("my_custom_event", data);
  },
};
```

## Direct jstag Access

If you need direct access to `jstag` methods:

```typescript
if (typeof window !== "undefined" && window.jstag) {
  window.jstag.send("event_name", { data: "value" });
  window.jstag.identify("user-id", { traits: {} });
  window.jstag.pageView();
}
```

## Testing

Events are logged to the console in development. Check your browser's developer console to verify events are being sent.

## Notes

- All events include a `timestamp` property automatically
- The SDK loads asynchronously, so events queued before load will be sent automatically
- Page views are automatically tracked on route changes in protected routes

