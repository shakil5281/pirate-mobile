"use client"

import { useEffect } from 'react'

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Store original console.error
    const originalConsoleError = console.error
    const suppressedSet = new Set()
    let warningCount = 0
    const MAX_WARNINGS = 1
    
      // Override console.error to filter out known issues
      console.error = (...args) => {
        const errorString = args.join(' ')
        
        // Check if error is an empty object or Google Pay config error
        const firstArg = args[0]
        const isGooglePayError = (
          (typeof firstArg === 'string' && (
            firstArg.includes('googlepay') || 
            firstArg.includes('Google Pay') ||
            firstArg.includes('googlepay_config_error')
          )) ||
          (firstArg && typeof firstArg === 'object' && (
            firstArg.toString() === '[object Object]' && 
            Object.keys(firstArg).length === 0 &&
            errorString.includes('googlepay')
          ))
        )
        
        if (isGooglePayError) {
          // Silently suppress Google Pay configuration errors (expected when unavailable)
          return
        }
        
        // Filter out React internal errors and expected payment errors
        const reactInternalPatterns = [
          "Cannot read properties of undefined (reading 'call')",
          "Cannot read properties of null (reading 'useRef')",
          "Cannot read properties of null (reading 'useState')",
          "Cannot read properties of null (reading 'useEffect')",
          "Cannot read property 'call' of undefined",
          "Cannot read property 'useRef' of null",
          "reading 'call'",
          "reading 'useRef'",
          "Minified React error",
          "Uncaught TypeError: Cannot read properties of undefined (reading 'call')",
          "Objects are not valid as a React child",
          "object with keys",
          "onUpdated",
          "googlepay_config_error",
          "Google Pay configuration",
          "PayPal Google Pay SDK not available"
        ]
        
        const shouldFilter = reactInternalPatterns.some(pattern => 
          errorString.includes(pattern)
        )
        
        if (shouldFilter) {
          const errorHash = errorString.substring(0, 30)
          if (!suppressedSet.has(errorHash) && warningCount < MAX_WARNINGS) {
            suppressedSet.add(errorHash)
            warningCount++
            // Silently suppress - no console output
          }
          return
        }
        
        // Call original console.error for other errors
        originalConsoleError.apply(console, args)
      }
    
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      const error = event.reason
      
      // Check if it's a browser extension error
      const extensionErrors = [
        'onUpdated',
        'chrome-extension',
        'moz-extension',
        'safari-extension',
        'extensions/',
        'browser-extension'
      ]
      
      const isExtensionError = error && extensionErrors.some(pattern => {
        if (typeof error === 'string') return error.includes(pattern)
        if (error.message) return error.message.includes(pattern)
        if (error.stack) return error.stack.includes(pattern)
        return false
      })
      
      if (isExtensionError) {
        console.warn('Ignoring browser extension error:', error)
        event.preventDefault()
        return
      }
      
      // Check for RSC payload errors (React Server Components)
      if (error && error.message && error.message.includes('RSC payload')) {
        console.warn('RSC payload error detected - this may be due to React version mismatch or development/production build mismatch')
        // Don't prevent default for RSC errors as they might be important
        return
      }
      
      // Check for server rendering errors (common in development)
      if (error && error.message && (
        error.message.includes('server rendering errored') ||
        error.message.includes('Switched to client rendering')
      )) {
        console.warn('Server rendering error - switching to client rendering:', error.message)
        event.preventDefault()
        return
      }
      
      // Check for service worker errors and payment configuration errors that can be ignored
      const ignorableErrors = [
        'Failed to register a ServiceWorker',
        'ServiceWorker script',
        'Load failed',
        'googlepay_config_error',
        'Google Pay configuration',
        'PayPal Google Pay SDK not available'
      ]
      
      const isIgnorableError = error && ignorableErrors.some(pattern => {
        if (typeof error === 'string') return error.includes(pattern)
        if (error.message) return error.message.includes(pattern)
        return false
      })
      
      if (isIgnorableError) {
        // Silently ignore payment configuration errors (expected when Google Pay isn't available)
        if (error && (error.message?.includes('googlepay') || error.message?.includes('Google Pay'))) {
          return // Don't log or prevent default - just ignore silently
        }
        console.warn('Ignoring service worker error:', error)
        event.preventDefault()
        return
      }
      
      // Check for React internal errors (often from lazy loading or hydration)
      const reactInternalErrors = [
        "Cannot read properties of undefined (reading 'call')",
        "Cannot read properties of null (reading 'useRef')",
        "Cannot read properties of null (reading 'useState')",
        "Cannot read properties of null (reading 'useEffect')",
        "Cannot read property 'call' of undefined",
        "Cannot read property 'useRef' of null",
        "reading 'call'",
        "reading 'useRef'",
        "Minified React error"
      ]
      
      const isReactInternalError = error && reactInternalErrors.some(pattern => {
        if (typeof error === 'string') return error.includes(pattern)
        if (error.message) return error.message.includes(pattern)
        return false
      })
      
      if (isReactInternalError) {
        console.warn('React internal error (likely hydration or lazy loading issue):', error)
        event.preventDefault()
        return
      }
      
      // Log other errors for debugging
      console.error('Unhandled promise rejection:', error)
      
      // For other errors, you might want to send to error reporting service
      // reportError(error)
    }

    // Handle general errors
    const handleError = (event) => {
      const error = event.error
      
      // Skip if error is undefined or null
      if (!error && !event.message) {
        // Silently ignore undefined errors
        event.preventDefault?.()
        return
      }
      
      // Check if error is from a browser extension
      const extensionErrors = [
        'onUpdated',
        'chrome-extension',
        'moz-extension',
        'safari-extension',
        'extensions/',
        'browser-extension'
      ]
      
      // Check error source
      if (event.filename) {
        const isExtensionFile = extensionErrors.some(pattern => 
          event.filename.includes(pattern)
        )
        
        if (isExtensionFile) {
          console.warn('Ignoring browser extension error from:', event.filename)
          event.preventDefault()
          return
        }
      }
      
      const isExtensionError = error && extensionErrors.some(pattern => {
        if (typeof error === 'string') return error.includes(pattern)
        if (error.message) return error.message.includes(pattern)
        if (error.stack) return error.stack.includes(pattern)
        return false
      })
      
      if (isExtensionError) {
        console.warn('Ignoring browser extension error:', error)
        event.preventDefault()
        return
      }
      
      // Check for RSC payload errors
      if (error && error.message && error.message.includes('RSC payload')) {
        console.warn('RSC payload error detected - this may be due to React version mismatch or development/production build mismatch')
        return
      }
      
      // Check for server rendering errors (common in development)
      if (error && error.message && (
        error.message.includes('server rendering errored') ||
        error.message.includes('Switched to client rendering')
      )) {
        console.warn('Server rendering error - switching to client rendering:', error.message)
        event.preventDefault()
        return
      }
      
      // Check for service worker errors and payment configuration errors that can be ignored
      const ignorableErrors = [
        'Failed to register a ServiceWorker',
        'ServiceWorker script',
        'Load failed',
        'googlepay_config_error',
        'Google Pay configuration',
        'PayPal Google Pay SDK not available'
      ]
      
      const isIgnorableError = error && ignorableErrors.some(pattern => {
        if (typeof error === 'string') return error.includes(pattern)
        if (error.message) return error.message.includes(pattern)
        return false
      })
      
      if (isIgnorableError) {
        // Silently ignore payment configuration errors (expected when Google Pay isn't available)
        if (error && (error.message?.includes('googlepay') || error.message?.includes('Google Pay'))) {
          return // Don't log or prevent default - just ignore silently
        }
        console.warn('Ignoring service worker error:', error)
        event.preventDefault()
        return
      }
      
      // Check for React internal errors (often from lazy loading or hydration)
      const reactInternalErrors = [
        "Cannot read properties of undefined (reading 'call')",
        "Cannot read properties of null (reading 'useRef')",
        "Cannot read properties of null (reading 'useState')",
        "Cannot read properties of null (reading 'useEffect')",
        "Cannot read property 'call' of undefined",
        "Cannot read property 'useRef' of null",
        "reading 'call'",
        "reading 'useRef'",
        "Minified React error"
      ]
      
      const isReactInternalError = error && reactInternalErrors.some(pattern => {
        if (typeof error === 'string') return error.includes(pattern)
        if (error.message) return error.message.includes(pattern)
        return false
      })
      
      if (isReactInternalError) {
        console.warn('React internal error (likely hydration or lazy loading issue):', error)
        event.preventDefault()
        return
      }
      
      // Log other errors for debugging
      console.error('Global error:', error)
      
      // For other errors, you might want to send to error reporting service
      // reportError(error)
    }

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError, true) // Use capture phase

    // Cleanup
    return () => {
      console.error = originalConsoleError
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError, true)
    }
  }, [])

  return null // This component doesn't render anything
}
