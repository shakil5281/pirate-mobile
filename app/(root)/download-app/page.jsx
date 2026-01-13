import React from 'react'
import AppHeroSection from '@/components/features/download-app/AppHeroSection'
import KeyBenefitsFeatures from '@/components/features/download-app/KeyBenefitsFeatures'
import TopReasonsClientLove from '@/components/features/download-app/TopReasonsClientLove'
import HowToGetStarted from '@/components/features/download-app/HowToGetStarted'
import GlobalConnectivityPartners from '@/components/shared/GlobalConnectivityPartners'
import Faq from '@/components/shared/Faq'

// Import metadata directly from data files
import { readJsonFromData } from '@/lib/data'
import ESimAppBanner from '@/components/shared/ESimAppBanner'
import EsimVideo from '@/components/shared/EsimVideo'

export async function generateMetadata() {
  try {
    const data = await readJsonFromData('data/metadata/download-app.json')

    return {
      title: data.seo_meta_title || data.title,
      description: data.meta_description,
      openGraph: {
        title: data.openGraph?.title || data.title,
        description: data.openGraph?.description || data.meta_description,
        images: data.openGraph?.images || [],
        url: data.openGraph?.url,
        type: 'website',
      },
      twitter: {
        card: data.twitter?.card || 'summary_large_image',
        title: data.twitter?.title || data.title,
        description: data.twitter?.description || data.meta_description,
        images: data.twitter?.images || [],
      },
      other: {
        'application-name': 'Pirate Mobile',
        'apple-mobile-web-app-title': 'Pirate Mobile',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
      }
    }
  } catch (error) {
    console.error('Error loading metadata:', error)
    return {
      title: 'Download Pirate Mobile App',
      description: 'Download the Pirate Mobile app for instant eSIM activation and global connectivity.',
    }
  }
}

export default function DownloadApp() {
  return (
    <div className="min-h-screen">
      <AppHeroSection />
      <GlobalConnectivityPartners />
      <KeyBenefitsFeatures />
      <TopReasonsClientLove />
      <HowToGetStarted />
      <EsimVideo />
      <Faq />
      <ESimAppBanner />
    </div>
  )
}
