'use client'

import { Suspense } from 'react'
import VerifyEmailForm from './verify-email-form'

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F7F2' }}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#FF5A1F' }}></div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyEmailForm />
    </Suspense>
  )
}
