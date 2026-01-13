"use client"

import React from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function AboutMissionSection() {
  return (
    <section className="relative w-full lg:pt-24">
      {/* Light green background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-semibold text-black leading-tight">
                <span className="text-black">Driven by Innovation,</span>
                <br />
                <span className="text-green-600">Connected by Purpose</span>
              </h2>

              <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
                Empowering global travelers with seamless eSIM connectivity through a mission of simplicity, a vision of a borderless future.
              </p>
            </div>

            {/* Human Image */}
            <div className="relative">
              <Image
                src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/about/aboutbg.png?updatedAt=1760446028126"
                alt="Mission"
                width={400}
                height={400}
              />
            </div>
          </div>

          {/* Right Column - Three Cards */}
          <div className="space-y-6">

            {/* Card 1: What We Do */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-3">What We Do</h3>
                  <p className="text-gray-700 leading-relaxed">
                    From solo travelers to global businesses, our eSIM service lets you switch networks seamlessly—no physical SIMs, no hassle. Whether you&apos;re exploring the world or scaling your enterprise, Pirate Mobile is your trusted connectivity partner.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Our Story */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-3">Our Story</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Founded by seasoned telco experts, we&apos;re on a mission to deliver flexible, affordable eSIM connectivity for global travelers—powered by smart tech and a customer-first mindset.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Our Vision */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-3">Our Vision</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We envision a world where staying connected is effortless and affordable, regardless of where you are. Our goal is to empower travelers and businesses to communicate without boundaries or limitations.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
