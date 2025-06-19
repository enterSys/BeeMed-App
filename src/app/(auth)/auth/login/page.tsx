import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | BeeMed',
  description: 'Log in to your BeeMed account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h2 className="text-4xl font-bold text-primary-600">🐝 BeeMed</h2>
          </Link>
          <p className="mt-2 text-gray-600">Gamified Medical Education</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}