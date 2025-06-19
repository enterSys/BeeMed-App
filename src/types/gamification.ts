export type UserRole = 'student' | 'instructor' | 'admin'

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export type LootType = 'cosmetic' | 'functional' | 'consumable'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  userId: string
  avatar: string
  bio: string
  specialty: string
  title: string
  badges: string[]
}

export interface UserXP {
  userId: string
  totalXP: number
  currentLevel: number
  xpToNextLevel: number
  weeklyXP: number
  monthlyXP: number
  lastXPGain: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: Rarity
  xpReward: number
  category: string
  unlockCondition: string
  progress?: number
  maxProgress?: number
}

export interface UserAchievement {
  userId: string
  achievementId: string
  unlockedAt: Date
  claimed: boolean
}

export interface LootItem {
  id: string
  name: string
  description: string
  type: LootType
  rarity: Rarity
  icon: string
  effect?: string
  value?: number
}

export interface UserInventory {
  userId: string
  itemId: string
  quantity: number
  acquiredAt: Date
}

export interface XPTransaction {
  id: string
  userId: string
  amount: number
  source: string
  description: string
  timestamp: Date
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'all-time'
  entries: LeaderboardEntry[]
  lastUpdated: Date
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  userAvatar: string
  xp: number
  level: number
  change: number
}

export interface LevelData {
  level: number
  title: string
  minXP: number
  maxXP: number
  perks: string[]
}

export interface Streak {
  userId: string
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date
}