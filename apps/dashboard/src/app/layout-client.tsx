'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryProvider } from '@/lib/query-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/explorer', label: 'Explorer' },
  { href: '/compare', label: 'Compare' },
  { href: '/settings', label: 'Settings' },
]

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <body className={inter.className} suppressHydrationWarning>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
              <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <a href="/" className="flex items-center space-x-2">
                  <span className="text-lg sm:text-xl font-bold">ModelsFree</span>
                </a>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>

                {/* Right side: Theme toggle + Mobile menu */}
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  
                  {/* Mobile Menu Button */}
                  <button
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              {mobileMenuOpen && (
                <nav className="md:hidden border-t bg-background">
                  <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
                    {navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </nav>
              )}
            </header>
            
            <main className="container mx-auto px-4 py-6 sm:py-8 flex-1">
              {children}
            </main>
            
            <footer className="border-t mt-auto">
              <div className="container mx-auto px-4 py-4 sm:py-6 text-center text-muted-foreground text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                  <span>Desarrollado por{' '}
                    <a
                      href="https://gfdev.vercel.app"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      gfdev
                    </a>
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <a
                    href="https://github.com/gfdev10/Free-Models-IA"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ⭐ Star on GitHub
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </QueryProvider>
    </body>
  )
}
