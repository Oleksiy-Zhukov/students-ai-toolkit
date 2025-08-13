'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function PublicHeader() {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-200 dark:bg-gray-900/70 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 bg-orange-500 text-white px-2 py-1 rounded">Skip to content</a>
        <Link href="/landing" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">StudentsAI</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-3">
          <Link href="/auth" className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">Log in</Link>
          <Link href="/auth">
            <Button className="bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-500 h-8">Start Free</Button>
          </Link>
          <a
            href="https://github.com/Oleksiy-Zhukov/students-ai-toolkit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}


