'use client'

import React, { Suspense, lazy, ComponentType } from 'react'
import { cn } from '@/lib/utils'

// Loading skeleton component
const LoadingSkeleton = ({ className, ...props }) => (
  <div 
    className={cn(
      'animate-pulse bg-gray-200 rounded-md',
      className
    )}
    {...props}
  />
)
LoadingSkeleton.displayName = 'LoadingSkeleton'

// Generic lazy wrapper with error boundary
const LazyWrapper = ({ 
  children, 
  fallback,
  errorFallback,
  className 
}) => {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleError = (error) => {
      console.error('LazyWrapper error:', error)
      setHasError(true)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return errorFallback || (
      <div className={cn('p-4 text-center text-gray-500', className)}>
        Failed to load component
      </div>
    )
  }

  return (
    <Suspense fallback={fallback || <LoadingSkeleton className={className} />}>
      {children}
    </Suspense>
  )
}
LazyWrapper.displayName = 'LazyWrapper'

// Higher-order component for lazy loading
// NOTE: This should only be used in client components
export const withLazy = (importFunc, options = {}) => {
  const LazyComponent = lazy(importFunc)
  
  const WithLazyComponent = (props) => (
    <LazyWrapper 
      fallback={options.fallback}
      errorFallback={options.errorFallback}
      className={options.className}
    >
      <LazyComponent {...props} />
    </LazyWrapper>
  )
  
  WithLazyComponent.displayName = 'WithLazyComponent'
  
  return WithLazyComponent
}

// Error boundary component for better error handling
class LazyErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('LazyErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center text-gray-500">
          Failed to load component
        </div>
      )
    }

    return this.props.children
  }
}

// Note: Pre-configured lazy components removed to avoid SSR issues with React 19
// Use Next.js dynamic() import instead for lazy loading components

// Enhanced lazy wrapper with error boundary
export const SafeLazyWrapper = ({ children, fallback, errorFallback, className }) => (
  <LazyErrorBoundary fallback={errorFallback}>
    <LazyWrapper 
      fallback={fallback}
      errorFallback={errorFallback}
      className={className}
    >
      {children}
    </LazyWrapper>
  </LazyErrorBoundary>
)
SafeLazyWrapper.displayName = 'SafeLazyWrapper'

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [hasIntersected, setHasIntersected] = React.useState(false)
  const ref = React.useRef(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasIntersected, options])

  return [ref, isIntersecting, hasIntersected]
}

export default LazyWrapper
