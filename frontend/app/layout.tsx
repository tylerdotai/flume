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
  title: 'Flume - Your Command Center',
  description: 'Build, organize, ship.',
  icons: {
    icon: '/flume-logo.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="wave-bg min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
