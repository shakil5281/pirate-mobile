"use client"

import React from 'react'
import Image from 'next/image'

export default function AboutTestimonialSection() {
  return (
    <section className="relative w-full py-16 lg:py-24">
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4">
        <div className="">
          {/* Testimonial Card */}
          <div className="bg-[#343537] rounded-2xl p-6 sm:p-8 lg:p-10 w-full shadow-xl">
            
            {/* Top Section - Customer Testimonial */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 border-b border-white/10 text-center md:text-left">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-300">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="Customer testimonial"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Testimonial Content */}
              <div className="flex-1 max-w-[38rem]">
                <blockquote className="text-white text-lg sm:text-xl lg:text-2xl leading-relaxed mb-3 sm:mb-4">
                  &quot;Great Service 👍👍 Never had an issue with the service during time for travel. It was smooth coverage. Thanks&quot;
                </blockquote>
                <div className="text-white text-sm sm:text-base">
                  <span className="font-medium">M. M. kamal</span>
                  <span className="text-gray-300">, From Bangladesh</span>
                </div>
              </div>
            </div>

            {/* Bottom Section - Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              
              {/* Stat 1: Happy Users */}
              <div className="text-center">
                <div className="text-white text-4xl lg:text-5xl font-normal mb-1 sm:mb-2">
                  10M+
                </div>
                <div className="text-gray-200 text-sm">
                  Happy Users
                </div>
              </div>

              {/* Stat 2: Country Served */}
              <div className="text-center">
                <div className="text-white text-4xl lg:text-5xl font-normal mb-1 sm:mb-2">
                  190+
                </div>
                <div className="text-gray-200 text-sm">
                  Country Served
                </div>
              </div>

              {/* Stat 3: Users Satisfaction Rate */}
              <div className="text-center">
                <div className="text-white text-4xl lg:text-5xl font-normal mb-1 sm:mb-2">
                  98%
                </div>
                <div className="text-gray-200 text-sm">
                  Users Satisfaction Rate
                </div>
              </div>

              {/* Stat 4: Money Back Guaranty */}
              <div className="text-center">
                <div className="text-white text-4xl lg:text-5xl font-normal mb-1 sm:mb-2">
                  100%
                </div>
                <div className="text-gray-200 text-sm">
                  Money Back Guaranty
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
