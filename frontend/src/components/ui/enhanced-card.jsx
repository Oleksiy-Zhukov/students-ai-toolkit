import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { cardVariants, animations, shadows } from '@/lib/design-system.js'

const EnhancedCard = React.forwardRef(({
  className,
  variant = 'default',
  children,
  onClick,
  disabled = false,
  hover = true,
  animation = 'scaleIn',
  delay = 0,
  ...props
}, ref) => {
  const cardClasses = cn(
    'relative overflow-hidden rounded-lg border transition-all duration-300',
    cardVariants[variant],
    hover && !disabled && 'hover:shadow-lg hover:-translate-y-1',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  const animationProps = animations[animation] || animations.scaleIn

  const MotionCard = motion.div

  return (
    <MotionCard
      ref={ref}
      className={cardClasses}
      onClick={disabled ? undefined : onClick}
      initial={animationProps.initial}
      animate={animationProps.animate}
      exit={animationProps.exit}
      transition={{
        ...animationProps.transition,
        delay,
      }}
      whileHover={hover && !disabled ? {
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick && !disabled ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
      {...props}
    >
      {/* Gradient overlay for interactive cards */}
      {variant === 'interactive' && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Focus ring for accessibility */}
      {onClick && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-primary/20 ring-offset-2 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
      )}
    </MotionCard>
  )
})

EnhancedCard.displayName = 'EnhancedCard'

// Card sub-components
const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  >
    {children}
  </div>
))

CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
))

CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  >
    {children}
  </p>
))

CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
))

CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  >
    {children}
  </div>
))

CardFooter.displayName = 'CardFooter'

export {
  EnhancedCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} 