'use client'
import React from 'react'
import FeatureCard from '@/components/card/FeatureCard'
import featuresData from '@/data/features/keyBenefitsFeatures.json'

export default function KeyBenefitsFeatures() {

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
            <span className="text-gray-800">Key Benefits</span>
            <span className="text-green-600"> & Features</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            {featuresData.subtitle}
          </p>
        </div>

        {/* Features Grid - Two Rows Centered */}
        <div className="max-w-7xl mx-auto space-y-6">
          {/* First Row - 3 Items */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
              {featuresData.features.slice(0, 3).map((feature) => (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                  imageAlt={feature.title}
                  className="h-full"
                />
              ))}
            </div>
          </div>

          {/* Second Row - 2 Items Centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              {featuresData.features.slice(3, 5).map((feature) => (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                  imageAlt={feature.title}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
