import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button, Card, CardBody } from '@heroui/react'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary-600">🐝 BeeMed</h1>
          <div className="space-x-4">
            <Button variant="light" as={Link} href="/auth/login">
              Log In
            </Button>
            <Button color="primary" as={Link} href="/auth/register">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Gamified Medical Education
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your medical learning journey with engaging gamification, 
            earn XP, unlock achievements, and compete with peers worldwide.
          </p>
          <Button
            size="lg"
            color="primary"
            as={Link}
            href="/auth/register"
            className="font-semibold"
          >
            Start Learning for Free
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card>
            <CardBody className="text-center p-8">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-2">Gamified Learning</h3>
              <p className="text-gray-600">
                Earn XP, level up, and unlock achievements as you master medical concepts
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center p-8">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Expert Content</h3>
              <p className="text-gray-600">
                Comprehensive courses covering anatomy, physiology, pathology, and more
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center p-8">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Compete & Collaborate</h3>
              <p className="text-gray-600">
                Join study groups, climb leaderboards, and learn with peers globally
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-8">Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '📈', title: 'Progress Tracking', desc: 'Visual XP bars and level progression' },
              { icon: '🎯', title: 'Interactive Quizzes', desc: 'Test knowledge with instant feedback' },
              { icon: '👥', title: 'Study Groups', desc: 'Learn together with classmates' },
              { icon: '🎁', title: 'Loot System', desc: 'Unlock cosmetic rewards and badges' },
              { icon: '📱', title: 'Mobile Ready', desc: 'Learn anywhere on any device' },
              { icon: '🔄', title: 'Real-time Updates', desc: 'Live notifications and progress sync' },
              { icon: '🧑‍🏫', title: 'Mentorship', desc: 'Connect with senior students' },
              { icon: '📊', title: 'Analytics', desc: 'Track your learning patterns' },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 BeeMed. Gamified medical education for the next generation.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}