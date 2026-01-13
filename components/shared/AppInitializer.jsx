'use client'

import React, { useState, useEffect } from 'react'

/**
 * AppInitializer component that wraps the app and shows loading screen
 * Shows loading animation every time until the application is fully loaded
 */
const AppInitializer = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark as mounted to avoid hydration issues
    setIsMounted(true)
    
    // Simple timeout to show loader briefly
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Don't render anything until mounted (avoid hydration mismatch)
  if (!isMounted) {
    return null
  }

  // Show simple CSS loader while app is loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md mx-auto px-6">
          {/* Modern Logo/Icon Area */}
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-spin">
              <div className="w-full h-full rounded-full border-4 border-transparent border-t-primary animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>

            {/* Inner Spinner */}
            <div className="absolute inset-2 rounded-full border-2 border-primary/30">
              <div className="w-full h-full rounded-full border-2 border-transparent border-r-primary animate-spin" style={{ animationDuration: '2s' }} />
            </div>

            {/* Center Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>
    )
  }

  // Render children only when fully loaded
  return <>{children}</>
}

export default AppInitializer

