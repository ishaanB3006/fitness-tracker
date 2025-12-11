# Firebase Authentication Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Enable other providers like Google, GitHub, etc.

## Step 3: Get Your Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app (you can use any app nickname)
5. Copy the Firebase configuration object

## Step 4: Add Environment Variables

1. Create a `.env.local` file in the root of your project:

```bash
cp .env.local.example .env.local
```

2. Add your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 5: Test Authentication

1. Start your dev server: `npm run dev`
2. Navigate to `/login`
3. Create a new account or use demo credentials:
   - Email: `demo@fitflow.com`
   - Password: `demo123`

## Security Rules (Optional)

If you plan to use Firestore or Storage, configure security rules in Firebase Console.

## Demo Mode

The app includes demo credentials for testing. In production, remove the demo credentials section from the login page.

