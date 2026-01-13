import React from 'react'
import HeroSection from '@/components/features/esim-guide/HeroSection'
import WhyESIMSection from '@/components/features/esim-guide/WhyESIMSection'
import ESIMGuideFAQ from '@/components/features/esim-guide/ESIMGuideFAQ'
import EsimPlansGuideSection from '@/components/features/esim-guide/EsimPlansGuideSection'
import { EsimFeaturesSection } from '@/components/features/destinations'
import HowToGetStarted from '@/components/features/download-app/HowToGetStarted'
import WhatMakesUsUnstoppable from '@/components/features/about/WhatMakesUsUnstoppable'
import { fetchUnitedStatesBundles } from '@/lib/api/bundles'
import { transformBundleData } from '@/lib/utils/countryHelpers'

export async function generateMetadata() {
  return {
    title: 'eSIM Guide - Explore New Places Without Roaming Fees | Pirate Mobile',
    description: 'Discover how to save up to 50% on roaming with Pirate Mobile eSIM. Fast 4G/5G coverage in 200+ countries with 24/7 customer support.',
    keywords: 'eSIM guide, travel eSIM, international roaming, global connectivity, eSIM plans',
  }
}

export default async function EsimGuideLandingPage() {
  // Fetch United States bundles
  const bundleData = await fetchUnitedStatesBundles()

  // Transform bundle data into plans
  const plans = transformBundleData(bundleData, 'united-states')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Why eSIM Section */}
      <EsimPlansGuideSection
        countryName="United States"
        plans={plans}
      />

      <EsimFeaturesSection />
      <HowToGetStarted />
      <WhatMakesUsUnstoppable />
      <WhyESIMSection />

      {/* FAQ Section */}
      <ESIMGuideFAQ />
    </div>
  )
}

