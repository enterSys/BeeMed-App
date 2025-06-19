import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

// Add custom AI configuration
backend.addOutput({
  custom: {
    AI: {
      models: {
        MedicalAssistant: 'Claude-3.5-Sonnet',
        QuizGenerator: 'Claude-3.5-Sonnet',
        CaseStudyAnalyzer: 'Claude-3.5-Sonnet',
        StudyPlanGenerator: 'Claude-3.5-Sonnet',
      },
      features: {
        conversationalAI: true,
        contentGeneration: true,
        personalizedLearning: true,
      },
    },
  },
});