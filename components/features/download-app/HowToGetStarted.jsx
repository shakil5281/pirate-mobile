'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

const HowToGetStarted = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/features/how-to-get-started')
        if (!response.ok) {
          throw new Error('Failed to fetch how to get started data')
        }
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error fetching how to get started data:', error)
        // Fallback data
        setData({
          title: "How to Get Started",
          subtitle: "with eSIM in 3 Simple Steps",
          steps: [
            {
              id: 1,
              title: "Choose Your Destination",
              description: "Select your destination and get the best eSIM plan—fast, reliable internet with no roaming fees.",
              image: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Download-app/Frame%202608.png?updatedAt=1760402728394"
            },
            {
              id: 2,
              title: "Choose a Data Plan",
              description: "Browse our local, regional, or global eSIM plans. Pick the one that fits your travel destination and data needs.",
              image: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Download-app/Frame%202608694.svg?updatedAt=1760402136696"
            },
            {
              id: 3,
              title: "Scan the QR Code",
              description: "After purchase, you'll receive a QR code instantly. Just scan it with your phone's camera to install your eSIM profile.",
              image: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Download-app/Frame6.svg?updatedAt=1760402370983"
            }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white shadow-lg border-0 rounded-xl p-6 h-96 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!data) return null

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl 2xl:text-5xl font-semibold text-gray-900 mb-4">
            {data.title}{' '} <br />
            <span className="text-green-600">{data.subtitle}</span>
          </h2>
        </div>

        {/* Dynamic Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {data.steps.map((step) => (
            <Card key={step.id} className="bg-white  border-0 rounded-xl">
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <div className="w-full max-w-sm h-64 relative">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={400}
                      height={256}
                      className="object-contain w-full h-full"
                      priority={step.id <= 2}
                    />
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step Image */}

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowToGetStarted
