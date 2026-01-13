'use client'

import React, { memo, useMemo } from 'react'
import { cn } from '@/lib/utils'

// Icon registry for tree shaking
const iconRegistry = {
  // Common icons - loaded immediately
  common: {
    Home: () => import('lucide-react').then(m => m.Home),
    Search: () => import('lucide-react').then(m => m.Search),
    Menu: () => import('lucide-react').then(m => m.Menu),
    X: () => import('lucide-react').then(m => m.X),
    ChevronDown: () => import('lucide-react').then(m => m.ChevronDown),
    ChevronUp: () => import('lucide-react').then(m => m.ChevronUp),
    Star: () => import('lucide-react').then(m => m.Star),
    Check: () => import('lucide-react').then(m => m.Check),
  },
  // Feature icons - lazy loaded
  features: {
    Globe2: () => import('lucide-react').then(m => m.Globe2),
    ShieldCheck: () => import('lucide-react').then(m => m.ShieldCheck),
    Headphones: () => import('lucide-react').then(m => m.Headphones),
    MapPin: () => import('lucide-react').then(m => m.MapPin),
    Smartphone: () => import('lucide-react').then(m => m.Smartphone),
    Paperclip: () => import('lucide-react').then(m => m.Paperclip),
  },
  // UI icons - lazy loaded
  ui: {
    Plus: () => import('lucide-react').then(m => m.Plus),
    Minus: () => import('lucide-react').then(m => m.Minus),
    Edit: () => import('lucide-react').then(m => m.Edit),
    Trash: () => import('lucide-react').then(m => m.Trash),
    Settings: () => import('lucide-react').then(m => m.Settings),
    User: () => import('lucide-react').then(m => m.User),
  }
}

// Memoized icon component
const OptimizedIcon = memo(({ 
  name, 
  category = 'common',
  size = 24, 
  className,
  ...props 
}) => {
  const [IconComponent, setIconComponent] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  const iconKey = useMemo(() => {
    const registry = iconRegistry[category] || iconRegistry.common
    return registry?.[name] || iconRegistry.common?.[name] || null
  }, [name, category])

  React.useEffect(() => {
    if (!iconKey) {
      setError(true)
      setLoading(false)
      return
    }

    if (typeof iconKey === 'function') {
      iconKey()
        .then(module => {
          const Icon = module.default || module[name]
          if (Icon) {
            setIconComponent(() => Icon)
          } else {
            setError(true)
          }
          setLoading(false)
        })
        .catch(err => {
          console.warn(`Failed to load icon: ${name}`, err)
          setError(true)
          setLoading(false)
        })
    } else {
      setError(true)
      setLoading(false)
    }
  }, [iconKey, name])

  if (loading) {
    return (
      <div 
        className={cn('animate-pulse bg-gray-200 rounded', className)}
        style={{ width: size, height: size }}
        {...props}
      />
    )
  }

  if (error || !IconComponent) {
    return (
      <div 
        className={cn('bg-gray-100 rounded flex items-center justify-center', className)}
        style={{ width: size, height: size }}
        title={`Icon ${name} not found`}
        {...props}
      >
        <span className="text-xs text-gray-400">?</span>
      </div>
    )
  }

  return (
    <IconComponent 
      size={size}
      className={cn('flex-shrink-0', className)}
      {...props}
    />
  )
})

OptimizedIcon.displayName = 'OptimizedIcon'

// Hook for preloading icons
export const useIconPreloader = (iconNames = [], category = 'common') => {
  React.useEffect(() => {
    const registry = iconRegistry[category] || iconRegistry.common
    
    iconNames.forEach(name => {
      const iconLoader = registry[name]
      if (iconLoader) {
        iconLoader().catch(() => {
          // Silently fail - icon will be lazy loaded when needed
        })
      }
    })
  }, [iconNames, category])
}

// Preload common icons
export const preloadCommonIcons = () => {
  const commonIcons = ['Home', 'Search', 'Menu', 'Star', 'Check']
  commonIcons.forEach(name => {
    iconRegistry.common[name]?.().catch(() => {})
  })
}

export default OptimizedIcon
