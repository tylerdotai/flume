import './globals.css'
import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/lib/auth-context'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Flume - Task Manager',
  description: 'Task manager for humans and AI agents',
  manifest: '/manifest.json',
  icons: {
    icon: '/flume-logo.jpg',
    apple: '/flume-logo.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
