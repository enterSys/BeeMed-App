import { Metadata } from 'next'
import { Tabs, Tab } from '@heroui/react'
import MedicalAssistant from '@/components/ai/MedicalAssistant'
import QuizGenerator from '@/components/ai/QuizGenerator'

export const metadata: Metadata = {
  title: 'AI Assistant | BeeMed',
  description: 'AI-powered medical education tools',
}

export default function AIAssistantPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Learning Assistant
        </h1>
        <p className="text-gray-600">
          Enhance your medical education with AI-powered tools
        </p>
      </div>

      <Tabs variant="underlined" size="lg">
        <Tab key="assistant" title="Study Assistant">
          <div className="mt-6">
            <MedicalAssistant />
          </div>
        </Tab>
        <Tab key="quiz" title="Quiz Generator">
          <div className="mt-6">
            <QuizGenerator />
          </div>
        </Tab>
        <Tab key="case-study" title="Case Studies" disabled>
          <div className="mt-6 text-center text-gray-500">
            Coming soon: AI-powered case study analysis
          </div>
        </Tab>
        <Tab key="study-plan" title="Study Planner" disabled>
          <div className="mt-6 text-center text-gray-500">
            Coming soon: Personalized study plan generator
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}