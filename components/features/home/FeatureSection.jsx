"use client"
import React, { useState } from 'react'
import { Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

export default function FeatureSection() {
  const [selectedPlan, setSelectedPlan] = useState(1)

  return (
    <section className="relative w-full md:bg-white py-16 px-2 bg-[#F6FFF8]">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-12 px-2">
          <h1 className='text-3xl 2xl:text-5xl lg:max-w-2xl 2xl:max-w-5xl mx-auto font-semibold text-center'>
            <span className='text-primary'>Pirate Mobile: Always Connected.</span> <span className='text-gray-400'> Instant eSIM, global reach, no roaming — simple, powerful mobile freedom.</span>
          </h1>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2">
          {/* Global Coverage Card */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Global Coverage</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Access networks in over 200 countries with our comprehensive eSIM solutions.
            </p>

            {/* Flag Icons */}
            <Image
              src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Partners/All%20Logos.png?updatedAt=1760182523382"
              alt="Global Coverage"
              width={400}
              height={400}
              className='w-full h-auto'
            />
          </div>

          {/* Flexible Plans Card */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Flexible Plans</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Choose from a variety of data plans tailored to your travel needs and budget.
            </p>

            {/* Plan Options */}
            <div className='w-full h-auto'>
              <Image
                src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Partners/Frame%202608691.png?updatedAt=1760182774867"
                alt="Flexible Plans"
                width={400}
                height={400}
                className='w-full h-auto'
              />
            </div>
          </div>

          {/* Instant Activation Card */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Instant Activation</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Download and activate your eSIM profile in just a few clicks, eliminating the need for physical SIMs.
            </p>

            {/* QR Code Section */}
            <div>
              <Image
                src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Partners/Content%201.png?updatedAt=1760182679701"
                alt="Instant Activation"
                width={400}
                height={400}
                className='w-full h-auto'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
