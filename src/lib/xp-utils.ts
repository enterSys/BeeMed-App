import { LevelData } from '@/types/gamification'

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Medical Novice',
  5: 'First-Year Student',
  10: 'Clinical Observer',
  15: 'Junior Practitioner',
  20: 'Medical Scholar',
  25: 'Resident Physician',
  30: 'Clinical Expert',
  35: 'Senior Physician',
  40: 'Medical Specialist',
  45: 'Master Physician',
  50: 'Medical Professor',
  60: 'Distinguished Expert',
  70: 'Medical Authority',
  80: 'Legendary Healer',
  90: 'Medical Sage',
  100: 'Grand Master of Medicine',
}

export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1
}

export function calculateXPToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP)
  const nextLevelXP = Math.pow(currentLevel, 2) * 100
  return nextLevelXP - totalXP
}

export function calculateTotalXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100
}

export function getLevelProgress(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP)
  const currentLevelMinXP = calculateTotalXPForLevel(currentLevel)
  const nextLevelMinXP = calculateTotalXPForLevel(currentLevel + 1)
  const levelXPRange = nextLevelMinXP - currentLevelMinXP
  const xpIntoLevel = totalXP - currentLevelMinXP
  
  return (xpIntoLevel / levelXPRange) * 100
}

export function getLevelTitle(level: number): string {
  const titles = Object.entries(LEVEL_TITLES)
    .map(([lvl, title]) => ({ level: parseInt(lvl), title }))
    .sort((a, b) => b.level - a.level)
  
  const matchedTitle = titles.find(t => level >= t.level)
  return matchedTitle?.title || 'Medical Student'
}

export function getLevelData(level: number): LevelData {
  return {
    level,
    title: getLevelTitle(level),
    minXP: calculateTotalXPForLevel(level),
    maxXP: calculateTotalXPForLevel(level + 1),
    perks: getLevelPerks(level),
  }
}

export function getLevelPerks(level: number): string[] {
  const perks: string[] = []
  
  if (level >= 5) perks.push('Access to advanced courses')
  if (level >= 10) perks.push('Peer review privileges')
  if (level >= 15) perks.push('Create study groups')
  if (level >= 20) perks.push('Mentor new students')
  if (level >= 25) perks.push('Custom avatar frames')
  if (level >= 30) perks.push('Priority support')
  if (level >= 40) perks.push('Course creation tools')
  if (level >= 50) perks.push('Platform moderator')
  
  return perks
}

export function calculateStreakBonus(streakDays: number): number {
  if (streakDays < 3) return 0
  if (streakDays < 7) return 10
  if (streakDays < 14) return 25
  if (streakDays < 30) return 50
  if (streakDays < 60) return 75
  return 100
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`
  }
  return xp.toString()
}