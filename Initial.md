<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Create me prompts as markdowns that I can feed claude code to get it started with the project. Also recommend a library for the UI and animations. Claude code will be programming everything with Opus 4. Act as a systems architect and senior designer and give me all the prompts and resources as markdowns. Include an architecture.md for it to refer to as well. Be as specific as you can.

I'll create a comprehensive set of prompts and resources for your gamified educational platform project. Here are the markdown files with detailed specifications:

### 1. Project Setup Prompt

```markdown
# Project Setup and Initial Configuration

## Technology Stack Requirements
- Next.js 15 with React 19 (App Router)
- TypeScript
- Tailwind CSS v4 with custom gamification theme
- shadcn/ui component library
- Motion.dev (Framer Motion) for animations
- Zustand for state management

## Implementation Steps
1. Initialize project:
```

npx create-next-app@latest eduquest-platform --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

```

2. Install dependencies:
```

npm install motion lottie-react @radix-ui/react-icons lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install zustand date-fns nanoid

```

3. Configure shadcn/ui:
```

npx shadcn@latest init

# Select: TypeScript, Default style, Slate base color, CSS variables

```

4. Add essential components:
```

npx shadcn@latest add button card input label
npx shadcn@latest add progress badge avatar
npx shadcn@latest add dialog dropdown-menu

```

5. Configure Tailwind for gamification (`tailwind.config.ts`):
```

theme: {
extend: {
colors: {
xp: {
bronze: '\#CD7F32',
silver: '\#C0C0C0',
gold: '\#FFD700',
diamond: '\#B9F2FF'
},
rarity: {
common: '\#9CA3AF',
uncommon: '\#22C55E',
rare: '\#3B82F6',
epic: '\#A855F7',
legendary: '\#F59E0B'
}
},
keyframes: {
"xp-pulse": {
"0%, 100%": { transform: "scale(1)", opacity: "1" },
"50%": { transform: "scale(1.05)", opacity: "0.8" },
},
"level-up": {
"0%": { transform: "scale(0.8) rotate(-10deg)", opacity: "0" },
"50%": { transform: "scale(1.2) rotate(5deg)", opacity: "1" },
"100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
}
},
animation: {
"xp-pulse": "xp-pulse 2s ease-in-out infinite",
"level-up": "level-up 0.6s ease-out",
}
}
}

```

6. Create gamification types (`src/types/gamification.ts`):
```

export interface UserXP {
userId: string;
totalXP: number;
currentLevel: number;
xpToNextLevel: number;
}

export interface Achievement {
id: string;
name: string;
description: string;
icon: string;
rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
xpReward: number;
}

export interface LootItem {
id: string;
name: string;
type: 'cosmetic' | 'functional' | 'consumable';
rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
icon: string;
}

```

7. Create XP utilities (`src/lib/xp-utils.ts`):
```

export const calculateLevel = (totalXP: number): number => {
return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

export const calculateXPToNextLevel = (totalXP: number): number => {
const currentLevel = calculateLevel(totalXP);
return Math.pow(currentLevel, 2) * 100 - totalXP;
};

```

8. Run development server:
```

npm run dev

```
```


### 2. UI Library Recommendations

```markdown
# UI and Animation Library Recommendations

## Core UI Library: shadcn/ui + Radix Primitives
**Why this combination:**
- Headless components for complete styling control
- Perfect integration with Tailwind CSS v4
- Accessibility built-in (WAI-ARIA compliant)
- Zero runtime overhead (copy-paste components)
- Active community support

**Installation:**
```

npx shadcn@latest add

```

## Animation Libraries
### Primary: Framer Motion (motion.dev)
```

npm install motion

```
**Best for:**
- XP counter animations
- Level-up transitions
- Interactive component transitions
- Gesture animations (drag, hover)

### Secondary: Lottie React
```

npm install lottie-react

```
**Best for:**
- Loot box opening sequences
- Achievement celebrations
- Complex reward animations

## Gamification Component Structure
```

/components
/gamification
├── XPBar.tsx
├── AchievementBadge.tsx
├── LootBox.tsx
├── Leaderboard.tsx
└── ProgressRing.tsx

```

## Animation Implementation Pattern
```

import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

export function XPBar({ currentXP, totalXP }: { currentXP: number, totalXP: number }) {
return (
<motion.div
className="relative h-4 w-full bg-gray-200 rounded-full"
initial={{ width: 0 }}
animate={{ width: `${(currentXP/totalXP)*100}%` }}
transition={{ duration: 1, ease: "easeOut" }}
>
<div className={cn(
"h-full rounded-full",
currentXP >= totalXP ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-blue-500'
)} />
</motion.div>
)
}

```

## Accessibility Considerations
1. All animations respect `prefers-reduced-motion`
2. ARIA labels for all gamification elements
3. Focus management for interactive components
4. Color contrast compliance for text/background
```


### 3. Architecture Reference

```markdown
# Gamified Educational Platform Architecture

## System Overview
![Architecture Diagram](architecture-diagram.png)

## Core Modules
1. **User Management**
   - Roles: Student, Instructor, Admin
   - Profiles with XP tracking
   - Social connections

2. **Content Delivery**
   - Course/module/lesson hierarchy
   - Multimedia content support
   - Progress tracking

3. **Gamification Engine**
   - XP calculation service
   - Achievement system
   - Loot distribution system
   - Leaderboard service

4. **Learning Analytics**
   - Engagement tracking
   - Performance metrics
   - Predictive modeling

## Database Schema
```

erDiagram
users ||--o{ user_xp : has
users ||--o{ achievements : earns
users ||--o{ loot_items : owns
courses ||--o{ modules : contains
modules ||--o{ lessons : contains
lessons ||--o{ quizzes : has

    users {
        string id PK
        string email
        string name
        string role
    }
    user_xp {
        string userId FK
        int totalXP
        int currentLevel
    }
    achievements {
        string id PK
        string name
        string description
        string rarity
    }
    loot_items {
        string id PK
        string name
        string type
        string rarity
    }
    ```

## API Endpoints
### Gamification Endpoints
- `POST /api/xp/earn` - Award XP for completed activities
- `GET /api/achievements` - List available achievements
- `POST /api/loot/unlock` - Unlock loot items
- `GET /api/leaderboard` - Current leaderboard standings

### Learning Endpoints
- `GET /api/courses` - List available courses
- `POST /api/progress` - Update lesson progress
- `GET /api/recommendations` - Get personalized recommendations

## Real-time Events
```

// XP Award Event
socket.emit('xp-awarded', {
userId: 'user_123',
amount: 50,
source: 'quiz_completion',
timestamp: new Date()
});

// Achievement Unlocked Event
socket.emit('achievement-unlocked', {
userId: 'user_123',
achievementId: 'achv_medic_master',
timestamp: new Date()
});

```

## Security Requirements
1. JWT authentication for all API endpoints
2. Role-based access control (RBAC)
3. Server-side validation of all XP awards
4. Anti-cheat mechanisms for leaderboards
5. Rate limiting on gamification endpoints

## Performance Targets
| Feature | Target Latency |
|---------|----------------|
| XP Updates | < 100ms |
| Leaderboard | < 200ms |
| Content Loading | < 500ms |
| Loot Animation | < 50ms |
```


### 4. Component Implementation Prompt

```markdown
# Gamification Component Implementation

## XP Counter Component
**File:** `src/components/gamification/XPBar.tsx`

**Requirements:**
- Animated progress bar
- Level display with animation
- Responsive design
- XP tooltip on hover

**Implementation Guide:**
```

import { motion } from 'framer-motion';
import { calculateLevel, calculateXPToNextLevel } from '@/lib/xp-utils';

interface XPBarProps {
currentXP: number;
}

export default function XPBar({ currentXP }: XPBarProps) {
const currentLevel = calculateLevel(currentXP);
const xpToNextLevel = calculateXPToNextLevel(currentXP);
const progress = (currentXP / (currentXP + xpToNextLevel)) * 100;

return (
<div className="w-full space-y-2">
<div className="flex justify-between">
<span className="font-medium">Level {currentLevel}</span>
<span className="text-muted-foreground">
{currentXP} / {currentXP + xpToNextLevel} XP
</span>
</div>
<div className="relative h-4 w-full bg-gray-200 rounded-full overflow-hidden">
<motion.div
className="h-full bg-blue-500 rounded-full"
initial={{ width: 0 }}
animate={{ width: `${progress}%` }}
transition={{ duration: 1, ease: "easeOut" }}
/>
</div>
<div className="text-xs text-right text-muted-foreground">
{xpToNextLevel} XP to next level
</div>
</div>
);
}

```

## Achievement Badge Component
**File:** `src/components/gamification/AchievementBadge.tsx`

**Requirements:**
- Rarity-based styling (colors, borders)
- Hover animation
- Tooltip with achievement details
- Progress indicator for multi-stage achievements

**Implementation Guide:**
```

import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AchievementBadgeProps {
name: string;
description: string;
icon: string;
rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
progress?: number;
total?: number;
}

const rarityColors = {
common: 'bg-gray-100 border-gray-300',
uncommon: 'bg-green-100 border-green-300',
rare: 'bg-blue-100 border-blue-300',
epic: 'bg-purple-100 border-purple-300',
legendary: 'bg-yellow-100 border-yellow-300'
};

export default function AchievementBadge({
name,
description,
icon,
rarity,
progress,
total
}: AchievementBadgeProps) {
return (
<Tooltip>
<TooltipTrigger asChild>
<motion.div
className={cn(
"p-3 border-2 rounded-lg flex items-center space-x-3 cursor-pointer",
rarityColors[rarity]
)}
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
>
<div className="text-2xl">{icon}</div>
<div>
<div className="font-semibold">{name}</div>
{progress !== undefined \&\& total !== undefined \&\& (
<div className="text-xs text-muted-foreground">
{progress}/{total}
</div>
)}
</div>
</motion.div>
</TooltipTrigger>
<TooltipContent>
<p className="font-semibold">{name}</p>
<p className="text-muted-foreground">{description}</p>
<div className="mt-2 text-xs capitalize text-foreground">
Rarity: <span className={cn("font-semibold", `text-${rarity}`)}>{rarity}</span>
</div>
</TooltipContent>
</Tooltip>
);
}

```
```


### 5. Animation Implementation Prompt

```markdown
# Animation Implementation Guide

## Core Animation Principles
1. **Purposeful Motion**: All animations should enhance understanding
2. **Performance First**: Prioritize CSS transitions over JavaScript
3. **Progressive Enhancement**: Graceful degradation when animations disabled
4. **Gamification Personality**: Playful but not distracting

## Recommended Animation Patterns

### XP Award Sequence
```

import { motion, AnimatePresence } from 'framer-motion';

function XPAwardNotification({ amount }: { amount: number }) {
return (
<AnimatePresence>
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
>
<div className="flex items-center space-x-2">
<motion.span
key={amount}
initial={{ scale: 0.5 }}
animate={{ scale: 1 }}
className="font-bold"
>
+{amount} XP
</motion.span>
<motion.div
animate={{
rotate: [0, 10, -10, 10, 0],
scale: [1, 1.2, 1.1, 1.2, 1]
}}
transition={{ duration: 1 }}
>
🎯
</motion.div>
</div>
</motion.div>
</AnimatePresence>
);
}

```

### Loot Box Opening
```

import Lottie from 'lottie-react';
import lootAnimation from './loot-animation.json';

function LootBoxOpener({ onComplete }: { onComplete: (item: LootItem) => void }) {
return (
<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
<Lottie
animationData={lootAnimation}
loop={false}
onComplete={onComplete}
style={{ width: 300, height: 300 }}
/>
</div>
);
}

```

### Level Up Sequence
```

import { motion, AnimatePresence } from 'framer-motion';

function LevelUpModal({ newLevel }: { newLevel: number }) {
return (
<AnimatePresence>
<motion.div
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.8 }}
className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
>
<motion.div
initial={{ rotate: -10, scale: 0.5 }}
animate={{
rotate: 0,
scale: 1,
transition: {
type: "spring",
stiffness: 300,
damping: 15
}
}}
className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-center max-w-md"
>
<motion.div
animate={{
scale: [1, 1.1, 1],
transition: {
repeat: Infinity,
duration: 2
}
}}
className="text-6xl mb-4"
>
🎉
</motion.div>
<h2 className="text-3xl font-bold text-white mb-2">Level Up!</h2>
<p className="text-xl text-white">You've reached Level {newLevel}</p>
</motion.div>
</motion.div>
</AnimatePresence>
);
}

```

## Animation Performance Optimization
1. Use `will-change: transform` for animated elements
2. Prefer `transform` and `opacity` over layout-triggering properties
3. Use `useMemo` for complex animations
4. Implement intersection observers for offscreen animations
5. Use CSS hardware acceleration with `translateZ(0)`
```

These prompts provide Claude with everything needed to start building your gamified educational platform. The architecture document serves as the central reference, while the component and animation guides ensure consistent implementation of gamification features.

<div style="text-align: center">⁂</div>

[^1]: https://www.robinwieruch.de/react-libraries/

[^2]: https://www.supernova.io/blog/top-10-pre-built-react-frontend-ui-libraries-for-2025

[^3]: https://www.youtube.com/watch?v=4ettB5JqDps

[^4]: https://daily.dev/blog/10-best-ui-animation-libraries-for-beginners-2024

[^5]: https://nazmidincer.com/blog/the-main-components-of-a-successful-e-learning-platform/

[^6]: https://www.browserstack.com/guide/react-components-libraries

[^7]: https://dev.to/bybydev/top-10-javascript-animation-libraries-1km7

[^8]: https://www.justinmind.com/ui-design/how-to-design-e-learning-platform

[^9]: https://gamificationnation.com/fr/blog/gamification-trends-for-2025/

[^10]: https://themeselection.com/gamification-component-example/

[^11]: https://www.reddit.com/r/react/comments/1j4jrlp/gamified_a_collection_of_react_hooks_and/

[^12]: https://polcode.com/resources/blog/how-to-plan-software-architecture-for-e-learning-platforms/

[^13]: https://github.com/react-native-training/create-xp-app

[^14]: https://www.plotline.so/blog/tools-to-gamify-apps

[^15]: https://arxiv.org/pdf/2101.02373.pdf

[^16]: https://dev.to/jetthoughts/cross-platform-development-using-reactxp-3poc

[^17]: https://nextjs.org/blog/next-15

[^18]: https://www.reddit.com/r/nextjs/comments/1jt9i3m/master_the_2025_stack_complete_guide_to_nextjs_15/

[^19]: https://nextjs.org/blog/next-15-1

[^20]: https://dev.to/aqsagull99/exploring-nextjs-15-the-future-of-react-19-applications-6kg

[^21]: https://www.walturn.com/insights/mastering-prompt-engineering-for-claude

[^22]: https://www.reddit.com/r/react/comments/1h8yb5b/has_anybody_used_shadcn_with_animation_library/

[^23]: https://nextjs.org/docs/app/guides/upgrading/version-15

[^24]: https://dev.to/shawon/claude-prompting-guide-general-tips-for-effective-prompting-5hi5

[^25]: https://www.reddit.com/r/reactjs/comments/1k1gerj/in_2025_whats_the_goto_reactjs_ui_library/

[^26]: https://www.aubergine.co/insights/top-ui-libraries-to-use-in-2025

[^27]: https://dev.to/holasoymalva/why-i-decided-to-stop-working-with-reactjs-in-2025-4d1l

[^28]: https://studiokrew.com/blog/app-gamification-strategies-2025/

[^29]: https://nextjs.org/blog

[^30]: https://github.com/shadcn-ui/ui/discussions/622

[^31]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/a415a87c6572b87b30b057b8d06e9c9c/55394f23-eed3-469f-b7f5-848286793a0f/7db1e39d.md

[^32]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/a415a87c6572b87b30b057b8d06e9c9c/72b0cd8a-cea8-49c5-80de-15836cf37ee7/e3f66cc6.md

[^33]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/a415a87c6572b87b30b057b8d06e9c9c/352071f3-7b46-4b55-877e-62bc0c6787a7/4e03c430.md

