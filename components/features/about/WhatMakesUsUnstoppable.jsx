'use client'
import React, { useState, useEffect } from 'react'
import FeatureCard from '@/components/card/FeatureCard'

export default function WhatMakesUsUnstoppable() {
  const [featuresData, setFeaturesData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturesData = async () => {
      try {
        const response = await fetch('/api/features/what-makes-unstoppable')
        if (!response.ok) {
          throw new Error('Failed to fetch features data')
        }
        const data = await response.json()
        setFeaturesData(data)
      } catch (error) {
        console.error('Error fetching features data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturesData()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded w-80 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 h-80 animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!featuresData) return null


  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
            <span className="text-gray-800">What Makes</span>
            <span className="text-green-600"> Pirate Mobile Unstoppable</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            {featuresData.subtitle}
          </p>
        </div>

        {/* Features Grid - 4 cards in a single row using FeatureCard component */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresData.features.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                imageAlt={feature.title}
                className="bg-gray-50"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
