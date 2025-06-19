'use client'

import { motion } from 'framer-motion'
import { Progress, Tooltip } from '@heroui/react'
import { cn } from '@/lib/utils'
import { 
  calculateLevel, 
  calculateXPToNextLevel, 
  getLevelProgress, 
  getLevelTitle,
  formatXP 
} from '@/lib/xp-utils'

interface XPBarProps {
  currentXP: number
  showDetails?: boolean
  animate?: boolean
  className?: string
}

export default function XPBar({ 
  currentXP, 
  showDetails = true, 
  animate = true,
  className 
}: XPBarProps) {
  const currentLevel = calculateLevel(currentXP)
  const xpToNextLevel = calculateXPToNextLevel(currentXP)
  const progress = getLevelProgress(currentXP)
  const levelTitle = getLevelTitle(currentLevel)

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            initial={animate ? { scale: 0 } : undefined}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-bold text-primary">
              Level {currentLevel}
            </span>
            <span className="text-sm text-default-500">
              {levelTitle}
            </span>
          </motion.div>
        </div>
        
        {showDetails && (
          <Tooltip content={`Total XP: ${formatXP(currentXP)}`}>
            <span className="text-sm text-default-500">
              {formatXP(currentXP)} / {formatXP(currentXP + xpToNextLevel)} XP
            </span>
          </Tooltip>
        )}
      </div>

      <div className="relative">
        <Progress
          value={progress}
          color="primary"
          size="lg"
          className="h-6"
          classNames={{
            indicator: cn(
              "bg-gradient-to-r from-primary-400 to-primary-600",
              animate && "transition-all duration-1000 ease-out"
            ),
          }}
        />
        
        {animate && progress > 0 && (
          <motion.div
            className="absolute inset-0 h-full rounded-full opacity-30"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut",
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 3
            }}
          >
            <div className="h-full rounded-full bg-primary-400 animate-xp-pulse" />
          </motion.div>
        )}
      </div>

      {showDetails && (
        <motion.div
          initial={animate ? { opacity: 0, y: 10 } : undefined}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between text-xs text-default-500"
        >
          <span>{formatXP(xpToNextLevel)} XP to level {currentLevel + 1}</span>
          <span>{progress.toFixed(1)}% complete</span>
        </motion.div>
      )}
    </div>
  )
}