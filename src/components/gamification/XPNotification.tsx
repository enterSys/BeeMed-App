'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@heroui/react'
import { cn } from '@/lib/utils'

interface XPNotificationProps {
  amount: number
  source: string
  visible: boolean
  onComplete?: () => void
  className?: string
}

export default function XPNotification({
  amount,
  source,
  visible,
  onComplete,
  className
}: XPNotificationProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25 
          }}
          onAnimationComplete={onComplete}
          className={cn(
            "fixed bottom-4 right-4 z-50",
            className
          )}
        >
          <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1.1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1,
                  repeat: 2,
                  repeatType: "loop"
                }}
                className="text-3xl"
              >
                ⚡
              </motion.div>
              
              <div>
                <motion.div
                  key={amount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold"
                >
                  +{amount} XP
                </motion.div>
                <div className="text-sm opacity-90">
                  {source}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}