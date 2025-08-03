import React, { useState, useRef, useEffect } from 'react'
import { getKeyDisplay } from '@/hooks/useKeyboardShortcuts'

export const RetroTooltip = ({ 
  children, 
  content, 
  shortcut, 
  position = 'top',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    let x = 0
    let y = 0

    switch (position) {
      case 'top':
        x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
        y = triggerRect.top - tooltipRect.height - 8
        break
      case 'bottom':
        x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
        y = triggerRect.bottom + 8
        break
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8
        y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
        break
      case 'right':
        x = triggerRect.right + 8
        y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
        break
    }

    // Keep tooltip within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8))
    y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8))

    setTooltipPosition({ x, y })
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition)
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition)
      }
    }
  }, [isVisible, position])

  const handleMouseEnter = () => {
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  return (
    <div 
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y
          }}
        >
          <div className="retro-tooltip bg-card border-2 border-foreground px-3 py-2 text-sm shadow-lg">
            <div className="flex items-center space-x-2">
              <span className="text-foreground">{content}</span>
              {shortcut && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <kbd className="retro-keyboard bg-muted border border-foreground px-1.5 py-0.5 text-xs rounded" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}>
                    {getKeyDisplay(shortcut)}
                  </kbd>
                </>
              )}
            </div>
            {/* Pixel arrow */}
            <div className="absolute w-0 h-0 border-4 border-transparent" 
                 style={{
                   [position === 'top' ? 'top' : position === 'bottom' ? 'bottom' : position === 'left' ? 'left' : 'right']: '-8px',
                   [position === 'top' || position === 'bottom' ? 'left' : 'top']: '50%',
                   transform: position === 'top' || position === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)',
                   [`border-${position === 'top' ? 'bottom' : position === 'bottom' ? 'top' : position === 'left' ? 'right' : 'left'}-color`]: 'var(--foreground)'
                 }}>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 