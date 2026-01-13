"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DataPlanCard } from '@/components/card/data-plan-card'
import { PlanGridSkeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils'
import { fetchCountryBundlesWithGroup } from '@/lib/api/bundles'
import { transformBundleData } from '@/lib/utils/countryHelpers'
import { Star, Smartphone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { DeviceCompatibilityDialog } from '@/components/features/compatible-devices/DeviceCompatibilityDialog'

export default function EsimPlansSection({
  countrySlug = "belgium",
  plans = {
    regular: [],
    unlimited: []
  },
  className
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("regular")
  const [currentPlans, setCurrentPlans] = useState(plans)
  const [loading, setLoading] = useState(false)

  // Determine page-specific styling
  const isEuropePage = pathname === '/esim/europe'
  const isHajjPage = pathname === '/esim/hajj'
  const isSpecialPage = isEuropePage || isHajjPage

  const handleBuyClick = (planId) => {
    // Navigate to checkout page with plan ID
    router.push(`/checkout/${planId}`)
  }

  const handleTabChange = async (value) => {
    setActiveTab(value)
    setLoading(true)

    try {
      let bundleGroup
      if (value === "regular") {
        bundleGroup = "Standard Fixed"
      } else if (value === "unlimited") {
        bundleGroup = "Standard Unlimited Essential"
      }

      if (bundleGroup) {
        const bundleData = await fetchCountryBundlesWithGroup(countrySlug, bundleGroup)
        if (bundleData) {
          const transformedPlans = transformBundleData(bundleData, countrySlug)
          setCurrentPlans(transformedPlans)
        }
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasRegularPlans = currentPlans.regular && currentPlans.regular.length > 0
  const hasUnlimitedPlans = currentPlans.unlimited && currentPlans.unlimited.length > 0

  return (
    <section className={cn("w-full py-12 md:py-20", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs Wrapper */}
        <Tabs
          defaultValue="regular"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
        {/* Special Header for Europe and Hajj Pages */}
        {isSpecialPage && (
          <div className="mb-8 md:mb-10">
            {/* Mobile Layout - Centered Stack */}
            <div className="lg:hidden">
              {/* Bordered Container */}
              <div className="">
                {/* Trustpilot - Centered */}
                <div className="flex flex-col items-center mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 fill-green-500 text-green-500" />
                    <span className="font-bold text-base">Trustpilot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">TrustScore 4.9</span>
                    <Link 
                      href="https://www.trustpilot.com/review/piratemobile.gg" 
                      target="_blank"
                      className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors underline"
                    >
                      See Reviews →
                    </Link>
                  </div>
                </div>

                {/* Check Device Compatibility - Centered */}
                <DeviceCompatibilityDialog>
                  <button 
                    type="button"
                    className="flex w-full items-center justify-center gap-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors mb-6 border border-gray-300 rounded-lg py-2.5 px-4"
                  >
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <span>Check Device Compatibility</span>
                  </button>
                </DeviceCompatibilityDialog>

                {/* Title - Centered */}
                <h1 className={cn(
                  'text-3xl md:text-4xl font-bold text-center leading-tight mb-6',
                  isHajjPage && "font-[family-name:var(--font-philosopher)]"
                )}>
                  {isEuropePage ? (
                    <>
                      eSIM Packages<br />For <span className='text-[#3B82F6]'>Europe</span>
                    </>
                  ) : (
                    <>
                      eSIM For <span className='text-[#35B34B]'>Saudi Arabia</span>
                    </>
                  )}
                </h1>

                {/* Tabs - Centered */}
                <div className="flex justify-center">
                  <TabsList className={cn("bg-white border border-gray-200 shadow-sm h-auto p-1 rounded-full", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
                    <TabsTrigger
                      value="regular"
                      className={cn(
                        "rounded-full px-6 py-2.5 text-base font-semibold transition-all",
                        isSpecialPage
                          ? isEuropePage
                            ? "data-[state=active]:bg-[#00309A] data-[state=active]:text-white data-[state=active]:shadow-md"
                            : "data-[state=active]:bg-[#35B34B] data-[state=active]:text-white data-[state=active]:shadow-md"
                          : "data-[state=active]:bg-[#FFEF46] data-[state=active]:text-gray-900 data-[state=active]:shadow-md",
                        "data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:bg-transparent",
                        isHajjPage && "font-[family-name:var(--font-philosopher)]"
                      )}
                    >
                      Regular Plan
                    </TabsTrigger>
                    <TabsTrigger
                      value="unlimited"
                      className={cn(
                        "rounded-full px-6 py-2.5 text-base font-semibold transition-all",
                        isSpecialPage
                          ? isEuropePage
                            ? "data-[state=active]:bg-[#00309A] data-[state=active]:text-white data-[state=active]:shadow-md"
                            : "data-[state=active]:bg-[#35B34B] data-[state=active]:text-white data-[state=active]:shadow-md"
                          : "data-[state=active]:bg-[#FFEF46] data-[state=active]:text-gray-900 data-[state=active]:shadow-md",
                        "data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:bg-transparent",
                        isHajjPage && "font-[family-name:var(--font-philosopher)]"
                      )}
                    >
                      Unlimited Plans
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Two Columns */}
            <div className="hidden lg:block">
              {/* Bordered Container */}
              <div className="">
                <div className="flex items-center justify-between gap-8">
                  {/* Left Section - Title and Tabs */}
                  <div className="flex-1">
                    {/* Title */}
                    <h1 className={cn(
                      'text-4xl font-bold leading-tight mb-3',
                      isHajjPage && "font-[family-name:var(--font-philosopher)]"
                    )}>
                      {isEuropePage ? (
                        <>
                          eSIM Packages For <span className='text-[#3B82F6]'>Europe</span>
                        </>
                      ) : (
                        <>
                          eSIM For <span className='text-[#006236]'>Saudi Arabia</span>
                        </>
                      )}
                    </h1>

                    {/* Tabs */}
                    <TabsList className={cn("bg-white border border-gray-200 shadow-sm h-auto p-1 rounded-full w-fit", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
                      <TabsTrigger
                        value="regular"
                        className={cn(
                          "rounded-full px-8 py-3 text-base font-semibold transition-all font-manrope",
                          isSpecialPage
                            ? isEuropePage
                              ? "data-[state=active]:bg-[#00309A] data-[state=active]:text-white data-[state=active]:shadow-md"
                              : "data-[state=active]:bg-[#35B34B] data-[state=active]:text-white data-[state=active]:shadow-md"
                            : "data-[state=active]:bg-[#FFEF46] data-[state=active]:text-gray-900 data-[state=active]:shadow-md",
                          "data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:bg-transparent"
                        )}
                      >
                        Regular Plan
                      </TabsTrigger>
                      <TabsTrigger
                        value="unlimited"
                        className={cn(
                          "rounded-full px-8 py-3 text-base font-semibold transition-all font-manrope",
                          isSpecialPage
                            ? isEuropePage
                              ? "data-[state=active]:bg-[#00309A] data-[state=active]:text-white data-[state=active]:shadow-md"
                              : "data-[state=active]:bg-[#35B34B] data-[state=active]:text-white data-[state=active]:shadow-md"
                            : "data-[state=active]:bg-[#FFEF46] data-[state=active]:text-gray-900 data-[state=active]:shadow-md",
                          "data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:bg-transparent"
                        )}
                      >
                        Unlimited Plans
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Right Section - Trustpilot and Device Compatibility */}
                  <div className="flex flex-col items-end gap-4 flex-shrink-0">
                    {/* Trustpilot Widget */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <Image 
                            src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/trustpilot-seeklogo%201.svg?updatedAt=1761623058415"
                            alt="Trustpilot"
                            width={24}
                            height={24}
                            className="w-32 h-8"
                          />
                        </div>
                        <span className="text-sm text-gray-600 font-manrope">TrustScore 4.9</span>
                      </div>
                      <Link 
                        href="https://www.trustpilot.com/review/piratemobile.gg" 
                        target="_blank"
                        className="text-sm text-green-600 font-semibold hover:text-green-700 transition-colors border border-green-600 px-4 py-2 rounded-full hover:bg-green-50 whitespace-nowrap font-manrope"
                      >
                        See Reviews
                      </Link>
                    </div>

                    {/* Check Device Compatibility */}
                    <DeviceCompatibilityDialog>
                      <button 
                        type="button"
                        className="flex w-full items-center gap-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors border border-gray-300 rounded-lg py-2 px-4"
                      >
                        <Smartphone className="w-5 h-5 flex-shrink-0" />
                        <span className="whitespace-nowrap font-manrope">Check Device Compatibility</span>
                      </button>
                    </DeviceCompatibilityDialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

          {/* Tab Triggers - Only show for non-special pages */}
          {!isSpecialPage && (
            <div className="flex mb-8 md:mb-10">
              <TabsList className={cn("bg-white border border-gray-200 shadow-sm h-auto p-1 rounded-full", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>
                <TabsTrigger
                  value="regular"
                  className={cn(
                    "rounded-full px-6 py-2.5 text-base font-medium transition-all font-manrope",
                    "data-[state=active]:bg-[#FFEF46] data-[state=active]:text-gray-900 data-[state=active]:shadow-md",
                    "data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:bg-transparent"
                  )}
                >
                  Standard Plans
                </TabsTrigger>
                <TabsTrigger
                  value="unlimited"
                  className={cn(
                    "rounded-full px-6 py-2.5 text-base font-medium transition-all font-manrope",
                    "data-[state=active]:bg-[#FFEF46] data-[state=active]:text-gray-900 data-[state=active]:shadow-md",
                    "data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:bg-transparent"
                  )}
                >
                  Unlimited Plans
                </TabsTrigger>
              </TabsList>
            </div>
          )}

          {/* Regular Plans Content */}
          <TabsContent value="regular" className="mt-0">
            {loading ? (
              <PlanGridSkeleton count={8} />
            ) : hasRegularPlans ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {currentPlans.regular.map((plan, index) => (
                  <DataPlanCard
                    key={`regular-${index}`}
                    dataAmount={plan.label}
                    pathName={plan.pathName}
                    duration={plan.validity}
                    price={plan.price}
                    oldPrice={plan.oldPrice || null}
                    type="Data Only (4G/5G)"
                    dataValue={plan.label}
                    validity={plan.validity.toLowerCase()}
                    mostPopular={plan.mostPopular}
                    onBuyClick={() => handleBuyClick(plan.pathName)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className={cn("text-gray-500 text-lg", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>No regular plans available at the moment.</p>
              </div>
            )}
          </TabsContent>

          {/* Unlimited Plans Content */}
          <TabsContent value="unlimited" className="mt-0">
            {loading ? (
              <PlanGridSkeleton count={8} />
            ) : hasUnlimitedPlans ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {currentPlans.unlimited.map((plan, index) => (
                  <DataPlanCard
                    key={`unlimited-${index}`}
                    dataAmount={plan.label}
                    pathName={plan.pathName}
                    duration={plan.validity}
                    price={plan.price}
                    oldPrice={plan.oldPrice || null}
                    type="Data Only (4G/5G)"
                    dataValue={plan.label}
                    validity={plan.validity.toLowerCase()}
                    mostPopular={plan.mostPopular}
                    onBuyClick={() => handleBuyClick(plan.pathName)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className={cn("text-gray-500 text-lg", isHajjPage && "font-[family-name:var(--font-philosopher)]")}>No unlimited plans available at the moment.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
