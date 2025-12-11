# When Events Are Sent - Lytics Analytics

## Event Sending Behavior

Events are sent to Lytics **immediately** when tracking functions are called, but with the following behavior:

### 1. **If SDK is Loaded** ✅
- Events are sent **synchronously** via `jstag.send()` or `jstag.pageView()`
- Happens instantly when the function is called
- No delay or queuing

### 2. **If SDK is NOT Loaded Yet** ⏳
- Events are **queued** in memory
- Once the SDK loads, all queued events are sent automatically
- Console logs show: `[Analytics] Event queued (SDK loading): event_name`

### 3. **Server-Side Rendering (SSR)** 🚫
- Events are **not sent** during SSR (when `window` is undefined)
- Only client-side events are tracked

## Current Event Triggers

### Automatic Events (No Action Required)

1. **Page Views** - Automatically tracked on route changes
   - Triggered by: `usePageTracking` hook in protected layout
   - When: Every time user navigates to a new page
   - Event: `pageView`

### User Action Events

2. **Onboarding Completed**
   - When: User completes onboarding form and clicks "Complete Setup"
   - Location: `OnboardingModal.tsx`
   - Event: `onboarding_completed`
   - Data: goal, age, weight, height, bmi

3. **Workout Viewed**
   - When: User opens a workout detail page
   - Location: `workouts/[id]/page.tsx`
   - Event: `workout_viewed`
   - Data: workout_id, workout_title

4. **Workout Started**
   - When: User clicks "Start Workout" button (first time)
   - Location: `workouts/[id]/page.tsx`
   - Event: `workout_started`
   - Data: workout_id, workout_title

5. **Workout Completed**
   - When: User completes all exercises (not yet implemented in UI)
   - Event: `workout_completed`
   - Data: workout_id, workout_title, duration_minutes, calories_burned

6. **Meal Plan Viewed**
   - When: User opens a meal plan detail page
   - Location: `meals/[id]/page.tsx`
   - Event: `meal_plan_viewed`
   - Data: meal_plan_id, meal_plan_title

7. **Recovery Activity Started**
   - When: User opens a recovery activity detail page OR clicks "Start Recovery Session"
   - Location: `recovery/[id]/page.tsx`
   - Event: `recovery_activity_started`
   - Data: recovery_id, recovery_title, recovery_type

8. **Recovery Activity Completed**
   - When: User clicks "Completed" button on recovery activity
   - Location: `recovery/[id]/page.tsx`
   - Event: `recovery_activity_completed`
   - Data: recovery_id, recovery_title, recovery_type

9. **Recovery Booking Initiated**
   - When: User clicks "Confirm Booking" button
   - Location: `recovery/[id]/book/page.tsx`
   - Event: `recovery_booking_initiated`
   - Data: recovery_id, recovery_title, price

10. **Recovery Booking Completed**
    - When: Booking is successfully processed (after API call)
    - Location: `recovery/[id]/book/page.tsx`
    - Event: `recovery_booking_completed`
    - Data: recovery_id, recovery_title, price, booking_date, booking_time

## Event Flow Diagram

```
User Action
    ↓
analytics.function() called
    ↓
trackEvent() called
    ↓
Is window.jstag available?
    ├─ YES → Send immediately via jstag.send()
    └─ NO  → Queue event in memory
            ↓
        SDK loads
            ↓
        Process queue
            ↓
        Send all queued events
```

## Testing Events

To verify events are being sent:

1. **Open Browser Console** (F12)
2. **Look for logs:**
   - `[Analytics] Event queued (SDK loading): event_name` - Event queued
   - `[Analytics] Lytics SDK loaded, processed queued events` - Queue processed
3. **Check Network Tab:**
   - Look for requests to `c.lytics.io` domain
   - Events are sent as HTTP requests

## Important Notes

- Events include a `timestamp` property automatically
- All events are sent asynchronously (non-blocking)
- Events sent before SDK loads are preserved and sent once SDK is ready
- Page views are tracked automatically on every route change in protected routes

