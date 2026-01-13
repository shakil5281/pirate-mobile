'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook to manage first-time app loading state
 * @param {boolean} force - Force show the loader even if already shown before
 * @returns {Object} - { isFirstTime, markAsLoaded }
 */
export const useFirstTimeLoad = (force = false) => {
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if this is the first time loading
      const hasLoadedBefore = localStorage.getItem('firstTimeLoadComplete')
      
      if (force) {
        // Force show loader
        setIsFirstTime(true)
      } else {
        // Check if it's the first time
        setIsFirstTime(!hasLoadedBefore)
      }
      
      setIsChecking(false)
    }
  }, [force])

  const markAsLoaded = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('firstTimeLoadComplete', 'true')
      setIsFirstTime(false)
    }
  }

  const resetFirstTimeLoad = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('firstTimeLoadComplete')
      setIsFirstTime(true)
    }
  }

  return {
    isFirstTime,
    isChecking,
    markAsLoaded,
    resetFirstTimeLoad,
  }
}

export default useFirstTimeLoad

