import type { Metadata } from 'next'
import LayoutClient from './layout-client'

export const metadata: Metadata = {
  title: 'FreeModels',
  description: 'Discover and compare free coding LLM models',
  icons: {
    icon: '/icon.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <LayoutClient>{children}</LayoutClient>
    </html>
  )
}
