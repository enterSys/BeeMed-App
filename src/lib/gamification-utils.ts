import { Rarity, Achievement } from '@/types/gamification'

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1,
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#9CA3AF',
  uncommon: '#22C55E',
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',
}

export const RARITY_XP_MULTIPLIER: Record<Rarity, number> = {
  common: 1,
  uncommon: 1.5,
  rare: 2,
  epic: 3,
  legendary: 5,
}

export function calculateLootRarity(): Rarity {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight
  
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    random -= weight
    if (random <= 0) {
      return rarity as Rarity
    }
  }
  
  return 'common'
}

export function calculateAchievementProgress(
  current: number,
  target: number
): number {
  return Math.min((current / target) * 100, 100)
}

export function sortAchievementsByRarity(
  achievements: Achievement[]
): Achievement[] {
  const rarityOrder: Rarity[] = ['legendary', 'epic', 'rare', 'uncommon', 'common']
  return achievements.sort((a, b) => {
    return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
  })
}

export function getNextMilestoneXP(currentXP: number): number {
  const milestones = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000]
  return milestones.find(m => m > currentXP) || currentXP + 10000
}

export function calculateDailyBonusXP(consecutiveDays: number): number {
  const baseBonus = 50
  const streakMultiplier = Math.min(consecutiveDays * 0.1, 2)
  return Math.floor(baseBonus * (1 + streakMultiplier))
}

export function getActivityXPReward(activity: string): number {
  const rewards: Record<string, number> = {
    'complete_lesson': 50,
    'pass_quiz': 100,
    'perfect_quiz': 150,
    'complete_module': 200,
    'complete_course': 500,
    'help_peer': 25,
    'daily_login': 10,
    'weekly_streak': 100,
    'monthly_streak': 500,
  }
  
  return rewards[activity] || 0
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`
    }
  }
  
  return 'just now'
}