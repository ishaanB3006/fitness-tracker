# FitFlow - Modern Fitness Planner App

A premium, mobile-first fitness planner built with Next.js 14, featuring personalized workouts, meal plans, and a brand manager console.

![FitFlow](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop)

## 🌟 Features

### Public App
- **Personalized Home Dashboard** - Tailored workout recommendations based on your profile
- **Workout Library** - Browse workouts by difficulty, muscle group, and equipment
- **Workout Detail** - Step-by-step exercise guides with progress tracking
- **Meal Plans** - Nutrition plans for various dietary preferences
- **Weekly Planner** - Automated weekly schedule generation
- **Progress Tracking** - Track calories, minutes, streaks, and achievements
- **Profile Setup** - Customize goals, equipment, and preferences

### Admin Console (B2B)
- **Brand Dashboard** - Overview of all campaigns and metrics
- **Campaign Manager** - Create and manage advertising campaigns
- **Sponsored Challenges** - Fitness challenges with brand rewards
- **Product Placements** - Manage in-app product placements
- **Coupons & Offers** - Create discount codes for promotions
- **Analytics Dashboard** - Track impressions, clicks, and conversions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin console pages
│   ├── meals/             # Meal plan pages
│   ├── planner/           # Weekly planner
│   ├── profile/           # User profile
│   ├── progress/          # Progress tracking
│   └── workouts/          # Workout pages
├── cms/                    # CMS integration layer
│   ├── client.ts          # Fetching utilities
│   ├── data.ts            # Demo data
│   └── types.ts           # TypeScript types
├── components/            
│   ├── layout/            # Layout components
│   ├── shared/            # Reusable components
│   └── ui/                # UI primitives
├── personalization/        # Personalization engine
│   ├── engine.ts          # Recommendation logic
│   ├── rules.ts           # Rule definitions
│   └── types.ts           # Type definitions
├── automations/            # Automation engine
│   ├── engine.ts          # Automation runner
│   └── types.ts           # Type definitions
├── store/                  # Zustand stores
│   ├── brandStore.ts      # B2B state
│   ├── plannerStore.ts    # Weekly planner state
│   ├── progressStore.ts   # User progress state
│   ├── themeStore.ts      # Theme state
│   └── userStore.ts       # User profile state
└── lib/                    # Utilities
    └── utils.ts           # Helper functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd fitness-planner
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages

### Public Routes
- `/` - Home (personalized dashboard)
- `/workouts` - Workout listing
- `/workouts/[id]` - Workout detail
- `/meals` - Meal plan listing
- `/meals/[id]` - Meal plan detail
- `/planner` - Weekly planner
- `/progress` - Progress dashboard
- `/profile` - Profile setup

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/campaigns` - Campaign manager
- `/admin/challenges` - Sponsored challenges
- `/admin/placements` - Product placements
- `/admin/coupons` - Coupons & offers
- `/admin/analytics` - Analytics dashboard

## 🎨 Design System

### Colors
- **Primary**: Emerald green (`#10B981`)
- **Energy**: Amber/Orange gradient
- **Strength**: Rose/Red gradient
- **Calm**: Violet/Purple gradient

### Typography
- **Sans**: Inter (body text)
- **Display**: Space Grotesk (headings, mono)

### Components
- Rounded cards with subtle shadows
- Soft gradients and glass effects
- Smooth animations via Framer Motion
- Dark mode support

## 🔧 Configuration

### CMS Integration
Replace the demo data in `src/cms/data.ts` with actual CMS API calls in `src/cms/client.ts`. The project is pre-configured with TypeScript types for:
- Workouts
- Workout Programs
- Meal Plans
- Goals
- Brand Campaigns
- Product Placements
- Coupons

### Personalization Rules
Customize the personalization rules in `src/personalization/rules.ts` to match your business logic.

### Automations
Configure automated triggers in `src/automations/engine.ts` for:
- Daily workout reminders
- Streak celebrations
- Progress adaptations
- Goal nudges

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ using Next.js, TypeScript, and TailwindCSS

