'use client'

import { useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import { type Schema } from '@/amplify/data/resource'
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Chip } from '@heroui/react'
import { motion } from 'framer-motion'

const client = generateClient<Schema>()

interface Quiz {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
}

const topics = [
  { value: 'anatomy', label: 'Anatomy' },
  { value: 'physiology', label: 'Physiology' },
  { value: 'pathology', label: 'Pathology' },
  { value: 'pharmacology', label: 'Pharmacology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'microbiology', label: 'Microbiology' },
]

export default function QuizGenerator() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const generateQuiz = async () => {
    if (!selectedTopic) return

    setIsGenerating(true)
    setQuizzes([])
    setSelectedAnswers({})
    setShowResults(false)

    try {
      const { data } = await client.generations.QuizGenerator.create({
        prompt: `Generate 5 ${difficulty} medical quiz questions about ${selectedTopic}. 
                 Focus on practical knowledge that medical students need to know.`,
      })

      const generatedQuizzes = JSON.parse(data.content) as Quiz[]
      setQuizzes(generatedQuizzes)
    } catch (error) {
      console.error('Error generating quiz:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const calculateScore = () => {
    setShowResults(true)
    let totalXP = 0
    quizzes.forEach((quiz, index) => {
      if (selectedAnswers[index] === quiz.correctAnswer) {
        totalXP += quiz.xpReward
      }
    })
    // Here you would update the user's XP in the database
    return totalXP
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">AI Quiz Generator</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select
              label="Select Topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              {topics.map((topic) => (
                <SelectItem key={topic.value} value={topic.value}>
                  {topic.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
            >
              <SelectItem key="easy" value="easy">Easy</SelectItem>
              <SelectItem key="medium" value="medium">Medium</SelectItem>
              <SelectItem key="hard" value="hard">Hard</SelectItem>
            </Select>

            <Button
              color="primary"
              onClick={generateQuiz}
              disabled={!selectedTopic || isGenerating}
              className="h-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {quizzes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {quizzes.map((quiz, index) => (
            <Card key={index}>
              <CardBody>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  <div className="flex gap-2">
                    <Chip size="sm" variant="flat" color={
                      quiz.difficulty === 'easy' ? 'success' :
                      quiz.difficulty === 'medium' ? 'warning' : 'danger'
                    }>
                      {quiz.difficulty}
                    </Chip>
                    <Chip size="sm" variant="flat" color="primary">
                      {quiz.xpReward} XP
                    </Chip>
                  </div>
                </div>

                <p className="mb-4">{quiz.question}</p>

                <div className="space-y-2">
                  {quiz.options.map((option, optionIndex) => (
                    <Button
                      key={optionIndex}
                      variant={
                        showResults
                          ? option === quiz.correctAnswer
                            ? 'solid'
                            : selectedAnswers[index] === option
                            ? 'flat'
                            : 'bordered'
                          : selectedAnswers[index] === option
                          ? 'solid'
                          : 'bordered'
                      }
                      color={
                        showResults
                          ? option === quiz.correctAnswer
                            ? 'success'
                            : selectedAnswers[index] === option
                            ? 'danger'
                            : 'default'
                          : 'primary'
                      }
                      onClick={() => !showResults && setSelectedAnswers({
                        ...selectedAnswers,
                        [index]: option
                      })}
                      className="w-full justify-start"
                      disabled={showResults}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-sm font-medium text-gray-700">Explanation:</p>
                    <p className="text-sm text-gray-600">{quiz.explanation}</p>
                  </motion.div>
                )}
              </CardBody>
            </Card>
          ))}

          {!showResults && Object.keys(selectedAnswers).length === quizzes.length && (
            <Button
              color="primary"
              size="lg"
              onClick={calculateScore}
              className="w-full"
            >
              Submit Quiz
            </Button>
          )}

          {showResults && (
            <Card>
              <CardBody className="text-center">
                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-lg">
                  You earned <span className="text-primary-600 font-bold">
                    {calculateScore()} XP
                  </span>
                </p>
                <Button
                  color="primary"
                  onClick={() => {
                    setQuizzes([])
                    setSelectedAnswers({})
                    setShowResults(false)
                  }}
                  className="mt-4"
                >
                  Generate New Quiz
                </Button>
              </CardBody>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}