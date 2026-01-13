'use client'

import React from 'react'
import { cn } from '@/lib/utils'

const ImageErrorBoundary = ({ children, fallback, className }) => {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleError = () => {
      setHasError(true)
    }

    // Listen for image load errors
    document.addEventListener('error', handleError, true)
    return () => document.removeEventListener('error', handleError, true)
  }, [])

  if (hasError) {
    return fallback || (
      <div className={cn(
        'flex items-center justify-center bg-gray-100 text-gray-400',
        'w-full h-48 rounded-lg',
        className
      )}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-gray-500 text-xl">📷</span>
          </div>
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    )
  }

  return children
}

export default ImageErrorBoundary
