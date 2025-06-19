'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Avatar,
  User,
  Skeleton,
} from '@heroui/react'
import { formatXP } from '@/lib/gamification'

interface UserData {
  id: string
  email: string
  username: string
  profile?: {
    display_name: string
    avatar_url: string | null
  }
  progress?: {
    total_xp: number
    current_level: number
  }
}

export default function UserMenu() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:user_profiles(*),
          progress:user_progress(*)
        `)
        .eq('id', authUser.id)
        .single()

      if (error) throw error

      setUser(data)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="w-32 h-8 rounded-lg" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    )
  }

  if (!user) return null

  const displayName = user.profile?.display_name || user.username
  const avatarUrl = user.profile?.avatar_url || undefined
  const level = user.progress?.current_level || 1
  const totalXp = user.progress?.total_xp || 0

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-gray-500">
              Level {level} · {formatXP(totalXp)} XP
            </p>
          </div>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="primary"
            name={displayName}
            size="sm"
            src={avatarUrl}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="User menu" variant="flat">
        <DropdownSection title="Profile" showDivider>
          <DropdownItem
            key="profile"
            description={`@${user.username}`}
            className="h-14 gap-2"
          >
            <User
              name={displayName}
              description={`Level ${level} · ${formatXP(totalXp)} XP`}
              avatarProps={{
                src: avatarUrl,
                name: displayName,
              }}
            />
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="Actions" showDivider>
          <DropdownItem key="dashboard" onClick={() => router.push('/dashboard')}>
            Dashboard
          </DropdownItem>
          <DropdownItem key="courses" onClick={() => router.push('/courses')}>
            My Courses
          </DropdownItem>
          <DropdownItem key="achievements" onClick={() => router.push('/achievements')}>
            Achievements
          </DropdownItem>
          <DropdownItem key="settings" onClick={() => router.push('/settings')}>
            Settings
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem key="logout" color="danger" onClick={handleLogout}>
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}