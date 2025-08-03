import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const GlassmorphismCard = React.forwardRef(({
  className,
  children,
  variant = 'default',
  hover = true,
  floating = false,
  morphing = false,
  delay = 0,
  ...props
}, ref) => {
  const baseClasses = cn(
    'glass-card relative overflow-hidden',
    floating && 'float',
    morphing && 'morph',
    hover && 'card-hover',
    className
  )

  const variants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: hover ? {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    } : {}
  }

  return (
    <motion.div
      ref={ref}
      className={baseClasses}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={variants}
      {...props}
    >
      {/* Gradient overlay for enhanced glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none" />
    </motion.div>
  )
})

GlassmorphismCard.displayName = 'GlassmorphismCard'

// Glassmorphism Button Component
const GlassmorphismButton = React.forwardRef(({
  className,
  children,
  variant = 'default',
  size = 'md',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const baseClasses = cn(
    'glass-button button-animated focus-ring',
    sizeClasses[size],
    className
  )

  return (
    <motion.button
      ref={ref}
      className={baseClasses}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
})

GlassmorphismButton.displayName = 'GlassmorphismButton'

// Glassmorphism Container Component
const GlassmorphismContainer = React.forwardRef(({
  className,
  children,
  gradient = false,
  animated = false,
  ...props
}, ref) => {
  const baseClasses = cn(
    'glass-card p-8',
    gradient && 'gradient-bg',
    animated && 'gradient-bg-animated',
    className
  )

  return (
    <motion.div
      ref={ref}
      className={baseClasses}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
})

GlassmorphismContainer.displayName = 'GlassmorphismContainer'

// Staggered Container Component
const StaggeredContainer = React.forwardRef(({
  className,
  children,
  staggerDelay = 0.1,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn('stagger-container', className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          className="stagger-item"
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.95 },
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
})

StaggeredContainer.displayName = 'StaggeredContainer'

export {
  GlassmorphismCard,
  GlassmorphismButton,
  GlassmorphismContainer,
  StaggeredContainer
} 