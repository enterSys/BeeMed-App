# BeeMed - Medical Education Platform

A gamified medical education platform built with Next.js 15, TypeScript, and HeroUI.

## Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Docker Development
```bash
# Using Make
make dev

# Or using docker-compose
docker-compose -f docker-compose.dev.yml up -d
```

### Docker Production
```bash
# Build and run
make build
make prod

# Or using docker-compose
docker-compose build
docker-compose up -d
```

## Features Implemented

### ✅ Core Setup
- Next.js 15 with TypeScript
- HeroUI component library integration
- Tailwind CSS with medical theme colors
- Docker containerization (dev & prod)

### ✅ Gamification System
- **XP Bar Component**: Visual progress tracking with animations
- **XP Notifications**: Real-time XP gain notifications
- **Level Up Modal**: Celebratory level progression
- **XP Utilities**: Level calculation, progress tracking, XP formatting

### 🚧 In Progress
- Achievement badges
- Loot box system
- Leaderboards
- Course structure

## Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/health/        # Health check endpoint
│   └── page.tsx           # Home page demo
├── components/
│   └── gamification/      # XP, achievements, rewards
├── lib/                   # Utilities
│   ├── xp-utils.ts       # XP calculations
│   ├── gamification-utils.ts
│   └── utils.ts
└── types/                 # TypeScript definitions
```

## Available Scripts
```bash
npm run dev       # Development server
npm run build     # Production build
npm run start     # Production server
npm run lint      # Run ESLint
npm run type-check # TypeScript check
```

## Environment Variables
Create `.env.local`:
```env
DATABASE_URL=postgresql://beemed:beemed_password@localhost:5432/beemed_db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

## Testing Components

Visit http://localhost:3000 to see:
- XP Bar with level progress
- Interactive XP gain buttons
- XP notifications on actions
- Level up modal when leveling

## Next Steps
1. Complete achievement system
2. Implement course structure
3. Add authentication
4. Create quiz engine
5. Build social features