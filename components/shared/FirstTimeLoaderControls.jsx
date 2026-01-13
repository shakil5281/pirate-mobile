'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw, Info } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Development component to control the first-time loader
 * Add this to any page to test the first-time loading experience
 */
const FirstTimeLoaderControls = () => {
  const resetFirstTimeLoad = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('firstTimeLoadComplete')
      toast.success('First-time load reset! Refresh the page to see the loader again.')
    }
  }

  const checkStatus = () => {
    if (typeof window !== 'undefined') {
      const hasLoaded = localStorage.getItem('firstTimeLoadComplete')
      if (hasLoaded) {
        toast.info('First-time loader has been shown before')
      } else {
        toast.info('First-time loader will show on next page load')
      }
    }
  }
}

export default FirstTimeLoaderControls

