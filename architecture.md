# BeeMed Platform Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 15 App Router │ HeroUI Components │ Framer Motion      │
│  TypeScript           │ Tailwind CSS v4   │ PWA Support        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  API Routes          │ Server Actions     │ Middleware          │
│  Authentication      │ Authorization      │ Rate Limiting       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Business Logic                             │
├─────────────────────────────────────────────────────────────────┤
│  Gamification Engine │ Learning Analytics │ Content Management  │
│  XP Calculator       │ Progress Tracking  │ Quiz Engine         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL          │ Redis Cache        │ File Storage        │
│  Prisma ORM          │ Socket.io          │ CDN                 │
└─────────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. User Management Module
**Purpose**: Handle user registration, authentication, and profile management

**Components**:
- Authentication (NextAuth.js)
- User profiles with avatar customization
- Role-based access control (RBAC)
- Social connections

**Database Tables**:
```sql
- users (id, email, name, role, created_at)
- profiles (user_id, avatar, bio, specialty)
- user_connections (user_id, connection_id, status)
```

### 2. Gamification Module
**Purpose**: Manage XP, levels, achievements, and rewards

**Components**:
- XP calculation service
- Level progression system
- Achievement tracker
- Loot distribution engine
- Leaderboard service

**Database Tables**:
```sql
- user_xp (user_id, total_xp, current_level)
- achievements (id, name, description, xp_reward, rarity)
- user_achievements (user_id, achievement_id, earned_at)
- loot_items (id, name, type, rarity, icon)
- user_inventory (user_id, item_id, quantity)
```

### 3. Learning Content Module
**Purpose**: Deliver educational content and track progress

**Components**:
- Course management
- Lesson delivery
- Quiz engine
- Progress tracking
- Content recommendations

**Database Tables**:
```sql
- courses (id, title, description, category)
- modules (id, course_id, title, order)
- lessons (id, module_id, title, content, xp_reward)
- quizzes (id, lesson_id, title, passing_score)
- quiz_questions (id, quiz_id, question, type)
- user_progress (user_id, lesson_id, completed_at, score)
```

### 4. Social Learning Module
**Purpose**: Enable collaboration and peer learning

**Components**:
- Study groups
- Discussion forums
- Peer review system
- Mentorship matching

**Database Tables**:
```sql
- study_groups (id, name, description, creator_id)
- group_members (group_id, user_id, role)
- forum_posts (id, author_id, title, content)
- peer_reviews (id, submission_id, reviewer_id, feedback)
```

## API Architecture

### RESTful Endpoints
```
/api/auth/*           - Authentication endpoints
/api/users/*          - User management
/api/courses/*        - Course CRUD operations
/api/lessons/*        - Lesson content delivery
/api/quizzes/*        - Quiz management
/api/gamification/*   - XP, achievements, loot
/api/social/*         - Groups, forums, connections
/api/analytics/*      - Learning analytics
```

### Real-time Events (Socket.io)
```javascript
// Client events
'quiz:submit'         - Submit quiz answers
'group:join'          - Join study group
'achievement:claim'   - Claim achievement reward

// Server events
'xp:awarded'          - XP gained notification
'achievement:unlocked'- New achievement
'leaderboard:update'  - Leaderboard changes
'group:message'       - Group chat message
```

## State Management

### Client State (Zustand)
```typescript
// User Store
interface UserStore {
  user: User | null
  xp: UserXP
  achievements: Achievement[]
  inventory: LootItem[]
}

// Course Store
interface CourseStore {
  courses: Course[]
  currentCourse: Course | null
  progress: Progress[]
}

// UI Store
interface UIStore {
  theme: 'light' | 'dark'
  notifications: Notification[]
  modals: ModalState
}
```

### Server State
- Session management via NextAuth
- Cache strategy with Redis
- Real-time state via Socket.io

## Security Architecture

### Authentication Flow
1. User login via NextAuth providers
2. JWT token generation
3. Session storage in encrypted cookies
4. Token refresh on expiration

### Authorization
- Role-based permissions (Student, Instructor, Admin)
- Resource-level access control
- API rate limiting per user/IP

### Data Protection
- Input validation and sanitization
- SQL injection prevention via Prisma
- XSS protection with React
- CSRF tokens for state-changing operations

## Performance Optimization

### Caching Strategy
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│    Redis    │────▶│  Database   │
│   Cache     │     │    Cache    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

- Browser: Service Worker caching
- Redis: Session data, leaderboards, hot data
- Database: Persistent storage with indexes

### Code Splitting
- Route-based splitting with Next.js
- Component lazy loading
- Dynamic imports for heavy libraries

### Asset Optimization
- Image optimization with Next.js Image
- Font subsetting
- CSS purging with Tailwind
- JavaScript minification

## Deployment Architecture

### Container Structure
```
┌─────────────────────────────────────┐
│         Load Balancer               │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐           ┌───▼────┐
│ App    │           │ App    │
│ Node 1 │           │ Node 2 │
└───┬────┘           └───┬────┘
    │                     │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │    PostgreSQL       │
    │    (Primary)        │
    └─────────────────────┘
```

### Scaling Strategy
- Horizontal scaling for app nodes
- Database read replicas
- Redis cluster for caching
- CDN for static assets

## Monitoring & Analytics

### Application Monitoring
- Error tracking with Sentry
- Performance monitoring
- User behavior analytics
- API usage metrics

### Health Checks
```typescript
// Health check endpoints
GET /api/health          - Application health
GET /api/health/db       - Database connectivity
GET /api/health/redis    - Redis connectivity
GET /api/health/detailed - Full system status
```

### Logging Strategy
- Structured JSON logging
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized log aggregation
- Real-time alerting for critical errors

## Development Workflow

### Git Branch Strategy
```
main
├── develop
│   ├── feature/gamification-xp
│   ├── feature/quiz-engine
│   └── feature/social-groups
├── staging
└── hotfix/critical-bug
```

### CI/CD Pipeline
1. Code push to feature branch
2. Automated tests (unit, integration, e2e)
3. Code quality checks (ESLint, TypeScript)
4. Build verification
5. Deploy to staging
6. Manual QA approval
7. Merge to main
8. Deploy to production

### Testing Strategy
- Unit tests: Components, utilities
- Integration tests: API endpoints
- E2E tests: Critical user flows
- Performance tests: Load testing
- Security tests: Vulnerability scanning