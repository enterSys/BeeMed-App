import { createClient } from '@/lib/supabase/server'
import { Card, CardBody, CardHeader, Progress, Button } from '@heroui/react'
import { formatXP, getLevelTitle } from '@/lib/gamification'
import XPBar from '@/components/gamification/XPBar'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user data with progress
  const { data: userData } = await supabase
    .from('users')
    .select(`
      *,
      profile:user_profiles(*),
      progress:user_progress(*),
      enrollments(
        *,
        course:courses(*)
      ),
      achievements:user_achievements(
        achievement:achievements(*)
      )
    `)
    .eq('id', user.id)
    .single()

  const displayName = userData?.profile?.display_name || userData?.username || 'Student'
  const progress = userData?.progress || {
    total_xp: 0,
    current_level: 1,
    current_level_xp: 0,
    next_level_xp: 100,
    daily_streak: 0,
    weekly_xp: 0,
  }

  const recentAchievements = userData?.achievements?.slice(0, 3) || []
  const enrolledCourses = userData?.enrollments || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {displayName}!
        </h1>
        <p className="text-gray-600 mt-1">
          {getLevelTitle(progress.current_level)} · Level {progress.current_level}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Your Progress</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total XP</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatXP(progress.total_xp)}
                </span>
              </div>
              <XPBar
                currentXP={progress.current_level_xp}
                requiredXP={progress.next_level_xp}
                level={progress.current_level}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Daily Streak</p>
                <p className="text-2xl font-bold">
                  {progress.daily_streak} {progress.daily_streak === 1 ? 'day' : 'days'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Weekly XP</p>
                <p className="text-2xl font-bold">{formatXP(progress.weekly_xp)}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Achievements</h2>
          </CardHeader>
          <CardBody>
            {recentAchievements.length > 0 ? (
              <div className="space-y-3">
                {recentAchievements.map((ua: any) => (
                  <div key={ua.achievement.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      🏆
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{ua.achievement.name}</p>
                      <p className="text-xs text-gray-500">
                        +{ua.achievement.xp_reward} XP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Complete courses to earn achievements!
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <Button color="primary" size="sm" as={Link} href="/courses">
            Browse Courses
          </Button>
        </CardHeader>
        <CardBody>
          {enrolledCourses.length > 0 ? (
            <div className="space-y-4">
              {enrolledCourses.map((enrollment: any) => (
                <div
                  key={enrollment.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{enrollment.course.title}</h3>
                      <p className="text-sm text-gray-600">
                        {enrollment.course.category.replace('_', ' ')}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-primary-600">
                      {enrollment.progress}% Complete
                    </span>
                  </div>
                  <Progress value={enrollment.progress} className="mt-2" />
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      as={Link}
                      href={`/courses/${enrollment.course.id}`}
                    >
                      Continue Learning
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                You haven't enrolled in any courses yet
              </p>
              <Button color="primary" as={Link} href="/courses">
                Explore Courses
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}