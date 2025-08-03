import React, { useState, useEffect } from 'react'
import { Brain, Github, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Header = () => {
  const [isDark, setIsDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-200 ${
        scrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-background'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                StudentsAI
              </h1>
              <p className="text-sm text-muted-foreground">
                Your intelligent study companion
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* GitHub Link */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="p-2"
            >
              <a 
                href="https://github.com/Oleksiy-Zhukov/students-ai-toolkit" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

