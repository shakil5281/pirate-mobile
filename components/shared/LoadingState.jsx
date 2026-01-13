'use client'

import React from 'react'
import { Loader2, Clock, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'

const LoadingState = ({
  message = 'Loading...',
  subMessage = 'Please wait while we fetch your data',
  showProgress = false,
  progress = 0,
  timeout = 5000,
  onTimeout,
  className,
  size = 'default'
}) => {
  const [showTimeoutWarning, setShowTimeoutWarning] = React.useState(false)
  const [elapsedTime, setElapsedTime] = React.useState(0)

  React.useEffect(() => {
    const startTime = Date.now()
    
    // Show timeout warning after 3 seconds
    const warningTimer = setTimeout(() => {
      setShowTimeoutWarning(true)
    }, 3000)

    // Trigger timeout callback after specified timeout
    const timeoutTimer = setTimeout(() => {
      if (onTimeout) {
        onTimeout()
      }
    }, timeout)

    // Update elapsed time every second
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => {
      clearTimeout(warningTimer)
      clearTimeout(timeoutTimer)
      clearInterval(interval)
    }
  }, [timeout, onTimeout])

  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8'
  }

  const textSizeClasses = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg'
  }

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      {/* Loading Spinner */}
      <div className="relative mb-4">
        <Loader2 className={cn(
          'animate-spin text-blue-500',
          sizeClasses[size]
        )} />
        
        {/* Progress Ring (if showProgress is true) */}
        {showProgress && (
          <svg
            className={cn(
              'absolute inset-0 transform -rotate-90',
              sizeClasses[size]
            )}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 10}`}
              strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
              className="text-blue-500 transition-all duration-300"
            />
          </svg>
        )}
      </div>

      {/* Main Message */}
      <h3 className={cn(
        'font-semibold text-gray-900 mb-2',
        textSizeClasses[size]
      )}>
        {message}
      </h3>

      {/* Sub Message */}
      <p className="text-sm text-gray-600 mb-4">
        {subMessage}
      </p>

      {/* Timeout Warning */}
      {showTimeoutWarning && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            This is taking longer than usual... ({elapsedTime}s)
          </span>
        </div>
      )}

      {/* Network Status */}
      {typeof navigator !== 'undefined' && !navigator.onLine && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-2">
          <Wifi className="w-4 h-4" />
          <span className="text-sm">
            No internet connection
          </span>
        </div>
      )}

      {/* Progress Bar (if showProgress is true) */}
      {showProgress && (
        <div className="w-full max-w-xs mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Loading</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
LoadingState.displayName = 'LoadingState'

// Specialized loading states
export const CountriesLoadingState = () => (
  <LoadingState
    message="Loading Countries"
    subMessage="Fetching available destinations..."
    timeout={8000}
  />
)
CountriesLoadingState.displayName = 'CountriesLoadingState'

export const BundlesLoadingState = () => (
  <LoadingState
    message="Loading Data Plans"
    subMessage="Getting the best rates for your destination..."
    timeout={10000}
  />
)
BundlesLoadingState.displayName = 'BundlesLoadingState'

export const ImagesLoadingState = () => (
  <LoadingState
    message="Loading Images"
    subMessage="Optimizing images for better performance..."
    showProgress={true}
    progress={0}
    timeout={15000}
  />
)
ImagesLoadingState.displayName = 'ImagesLoadingState'

export const NetworkLoadingState = () => (
  <LoadingState
    message="Checking Network"
    subMessage="Verifying your connection..."
    timeout={5000}
  />
)
NetworkLoadingState.displayName = 'NetworkLoadingState'

export default LoadingState
