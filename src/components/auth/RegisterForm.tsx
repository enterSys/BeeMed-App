'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Card, CardBody, CardHeader, Divider, Link, Checkbox } from '@heroui/react'
import { motion } from 'framer-motion'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName || username,
          },
        },
      })

      if (error) throw error

      // Show success message
      router.push('/auth/verify-email?email=' + encodeURIComponent(email))
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col gap-1 px-6 py-6">
          <h1 className="text-2xl font-bold text-center">Join BeeMed</h1>
          <p className="text-sm text-gray-500 text-center">
            Start your gamified medical learning journey
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="px-6 py-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="bordered"
              isDisabled={loading}
            />
            
            <Input
              type="text"
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant="bordered"
              isDisabled={loading}
              description="This will be your unique identifier"
            />

            <Input
              type="text"
              label="Display Name"
              placeholder="Your display name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              variant="bordered"
              isDisabled={loading}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="bordered"
              isDisabled={loading}
              description="Minimum 6 characters"
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              variant="bordered"
              isDisabled={loading}
            />

            <Checkbox
              isSelected={acceptTerms}
              onValueChange={setAcceptTerms}
              isDisabled={loading}
              size="sm"
            >
              I accept the{' '}
              <Link href="/terms" size="sm" target="_blank">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy" size="sm" target="_blank">
                Privacy Policy
              </Link>
            </Checkbox>
            
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-danger-50 text-danger-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
              disabled={loading || !acceptTerms}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link href="/auth/login" size="sm">
              Log in
            </Link>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}