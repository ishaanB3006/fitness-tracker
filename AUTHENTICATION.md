# Authentication System

## Overview

The FitFlow app uses **Firebase Authentication** to secure all routes. Users must log in before accessing any part of the application.

## Features

✅ **Email/Password Authentication**
- Sign up with email and password
- Sign in with existing credentials
- Password reset functionality (forgot password page)

✅ **Route Protection**
- All routes except `/login` require authentication
- Automatic redirect to login if not authenticated
- Redirect back to intended page after login

✅ **User Session Management**
- Persistent login state
- Logout functionality
- User profile display in navbar

## How It Works

### 1. Auth Context (`src/contexts/AuthContext.tsx`)
- Provides authentication state to entire app
- Manages login, signup, logout functions
- Tracks current user and loading state

### 2. Protected Route Component (`src/components/auth/ProtectedRoute.tsx`)
- Wraps protected pages
- Checks authentication status
- Redirects to login if not authenticated
- Shows loading state while checking auth

### 3. Login Page (`src/app/login/page.tsx`)
- Sign in / Sign up form
- Email and password validation
- Error handling
- Redirects authenticated users away

### 4. Navbar Integration
- Shows user avatar with dropdown menu
- Displays user name/email
- Logout button
- Hidden on login page

## Setup Instructions

1. **Configure Firebase** (see `FIREBASE_SETUP.md`)
2. **Add environment variables** to `.env.local`
3. **Enable Email/Password** in Firebase Console
4. **Test login** at `/login`

## Demo Credentials

For testing, you can use:
- Email: `demo@fitflow.com`
- Password: `demo123`

*(Note: These need to be created in Firebase first)*

## Protected Routes

All routes are protected except:
- `/login` - Login/Signup page
- `/forgot-password` - Password reset (if implemented)

## Admin Routes

Admin routes (`/admin/*`) are accessible but may have additional protection in the future.

## Usage Example

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function MyPage() {
  return (
    <ProtectedRoute>
      {/* Your page content */}
    </ProtectedRoute>
  );
}
```

## Logout

Users can logout via:
- Navbar dropdown menu > Logout
- This clears Firebase session and redirects to login

