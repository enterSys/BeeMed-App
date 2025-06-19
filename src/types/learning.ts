export type QuestionType = 'multiple-choice' | 'true-false' | 'case-study' | 'drag-drop'

export type CourseCategory = 'anatomy' | 'physiology' | 'pathology' | 'pharmacology' | 'clinical'

export type ContentType = 'video' | 'text' | 'interactive' | '3d-model' | 'simulation'

export interface Course {
  id: string
  title: string
  description: string
  category: CourseCategory
  thumbnail: string
  duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xpReward: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Module {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  estimatedTime: number
  xpReward: number
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  description: string
  content: LessonContent[]
  order: number
  xpReward: number
  duration: number
}

export interface LessonContent {
  id: string
  type: ContentType
  content: string
  metadata?: Record<string, any>
  order: number
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  description: string
  passingScore: number
  timeLimit?: number
  xpReward: number
  attempts: number
}

export interface QuizQuestion {
  id: string
  quizId: string
  question: string
  type: QuestionType
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
  order: number
  media?: string
}

export interface UserProgress {
  id: string
  userId: string
  courseId?: string
  moduleId?: string
  lessonId?: string
  completed: boolean
  completedAt?: Date
  score?: number
  timeSpent: number
  lastAccessedAt: Date
}

export interface QuizAttempt {
  id: string
  userId: string
  quizId: string
  score: number
  answers: QuizAnswer[]
  startedAt: Date
  completedAt: Date
  passed: boolean
}

export interface QuizAnswer {
  questionId: string
  answer: string | string[]
  correct: boolean
  timeSpent: number
}