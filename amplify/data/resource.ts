import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Medical Education AI Assistant
  MedicalAssistant: a.conversation({
    aiModel: a.ai.model('Claude 3.5 Sonnet'),
    systemPrompt: `You are BeeMed AI, a medical education assistant. Your role is to:
    - Help medical students understand complex medical concepts
    - Provide study tips and learning strategies
    - Answer questions about anatomy, physiology, pathology, and pharmacology
    - Guide students through case studies
    - Offer quiz preparation assistance
    - Always be encouraging and supportive
    - Remind students to verify critical information with their instructors
    - You cannot provide medical advice or diagnose conditions`,
    inferenceConfiguration: {
      maxTokens: 1000,
      temperature: 0.7,
      topP: 0.9,
    },
  })
  .authorization((allow) => [allow.authenticated()]),

  // Quiz Question Generator
  QuizGenerator: a.generation({
    aiModel: a.ai.model('Claude 3.5 Sonnet'),
    systemPrompt: `Generate medical quiz questions based on the given topic.
    Format: Return a JSON array with questions in this structure:
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "string",
      "difficulty": "easy|medium|hard",
      "xpReward": number
    }`,
    inferenceConfiguration: {
      maxTokens: 2000,
      temperature: 0.8,
    },
  })
  .authorization((allow) => [allow.authenticated()]),

  // Case Study Analyzer
  CaseStudyAnalyzer: a.generation({
    aiModel: a.ai.model('Claude 3.5 Sonnet'),
    systemPrompt: `Analyze medical case studies and provide structured learning insights.
    Help students identify:
    - Key symptoms and findings
    - Differential diagnoses to consider
    - Diagnostic approach
    - Treatment considerations
    - Learning points
    Format responses in a clear, educational manner.`,
    inferenceConfiguration: {
      maxTokens: 1500,
      temperature: 0.7,
    },
  })
  .authorization((allow) => [allow.authenticated()]),

  // Study Plan Generator
  StudyPlanGenerator: a.generation({
    aiModel: a.ai.model('Claude 3.5 Sonnet'),
    systemPrompt: `Create personalized study plans for medical students.
    Consider:
    - Student's current level and progress
    - Available study time
    - Upcoming exams or goals
    - Weak areas that need focus
    - Learning style preferences
    Return a structured daily/weekly plan with specific topics and time allocations.`,
    inferenceConfiguration: {
      maxTokens: 1000,
      temperature: 0.6,
    },
  })
  .authorization((allow) => [allow.authenticated()]),

  // Existing database models for context
  UserProgress: a.model({
    userId: a.id().required(),
    totalXP: a.integer().default(0),
    currentLevel: a.integer().default(1),
    studyStreak: a.integer().default(0),
    weakAreas: a.string().array(),
    strongAreas: a.string().array(),
  })
  .authorization((allow) => [allow.owner()]),

  StudySession: a.model({
    userId: a.id().required(),
    topic: a.string().required(),
    duration: a.integer().required(),
    xpEarned: a.integer().required(),
    questionsAnswered: a.integer().default(0),
    correctAnswers: a.integer().default(0),
    aiAssistanceUsed: a.boolean().default(false),
    timestamp: a.datetime().required(),
  })
  .authorization((allow) => [allow.owner()]),

  AIConversationHistory: a.model({
    userId: a.id().required(),
    conversationId: a.string().required(),
    topic: a.string(),
    helpful: a.boolean(),
    timestamp: a.datetime().required(),
  })
  .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});