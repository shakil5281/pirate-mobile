"use client"

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { DollarSign, Globe, Smartphone, Zap, Shield, Clock } from 'lucide-react'

export default function EsimFeaturesSectionForEurope({
  countryName = "Saudi Arabia",
  features = null,
  description = null,
  technicalSpecs = null,
  className
}) {
  const [activeTab, setActiveTab] = useState("features")
  const pathname = usePathname()

  const isEuropePage = pathname?.startsWith('/esim/europe')
  const isHajjPage = pathname?.startsWith('/esim/hajj')

  const tabActiveClass = isEuropePage
    ? "data-[state=active]:bg-[#0B3197] data-[state=active]:text-white data-[state=active]:shadow-none"
    : isHajjPage
      ? "data-[state=active]:bg-[#2FB252] data-[state=active]:text-white data-[state=active]:shadow-none"
      : "data-[state=active]:bg-secondary data-[state=active]:text-black data-[state=active]:shadow-none"

  // Default features if none provided
  const defaultFeatures = [
    {
      iconType: "dollar",
      title: "Affordable global data from only $4.49",
      subtitle: "Travel smart, spend less"
    },
    {
      iconType: "globe",
      title: `Stay connected with the best network coverage in ${countryName}.`,
      subtitle: ""
    },
    {
      iconType: "smartphone",
      title: "Works seamlessly with any eSIM-supported device.",
      subtitle: ""
    }
  ]

  const displayFeatures = features || defaultFeatures

  // Helper function to get icon component by type
  const getIcon = (iconType) => {
    switch (iconType) {
      case "dollar":
        return <DollarSign className="w-5 h-5" />
      case "globe":
        return <Globe className="w-5 h-5" />
      case "smartphone":
        return <Smartphone className="w-5 h-5" />
      default:
        return <Globe className="w-5 h-5" />
    }
  }

  // Default description
  const defaultDescription = `Experience seamless connectivity in ${countryName} with our premium eSIM service. Get instant activation, reliable network coverage, and flexible data plans tailored to your travel needs. No physical SIM card required - simply scan, activate, and stay connected throughout your journey.`

  const displayDescription = description || defaultDescription

  // Default technical specs
  const defaultTechnicalSpecs = [
    { label: "Network Type", value: "4G/5G LTE" },
    { label: "Coverage", value: `Nationwide coverage in ${countryName}` },
    { label: "Activation", value: "Instant activation via QR code" },
    { label: "Device Support", value: "iPhone XS/XR and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer" },
    { label: "Top-up", value: "Available anytime during validity period" },
    { label: "Support", value: "24/7 customer support" }
  ]

  const displayTechnicalSpecs = technicalSpecs || defaultTechnicalSpecs

  return (
    <section className={cn("w-full py-12 md:py-16 lg:py-20", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Tabs */}
        <Tabs
          defaultValue="features"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Tab Triggers */}
          <div className="flex justify-center mb-0 absolute w-full -top-5 left-0">
            <TabsList className="border rounded-full overflow-hidden h-auto gap-0 bg-white shadow-2xl p-0.5">
              <TabsTrigger
                value="features"
                className={cn(
                  "rounded-full px-4 py-3 text-sm font-medium transition-all border-0",
                  tabActiveClass,
                  "data-[state=inactive]:text-[#040415]/70 data-[state=inactive]:hover:text-[#040415]"
                )}
              >
                Features
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className={cn(
                  "rounded-full px-4 py-3 text-sm font-medium transition-all border-0",
                  tabActiveClass,
                  "data-[state=inactive]:text-[#040415]/70 data-[state=inactive]:hover:text-[#040415]"
                )}
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className={cn(
                  "rounded-full px-4 py-3 text-sm font-medium transition-all border-0",
                  tabActiveClass,
                  "data-[state=inactive]:text-[#040415]/70 data-[state=inactive]:hover:text-[#040415]"
                )}
              >
                Technical Specs
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Features Content */}
          <TabsContent value="features" className="mt-0">
            <div className="bg-[#FFF] border  rounded-4xl overflow-hidden pt-18 px-14 pb-14">
              <div className="space-y-5">
                {displayFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 group"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600 group-hover:shadow-md transition-shadow">
                      {feature.icon || getIcon(feature.iconType)}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 pt-1">
                      <p className="text-gray-900 text-sm md:text-base font-medium leading-relaxed">
                        {feature.title}
                        {feature.subtitle && (
                          <span className="text-gray-600 ml-1">{feature.subtitle}</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Description Content */}
          <TabsContent value="description" className="mt-0">
            <div className="bg-[#FFF] border  rounded-4xl overflow-hidden pt-18 px-14 pb-14">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {displayDescription}
                </p>

                {/* Additional Benefits */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Instant Activation</h4>
                      <p className="text-xs text-gray-600">Get connected in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Secure Connection</h4>
                      <p className="text-xs text-gray-600">Encrypted data transfer</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">24/7 Support</h4>
                      <p className="text-xs text-gray-600">Always here to help</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Technical Specs Content */}
          <TabsContent value="technical" className="mt-0">
            <div className="bg-[#FFF] border  rounded-4xl overflow-hidden pt-18 px-14 pb-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayTechnicalSpecs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="font-semibold text-gray-900 text-sm sm:text-base sm:w-1/3 flex-shrink-0">
                      {spec.label}
                    </div>
                    <div className="text-gray-700 text-sm sm:text-base sm:w-2/3">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-white/50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Note:</strong> Compatibility may vary by device model and carrier.
                  Please check your device&apos;s eSIM compatibility before purchasing. Data speeds depend on network
                  availability and coverage in your area.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
