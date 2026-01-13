'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Use Next.js dynamic imports instead of React.lazy to avoid webpack issues
const EsimVideo = dynamic(() => import('@/components/shared/EsimVideo'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false
})

const Testimonials = dynamic(() => import('@/components/shared/Testimonials'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false
})

const Faq = dynamic(() => import('@/components/shared/Faq'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false
})

export default function LazyHomeContent() {
  return (
    <>
      {/* Lazy load non-critical content using Next.js dynamic imports */}
      <EsimVideo />
      <Testimonials />
    </>
  )
}
