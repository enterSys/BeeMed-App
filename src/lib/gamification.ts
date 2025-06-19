export function calculateLevel(totalXP: number): number {
  // Level calculation: Each level requires progressively more XP
  // Level 1: 0-100 XP
  // Level 2: 100-300 XP (+200)
  // Level 3: 300-600 XP (+300)
  // And so on...
  let level = 1
  let xpForCurrentLevel = 0
  let xpRequiredForNext = 100

  while (totalXP >= xpForCurrentLevel + xpRequiredForNext) {
    xpForCurrentLevel += xpRequiredForNext
    level++
    xpRequiredForNext = level * 100
  }

  return level
}

export function getXPForLevel(level: number): { min: number; max: number } {
  if (level === 1) return { min: 0, max: 100 }
  
  let min = 0
  for (let i = 1; i < level; i++) {
    min += i * 100
  }
  
  const max = min + level * 100
  return { min, max }
}

export function getCurrentLevelProgress(totalXP: number): {
  level: number
  currentLevelXP: number
  requiredXP: number
  percentage: number
} {
  const level = calculateLevel(totalXP)
  const { min, max } = getXPForLevel(level)
  const currentLevelXP = totalXP - min
  const requiredXP = max - min
  const percentage = (currentLevelXP / requiredXP) * 100

  return {
    level,
    currentLevelXP,
    requiredXP,
    percentage: Math.min(100, Math.max(0, percentage))
  }
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`
  } else if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`
  }
  return xp.toString()
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: 'Medical Novice',
    5: 'Medical Student',
    10: 'Clinical Scholar',
    15: 'Resident Physician',
    20: 'Medical Professional',
    25: 'Clinical Expert',
    30: 'Medical Specialist',
    40: 'Distinguished Physician',
    50: 'Master of Medicine',
    75: 'Medical Authority',
    100: 'Grand Master of Medicine'
  }

  // Find the highest title the user has achieved
  const sortedLevels = Object.keys(titles)
    .map(Number)
    .sort((a, b) => b - a)

  for (const titleLevel of sortedLevels) {
    if (level >= titleLevel) {
      return titles[titleLevel]
    }
  }

  return 'Medical Novice'
}

export function getStreakBonus(streak: number): number {
  // Streak bonuses
  if (streak >= 30) return 2.0  // 100% bonus
  if (streak >= 14) return 1.5  // 50% bonus
  if (streak >= 7) return 1.25  // 25% bonus
  if (streak >= 3) return 1.1   // 10% bonus
  return 1.0
}

export function getLevelPerks(level: number): string[] {
  const perks: string[] = []
  
  if (level >= 5) perks.push('Custom Avatar Frame')
  if (level >= 10) perks.push('Priority Support')
  if (level >= 15) perks.push('Exclusive Badges')
  if (level >= 20) perks.push('Early Access to New Courses')
  if (level >= 25) perks.push('Mentorship Opportunities')
  if (level >= 30) perks.push('Custom Study Plans')
  if (level >= 40) perks.push('VIP Community Access')
  if (level >= 50) perks.push('Course Creation Tools')
  
  return perks
}

export interface AchievementProgress {
  id: string
  current: number
  required: number
  percentage: number
}

export function checkAchievementProgress(
  type: string,
  current: number
): AchievementProgress[] {
  const achievements: Record<string, { required: number; id: string }[]> = {
    courses_completed: [
      { required: 1, id: 'first_course' },
      { required: 5, id: 'course_explorer' },
      { required: 10, id: 'dedicated_learner' },
      { required: 25, id: 'course_master' },
    ],
    perfect_quizzes: [
      { required: 1, id: 'perfect_score' },
      { required: 10, id: 'quiz_ace' },
      { required: 50, id: 'perfection_streak' },
    ],
    daily_streak: [
      { required: 3, id: 'getting_started' },
      { required: 7, id: 'week_warrior' },
      { required: 30, id: 'monthly_dedication' },
      { required: 100, id: 'century_streak' },
    ],
  }

  const relevantAchievements = achievements[type] || []
  
  return relevantAchievements.map(achievement => ({
    id: achievement.id,
    current,
    required: achievement.required,
    percentage: Math.min(100, (current / achievement.required) * 100)
  }))
}