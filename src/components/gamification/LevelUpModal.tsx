'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  Button,
  Card
} from '@heroui/react'
import { getLevelTitle, getLevelPerks } from '@/lib/xp-utils'
import { cn } from '@/lib/utils'

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  newLevel: number
  previousLevel: number
}

export default function LevelUpModal({
  isOpen,
  onClose,
  newLevel,
  previousLevel
}: LevelUpModalProps) {
  const newTitle = getLevelTitle(newLevel)
  const newPerks = getLevelPerks(newLevel)
  const previousPerks = getLevelPerks(previousLevel)
  const unlockedPerks = newPerks.filter(perk => !previousPerks.includes(perk))

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      backdrop="blur"
      classNames={{
        base: "bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800",
        header: "border-b-0",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col items-center pt-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15,
              delay: 0.2
            }}
            className="mb-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="text-8xl"
            >
              🎉
            </motion.div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent"
          >
            Level Up!
          </motion.h2>
        </ModalHeader>
        
        <ModalBody className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="text-5xl font-bold text-primary">
              Level {newLevel}
            </div>
            
            <div className="text-xl text-default-600">
              {newTitle}
            </div>
            
            {unlockedPerks.length > 0 && (
              <Card className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20">
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  New Perks Unlocked!
                </h3>
                <div className="space-y-2">
                  {unlockedPerks.map((perk, index) => (
                    <motion.div
                      key={perk}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-primary">✓</span>
                      <span>{perk}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button
                color="primary"
                size="lg"
                onPress={onClose}
                className="mt-4 font-semibold"
              >
                Continue Learning
              </Button>
            </motion.div>
          </motion.div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}