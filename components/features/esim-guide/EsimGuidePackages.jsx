'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { BarChart3, ArrowUpDown, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// Package Card Component
function PackageCard({ pkg }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 bg-white flex flex-col gap-6 transition-all duration-300 hover:shadow-lg",
        pkg.mostPopular
          ? "border-[#757575] border-[1.5px] shadow-[0px_30px_50px_0px_rgba(3,4,20,0.1)]"
          : "border-[#E4E4E4] border"
      )}
    >
      {/* Header: Title and Price */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-[#03052F] font-manrope leading-tight">
          {pkg.label}
        </h3>
        <div className="flex-shrink-0 bg-[#FFF2C4] border border-[#FFEF46] rounded-full px-2 py-2">
          <span className="text-lg font-bold text-[#02050A] font-manrope whitespace-nowrap">
            ${pkg.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Package Details */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[#E4E4E4]">
        {/* Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#03052F] flex-shrink-0" />
            <span className="text-base text-[#03052F] font-manrope">Type</span>
          </div>
          <span className="text-base font-medium text-[#040415] font-manrope">
            Data Only (4G/5G)
          </span>
        </div>

        {/* Data */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-[#03052F] flex-shrink-0" />
            <span className="text-base text-[#03052F] font-manrope">Data</span>
          </div>
          <span className="text-base font-semibold text-[#040415] font-manrope">
            {pkg.data}
          </span>
        </div>

        {/* Validity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#03052F] flex-shrink-0" />
            <span className="text-base text-[#03052F] font-manrope">Validity</span>
          </div>
          <span className="text-base font-semibold text-[#040415] font-manrope">
            {pkg.validity}
          </span>
        </div>
      </div>

      {/* Buy Button */}
      <Link href={`/checkout/${pkg.pathName}`} className="mt-auto">
        <Button
          variant={pkg.mostPopular ? "default" : "secondary"}
          size="sm"
          className={cn(
            "w-full rounded-full font-bold text-base font-manrope",
            pkg.mostPopular
              ? "bg-[#FFEF46] hover:bg-[#FFEF46]/90 text-[#03052F]"
              : "bg-[#F4F4F4] hover:bg-[#E4E4E4] text-[#03052F] border border-[#D9D9D9]"
          )}
        >
          Buy eSim Now
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </Link>
    </div>
  )
}

export default function EsimGuidePackages({
  countryName = "United States",
  title,
  description = "Choose your destination first, then a data plan according to your needs.",
  packages = {
    regular: [],
    unlimited: []
  },
  iconImage = "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/home/Group%201171275346.png?updatedAt=1760260356476",
  className
}) {
  const [activePlan, setActivePlan] = useState('regular')

  // Default packages if none provided - matching Figma design
  const defaultPackages = {
    regular: [
      {
        id: '1',
        label: '1 GB - 7 Days',
        price: 3.59,
        data: '1 GB',
        validity: '7 days',
        pathName: '1gb-7days'
      },
      {
        id: '2',
        label: '2 GB - 15 Days',
        price: 7.19,
        data: '2 GB',
        validity: '15 days',
        pathName: '2gb-15days'
      },
      {
        id: '3',
        label: '3 GB - 30 Days',
        price: 8.09,
        data: '3 GB',
        validity: '30 days',
        pathName: '3gb-30days',
        mostPopular: true
      },
      {
        id: '4',
        label: '5 GB - 30 Days',
        price: 11.69,
        data: '5 GB',
        validity: '30 days',
        pathName: '5gb-30days'
      },
      {
        id: '5',
        label: '10 GB - 30 Days',
        price: 17.09,
        data: '10 GB',
        validity: '30 days',
        pathName: '10gb-30days'
      },
      {
        id: '6',
        label: '20 GB - 30 Days',
        price: 28.79,
        data: '20 GB',
        validity: '30 days',
        pathName: '20gb-30days'
      },
      {
        id: '7',
        label: '50 GB - 30 Days',
        price: 59.39,
        data: '50 GB',
        validity: '30 days',
        pathName: '50gb-30days'
      },
      {
        id: '8',
        label: '100 GB - 30 Days',
        price: 111.59,
        data: '100 GB',
        validity: '30 days',
        pathName: '100gb-30days'
      }
    ],
    unlimited: [
      {
        id: '9',
        label: '10 GB - 30 Days',
        price: 17.09,
        data: '10 GB',
        validity: '30 days',
        pathName: '10gb-30days-unlimited'
      },
      {
        id: '10',
        label: '20 GB - 30 Days',
        price: 28.79,
        data: '20 GB',
        validity: '30 days',
        pathName: '20gb-30days-unlimited'
      },
      {
        id: '11',
        label: '50 GB - 30 Days',
        price: 59.39,
        data: '50 GB',
        validity: '30 days',
        pathName: '50gb-30days-unlimited'
      },
      {
        id: '12',
        label: '100 GB - 30 Days',
        price: 111.59,
        data: '100 GB',
        validity: '30 days',
        pathName: '100gb-30days-unlimited'
      }
    ]
  }

  const displayPackages = packages.regular?.length > 0 ? packages : defaultPackages

  return (
    <section className={cn("w-full py-16 md:py-24 lg:py-32 bg-[#F6FFF8]", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 mb-8 md:mb-12">
          {/* Icon and Title */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative w-11 h-11 md:w-12 md:h-12">
              <Image
                src={iconImage}
                alt={`${countryName} flag`}
                width={46}
                height={46}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#03052F] text-center font-manrope">
              {title || `${countryName} eSim Packages`}
            </h2>
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-[#525253] text-center max-w-2xl font-manrope">
            {description}
          </p>

          {/* Plan Toggle Buttons */}
          <div className="flex items-center gap-0 bg-white border border-[#D9D9D9] rounded-full p-1 mt-4">
            <button
              onClick={() => setActivePlan('regular')}
              className={cn(
                "px-6 md:px-7 py-3 md:py-3.5 rounded-full font-bold text-base md:text-lg transition-all duration-200 font-manrope",
                activePlan === 'regular'
                  ? "bg-[#FFEF46] text-[#03052F]"
                  : "bg-[#E4E4E4] text-[#525253] hover:bg-gray-200"
              )}
            >
              Regular Plan
            </button>
            <button
              onClick={() => setActivePlan('unlimited')}
              className={cn(
                "px-6 md:px-7 py-3 md:py-3.5 rounded-full font-bold text-base md:text-lg transition-all duration-200 font-manrope",
                activePlan === 'unlimited'
                  ? "bg-[#FFEF46] text-[#03052F]"
                  : "bg-[#E4E4E4] text-[#525253] hover:bg-gray-200"
              )}
            >
              Unlimited Plans
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="flex flex-col gap-6 mb-12">
          {activePlan === 'regular' && (
            <>
              {/* First Row - 4 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayPackages.regular.slice(0, 4).map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              {/* Second Row - remaining cards (if any) */}
              {displayPackages.regular.length > 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayPackages.regular.slice(4).map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              )}
            </>
          )}

          {activePlan === 'unlimited' && (
            <>
              {/* First Row - 4 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayPackages.unlimited.slice(0, 4).map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              {/* Second Row - remaining cards (if any) */}
              {displayPackages.unlimited.length > 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayPackages.unlimited.slice(4).map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* See All Packages Button */}
        <div className="flex justify-center">
          <Link href="/countries">
            <Button
              size="lg"
              className="bg-[#FFEF46] hover:bg-[#FFEF46]/90 text-[#03052F] font-bold px-8 py-4 rounded-full font-manrope text-base"
            >
              See All Packages
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
