import React from 'react'
import EuropeHeroSection from '@/components/features/destinations/europe/EuropeHeroSection'
import EuropeCountriesCovered from '@/components/features/destinations/europe/EuropeCountriesCovered'
import WhyChooseEuropeEsim from '@/components/features/destinations/europe/WhyChooseEuropeEsim'
import EsimPlansSection from '@/components/features/destinations/EsimPlansSection'
import EsimFeaturesSection from '@/components/features/destinations/EsimFeaturesSection'
import EsimNetworkPartnersSection from '@/components/features/destinations/EsimNetworkPartnersSection'
import ESimAppBanner from '@/components/shared/ESimAppBanner'
import { fetchCountryBundles } from '@/lib/api/bundles'
import { getCountryConfig } from '@/lib/constants/countries'
import { getCountryInfo, transformBundleData, prepareCountryData } from '@/lib/utils/countryHelpers'
import networkProvidersData from '@/data/networkProviders.json'
import Testimonials from '@/components/shared/Testimonials'
import Faq from '@/components/shared/Faq'
import { readJsonFromData } from '@/lib/data'
import EsimFeaturesSectionForEurope from '@/components/features/destinations/europe/EsimFeaturesSectionForEurope'

export async function generateMetadata() {
    const slug = 'europe'
    try {
        const json = await readJsonFromData(`data/countryData/${slug}.json`)
        const title = json?.seo_meta_title || json?.title || 'Prepaid eSIM for Europe'
        const description = json?.meta_description || undefined
        return { title, description, openGraph: { title, description }, twitter: { title, description } }
    } catch (_) {
        return { title: 'Prepaid eSIM for Europe' }
    }
}

export default async function EsimPage() {
    const slug = 'europe'

    // Get country configuration from constants
    const countryConfig = getCountryConfig(slug)

    // Fetch country information and bundles in parallel
    const [countryInfo, bundleData] = await Promise.all([
        getCountryInfo(slug),
        fetchCountryBundles(slug)
    ])

    // Transform bundle data into plans
    const plans = transformBundleData(bundleData, slug)

    // Prepare country data using shared utility
    const { countryName, flagUrl, heroImageUrl, description, bundleCountryInfo } =
        prepareCountryData(countryConfig, countryInfo, bundleData, slug)

    // Get network providers for this country/region
    const networkProviders = networkProvidersData[countryConfig.networkProviders] ||
        networkProvidersData[slug] ||
        networkProvidersData['default']

    // Fetch metadata/schema for SEO (server-side)
    let countryContent = null
    try {
        const json = await readJsonFromData(`data/countryData/${slug}.json`)
        countryContent = {
            schema: {
                faq: json?.faqSchema || null,
                product: json?.schema || null,
                service: json?.serviceSchema || null,
                localBusiness: json?.localBusinessSchema || null,
            }
        }
    } catch (_) {
        countryContent = null
    }

    return (
        <div className="bg-[#F5F8FF]">
            {/* Europe-Specific Hero Section */}
            <EuropeHeroSection />

            {/* Data Plans Section */}
            <EsimPlansSection
                countrySlug={slug}
                plans={plans}
            />
            {/* Features Section with Tabs */}
            <EsimFeaturesSectionForEurope
                countryName={countryName}
            />

            {/* Countries Covered Section */}
            <EuropeCountriesCovered />

            {/* Why Choose Section */}
            <WhyChooseEuropeEsim />

            {/* Testimonials Section */}
            <Testimonials />

            {/* FAQ Section */}
            <Faq countrySlug={slug} />

            {/* Structured Data (JSON-LD) */}
            {countryContent?.schema?.faq && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(countryContent.schema.faq) }} />
            )}
            {countryContent?.schema?.product && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(countryContent.schema.product) }} />
            )}
            {countryContent?.schema?.service && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(countryContent.schema.service) }} />
            )}
            {countryContent?.schema?.localBusiness && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(countryContent.schema.localBusiness) }} />
            )}

            {/* App Download Banner */}
            <ESimAppBanner />
        </div>
    )
}


