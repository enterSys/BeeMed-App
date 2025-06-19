import { Card, CardBody, CardHeader, Button, Link } from '@heroui/react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Email | BeeMed',
  description: 'Verify your email address',
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  const email = searchParams.email || 'your email'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h2 className="text-4xl font-bold text-primary-600">🐝 BeeMed</h2>
          </Link>
          <p className="mt-2 text-gray-600">Gamified Medical Education</p>
        </div>

        <Card>
          <CardHeader className="text-center pb-0">
            <div className="mx-auto w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-success-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Check Your Email</h1>
          </CardHeader>
          <CardBody className="text-center space-y-4">
            <p className="text-gray-600">
              We've sent a verification email to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Please click the link in the email to verify your account and start your medical learning journey.
            </p>
            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-2">
                Didn't receive the email? Check your spam folder or
              </p>
              <Button variant="light" color="primary" size="sm">
                Resend verification email
              </Button>
            </div>
            <div className="pt-4">
              <Link href="/auth/login" className="text-sm">
                Back to login
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}