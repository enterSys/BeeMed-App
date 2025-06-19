# BeeMed - Medical Education Platform Project Specifications

## Project Overview
BeeMed is a gamified medical education platform designed to make learning medicine engaging and interactive through gamification elements like XP systems, achievements, and rewards.

## Technology Stack
- **Framework**: Next.js 15 with React 19 (App Router)
- **TypeScript**: Yes (strict mode)
- **UI Library**: HeroUI (instead of shadcn/ui)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io for live updates
- **Deployment**: Docker container

## Project Structure
```
src/
├── app/                    # Next.js 15 app directory
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components (<250 lines each)
│   ├── gamification/      # XP bars, achievements, etc.
│   ├── ui/                # HeroUI-based components
│   └── features/          # Feature-specific components
├── hooks/                 # Custom React hooks
├── services/              # Business logic & API calls
├── lib/                   # Utilities and configurations
├── types/                 # TypeScript types/interfaces
└── constants/             # App-wide constants
```

## Core Features

### 1. Gamification System
- **XP System**: Students earn XP for completing lessons, quizzes, and activities
- **Levels**: Dynamic level calculation based on total XP
- **Achievements**: Unlockable badges with different rarity tiers
- **Loot System**: Reward boxes with cosmetic items and power-ups
- **Leaderboards**: Weekly/monthly rankings

### 2. Learning Modules
- **Medical Courses**: Anatomy, Physiology, Pathology, Pharmacology
- **Interactive Content**: Videos, 3D models, case studies
- **Quizzes**: Multiple choice, case-based questions
- **Progress Tracking**: Visual progress indicators

### 3. Social Features
- **Study Groups**: Collaborative learning spaces
- **Peer Reviews**: Students can review each other's work
- **Mentorship**: Connect with senior students/professionals
- **Forums**: Discussion boards for topics

## UI/UX Guidelines

### Color Scheme
```typescript
const colors = {
  // Medical theme colors
  primary: {
    50: '#E8F5FF',
    500: '#0078D4',  // Medical blue
    900: '#003D6B'
  },
  // Gamification colors
  xp: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    diamond: '#B9F2FF'
  },
  rarity: {
    common: '#9CA3AF',
    uncommon: '#22C55E',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#F59E0B'
  }
}
```

### Component Guidelines
- Use HeroUI components as base
- Keep components under 100 lines
- Implement loading states for all async operations
- Add smooth transitions using Framer Motion
- Ensure mobile responsiveness

## Database Schema

### Core Tables
- **users**: Profile, authentication, roles
- **user_progress**: XP, levels, achievements
- **courses**: Medical courses structure
- **lessons**: Individual lesson content
- **quizzes**: Questions and answers
- **achievements**: Achievement definitions
- **user_achievements**: Unlocked achievements
- **loot_items**: Cosmetic rewards

## API Structure
```
/api/
├── auth/          # Authentication endpoints
├── users/         # User management
├── courses/       # Course CRUD
├── progress/      # Progress tracking
├── gamification/  # XP, achievements, loot
└── social/        # Groups, forums
```

## Security Requirements
- JWT-based authentication
- Role-based access control (Student, Instructor, Admin)
- Input validation on all endpoints
- Rate limiting for API calls
- Sanitize user-generated content
- HTTPS only in production

## Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- API response time: < 200ms
- Real-time updates: < 100ms latency

## Development Workflow
1. Create feature branch from main
2. Implement with tests
3. Ensure components < 250 lines
4. Run linting and type checking
5. Create PR with description
6. Deploy to staging for testing

## Testing Strategy
- Unit tests for utilities and hooks
- Component testing with React Testing Library
- E2E tests for critical user flows
- API integration tests
- Performance testing

## Deployment
- Dockerized application with Docker Build Cloud support
- Multi-architecture builds (linux/amd64, linux/arm64)
- Cloud builder: `cloud-mahzyarm-bee`
- Environment-based configuration
- Health check endpoints
- Graceful shutdown handling
- Automated backups for database

### Docker Build Cloud Commands
```bash
# Build with cloud builder
docker buildx build --builder cloud-mahzyarm-bee .

# Using Make commands
make cloud-build    # Build locally
make cloud-push     # Build and push to registry
make cloud-inspect  # Inspect cloud builder
```

## Monitoring
- Error tracking with Sentry
- Performance monitoring
- User analytics (privacy-compliant)
- Real-time alerts for critical issues

## Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Reduced motion support

## Code Standards
- ESLint + Prettier configuration
- Pre-commit hooks with Husky
- Conventional commits
- Documentation for public APIs
- TypeScript strict mode

## Environment Variables
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
SOCKET_URL=
REDIS_URL=
SENTRY_DSN=
```

## Getting Started
1. Clone repository
2. Install dependencies: `npm install`
3. Setup database: `npx prisma migrate dev`
4. Configure environment variables
5. Run development server: `npm run dev`

## Important Notes
- Always use HeroUI components (not shadcn/ui)
- Keep files under 250 lines
- Implement features incrementally
- Test each feature before moving to next
- Commit frequently with clear messages

## Task Management
To view the Linear tasks list with assignments for Claude Code and Mahzyar:
```bash
cat linear.md
```