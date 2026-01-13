'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getErrorInfo, logError } from '@/lib/utils/apiErrorHandler'

/**
 * Simple fetch wrapper without caching
 */
async function simpleFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Custom hook for handling API requests with loading, error, and retry states
 * @param {string} url - API endpoint URL
 * @param {Object} options - Request options
 * @returns {Object} Request state and controls
 */
export const useApiRequest = (url, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    autoFetch = true,
    retryOnError = true,
    maxRetries = 2
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const timeoutRef = useRef(null)
  const retryCountRef = useRef(0)
  const executeRequestRef = useRef(null)

  // Keep ref in sync with state
  useEffect(() => {
    retryCountRef.current = retryCount
  }, [retryCount])

  const executeRequest = useCallback(async (isRetry = false) => {
    if (!url) return

    // Clear any pending retry timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await simpleFetch(url, {
        method,
        body,
        headers,
      })

      setData(response)
      setRetryCount(0)
      retryCountRef.current = 0
      return response
    } catch (err) {
      const errorInfo = getErrorInfo(err)
      
      // Get current retry count for logging using ref
      const currentRetryCount = retryCountRef.current
      
      // Log error with context
      logError(err, {
        url,
        method,
        retryCount: currentRetryCount,
        isRetry
      })

      setError(errorInfo)

      // Auto-retry on certain error types
      if (retryOnError && currentRetryCount < maxRetries && (
        errorInfo.type === 'timeout' || 
        errorInfo.type === 'network' || 
        errorInfo.type === 'server'
      )) {
        const delay = Math.pow(2, currentRetryCount) * 1000 // Exponential backoff
        timeoutRef.current = setTimeout(() => {
          setRetryCount(prev => {
            const nextCount = prev + 1
            retryCountRef.current = nextCount
            // Use ref to call executeRequest to avoid circular dependency
            if (executeRequestRef.current) {
              executeRequestRef.current(true)
            }
            return nextCount
          })
        }, delay)
        return
      }

      throw err
    } finally {
      setLoading(false)
    }
  }, [url, method, body, headers, retryOnError, maxRetries])

  // Store the latest executeRequest in ref
  useEffect(() => {
    executeRequestRef.current = executeRequest
  }, [executeRequest])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch && url) {
      executeRequest()
    }
  }, [autoFetch, url, executeRequest])

  const retry = useCallback(() => {
    setRetryCount(0)
    setError(null)
    executeRequest(true)
  }, [executeRequest])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setRetryCount(0)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    retryCount,
    retry,
    reset,
    refetch: executeRequest
  }
}

/**
 * Hook for fetching countries data
 */
export const useCountries = () => {
  return useApiRequest('/api/countries')
}

/**
 * Hook for fetching country bundles
 */
export const useCountryBundles = (country, bundleGroup = 'Standard Fixed') => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
  const countrySlug = typeof country === 'string' ? country.toLowerCase() : country
  const url = `${apiBaseUrl}/e-sim/bundle?country=${encodeURIComponent(countrySlug)}&bundleGroup=${encodeURIComponent(bundleGroup)}`
  
  return useApiRequest(url, {
    autoFetch: !!country
  })
}

/**
 * Hook for fetching country content
 */
export const useCountryContent = (slug) => {
  return useApiRequest(`/api/country-content/${slug}`, {
    autoFetch: !!slug
  })
}

/**
 * Hook for batch API requests
 */
export const useBatchRequests = (requests) => {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const executeBatch = useCallback(async () => {
    if (!requests || requests.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const promises = requests.map(async (request) => {
        try {
          const data = await simpleFetch(request.url, request.options)
          return { key: request.key, data, error: null }
        } catch (err) {
          return { key: request.key, data: null, error: getErrorInfo(err) }
        }
      })

      const batchResults = await Promise.all(promises)
      const resultsMap = batchResults.reduce((acc, result) => {
        acc[result.key] = result
        return acc
      }, {})

      setResults(resultsMap)
    } catch (err) {
      setError(getErrorInfo(err))
    } finally {
      setLoading(false)
    }
  }, [requests])

  useEffect(() => {
    if (requests && requests.length > 0) {
      executeBatch()
    }
  }, [executeBatch, requests])

  return {
    results,
    loading,
    error,
    refetch: executeBatch
  }
}

export default useApiRequest
