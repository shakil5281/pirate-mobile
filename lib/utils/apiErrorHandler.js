/**
 * API Error Handler Utilities
 * Provides comprehensive error handling for API requests with user-friendly messages
 */

// Error types for better categorization
export const API_ERROR_TYPES = {
  TIMEOUT: 'timeout',
  NETWORK: 'network',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
}

// User-friendly error messages
export const ERROR_MESSAGES = {
  [API_ERROR_TYPES.TIMEOUT]: {
    title: 'Request Taking Too Long',
    message: 'The server is taking longer than expected to respond. Please try again in a moment.',
    action: 'Retry'
  },
  [API_ERROR_TYPES.NETWORK]: {
    title: 'Connection Problem',
    message: 'Unable to connect to our servers. Please check your internet connection.',
    action: 'Check Connection'
  },
  [API_ERROR_TYPES.SERVER]: {
    title: 'Server Error',
    message: 'Our servers are experiencing issues. Please try again later.',
    action: 'Try Again'
  },
  [API_ERROR_TYPES.CLIENT]: {
    title: 'Request Error',
    message: 'There was an issue with your request. Please refresh the page.',
    action: 'Refresh Page'
  },
  [API_ERROR_TYPES.UNKNOWN]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    action: 'Try Again'
  }
}

/**
 * Categorize API error based on error details
 * @param {Error} error - The error object
 * @param {number} statusCode - HTTP status code (if available)
 * @returns {string} Error type
 */
export function categorizeError(error, statusCode = null) {
  // Check for timeout errors
  if (error.message?.includes('timeout') || error.message?.includes('Request timeout')) {
    return API_ERROR_TYPES.TIMEOUT
  }
  
  // Check for network errors
  if (error.message?.includes('fetch') || error.message?.includes('network') || !navigator.onLine) {
    return API_ERROR_TYPES.NETWORK
  }
  
  // Check status code
  if (statusCode) {
    if (statusCode >= 500) {
      return API_ERROR_TYPES.SERVER
    } else if (statusCode >= 400) {
      return API_ERROR_TYPES.CLIENT
    }
  }
  
  return API_ERROR_TYPES.UNKNOWN
}

/**
 * Get user-friendly error information
 * @param {Error} error - The error object
 * @param {number} statusCode - HTTP status code (if available)
 * @returns {Object} User-friendly error info
 */
export function getErrorInfo(error, statusCode = null) {
  const errorType = categorizeError(error, statusCode)
  const baseInfo = ERROR_MESSAGES[errorType]
  
  return {
    type: errorType,
    title: baseInfo.title,
    message: baseInfo.message,
    action: baseInfo.action,
    originalError: error,
    statusCode,
    timestamp: new Date().toISOString()
  }
}

/**
 * Enhanced fetch with better error handling
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise} Enhanced fetch promise
 */
export async function enhancedFetch(url, options = {}) {
  const { timeout = 10000, retries = 2, ...fetchOptions } = options
  
  let lastError = null
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return response
    } catch (error) {
      lastError = error
      
      // Don't retry on client errors (4xx)
      if (error.message?.includes('HTTP 4')) {
        break
      }
      
      // Don't retry on abort (timeout)
      if (error.name === 'AbortError') {
        break
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  // If we get here, all retries failed
  const errorInfo = getErrorInfo(lastError)
  throw new Error(`${errorInfo.title}: ${errorInfo.message}`)
}

/**
 * Create a timeout promise
 * @param {number} ms - Timeout in milliseconds
 * @param {string} message - Timeout message
 * @returns {Promise} Promise that rejects after timeout
 */
export function createTimeoutPromise(ms, message = 'Request timeout') {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms)
  })
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Retry promise
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        break
      }
      
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

/**
 * Log error with context
 * @param {Error} error - The error to log
 * @param {Object} context - Additional context
 */
export function logError(error, context = {}) {
  const errorInfo = getErrorInfo(error, context.statusCode)
  
  console.error('API Error:', {
    type: errorInfo.type,
    message: error.message,
    url: context.url,
    statusCode: context.statusCode,
    timestamp: errorInfo.timestamp,
    context
  })
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: context })
  }
}

const apiErrorHandler = {
  categorizeError,
  getErrorInfo,
  enhancedFetch,
  createTimeoutPromise,
  retryWithBackoff,
  logError,
  API_ERROR_TYPES,
  ERROR_MESSAGES
}

export default apiErrorHandler
