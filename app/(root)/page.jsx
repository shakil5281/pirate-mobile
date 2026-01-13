import React from 'react'
import MainHero from '@/components/features/home/Hero'
import FeatureSection from '@/components/features/home/FeatureSection'
import PopularDestinations from '@/components/features/home/PopularDestinations'
import GlobalConnectivityPartners from '@/components/shared/GlobalConnectivityPartners'
import LazyHomeContent from '@/components/features/home/LazyHomeContent'
import homeData from '@/data/pages/home.json'
import countriesData from '@/data/pages/countries.json'
import ESimAppBanner from '@/components/shared/ESimAppBanner'
import FirstTimeLoaderControls from '@/components/shared/FirstTimeLoaderControls'

export async function generateMetadata() {
  return homeData.metadata || {}
}

export default function Page() {
  return (
    <div>
      {/* Critical above-the-fold content */}
      <MainHero />
      <GlobalConnectivityPartners />
      <div className='flex flex-col-reverse lg:flex-col'>
        <FeatureSection />
        <PopularDestinations data={countriesData} />
      </div>

      {/* Lazy load non-critical content */}
      <LazyHomeContent />

      <ESimAppBanner />

      {/* Development only: First-time loader testing controls */}
      {process.env.NODE_ENV === 'development' && <FirstTimeLoaderControls />}
    </div>
  )
}
