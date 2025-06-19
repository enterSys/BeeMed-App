import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UserMenu from '@/components/auth/UserMenu'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-2xl font-bold text-primary-600">🐝 BeeMed</span>
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                <Link
                  href="/dashboard"
                  className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/courses"
                  className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Courses
                </Link>
                <Link
                  href="/achievements"
                  className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Achievements
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/ai-assistant"
                  className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <span>AI Assistant</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">New</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}