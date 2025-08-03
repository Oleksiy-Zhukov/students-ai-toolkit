/**
 * Design System Configuration
 * Centralized design tokens and component variants for Student AI Toolkit
 */

export const colors = {
  // Primary brand colors
  primary: {
    50: 'oklch(0.98 0.02 240)',
    100: 'oklch(0.95 0.03 240)',
    200: 'oklch(0.9 0.05 240)',
    300: 'oklch(0.8 0.08 240)',
    400: 'oklch(0.6 0.12 240)',
    500: 'oklch(0.4 0.15 240)',
    600: 'oklch(0.35 0.18 240)',
    700: 'oklch(0.3 0.2 240)',
    800: 'oklch(0.25 0.22 240)',
    900: 'oklch(0.2 0.25 240)',
  },
  
  // Semantic colors
  success: {
    50: 'oklch(0.95 0.02 140)',
    100: 'oklch(0.9 0.03 140)',
    500: 'oklch(0.6 0.15 140)',
    600: 'oklch(0.5 0.18 140)',
  },
  
  warning: {
    50: 'oklch(0.98 0.02 60)',
    100: 'oklch(0.95 0.03 60)',
    500: 'oklch(0.7 0.15 60)',
    600: 'oklch(0.6 0.18 60)',
  },
  
  error: {
    50: 'oklch(0.98 0.02 27)',
    100: 'oklch(0.95 0.03 27)',
    500: 'oklch(0.6 0.15 27)',
    600: 'oklch(0.5 0.18 27)',
  },
  
  // Action-specific colors
  actions: {
    summarize: {
      light: 'oklch(0.95 0.02 240)',
      main: 'oklch(0.4 0.15 240)',
      dark: 'oklch(0.3 0.2 240)',
    },
    questions: {
      light: 'oklch(0.95 0.02 140)',
      main: 'oklch(0.6 0.15 140)',
      dark: 'oklch(0.5 0.18 140)',
    },
    study: {
      light: 'oklch(0.95 0.02 280)',
      main: 'oklch(0.6 0.15 280)',
      dark: 'oklch(0.5 0.18 280)',
    },
    flashcards: {
      light: 'oklch(0.98 0.02 30)',
      main: 'oklch(0.7 0.15 30)',
      dark: 'oklch(0.6 0.18 30)',
    },
  },
}

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
}

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
}

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Roboto Mono', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
}

export const shadows = {
  sm: '0 1px 2px 0 oklch(0 0 0 / 0.05)',
  md: '0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -1px oklch(0 0 0 / 0.06)',
  lg: '0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -2px oklch(0 0 0 / 0.05)',
  xl: '0 20px 25px -5px oklch(0 0 0 / 0.1), 0 10px 10px -5px oklch(0 0 0 / 0.04)',
  '2xl': '0 25px 50px -12px oklch(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 oklch(0 0 0 / 0.06)',
}

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
  bounce: '250ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Component variants
export const buttonVariants = {
  primary: {
    base: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    disabled: 'bg-primary-300 text-white cursor-not-allowed',
  },
  secondary: {
    base: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    disabled: 'bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed',
  },
  outline: {
    base: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    disabled: 'border-input/50 bg-background/50 text-muted-foreground cursor-not-allowed',
  },
  ghost: {
    base: 'hover:bg-accent hover:text-accent-foreground',
    disabled: 'text-muted-foreground cursor-not-allowed',
  },
}

export const cardVariants = {
  default: 'bg-card text-card-foreground shadow-sm',
  elevated: 'bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow',
  interactive: 'bg-card text-card-foreground shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer',
}

export const inputVariants = {
  default: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  error: 'flex h-10 w-full rounded-md border border-destructive bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2',
}

// Animation presets
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
}

// Utility functions
export const getActionColor = (actionId) => {
  return colors.actions[actionId] || colors.actions.summarize
}

export const getActionGradient = (actionId) => {
  const color = getActionColor(actionId)
  return `linear-gradient(135deg, ${color.light} 0%, ${color.main} 50%, ${color.dark} 100%)`
}

export const createStaggerAnimation = (delay = 0.1) => ({
  container: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { staggerChildren: delay },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
}) 