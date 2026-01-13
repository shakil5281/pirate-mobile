import React from 'react'
import EsimHeroSection from '@/components/features/destinations/EsimHeroSection'
import EsimPlansSection from '@/components/features/destinations/EsimPlansSection'
import EsimFeaturesSection from '@/components/features/destinations/EsimFeaturesSection'
import EsimNetworkPartnersSection from '@/components/features/destinations/EsimNetworkPartnersSection'
import ESimAppBanner from '@/components/shared/ESimAppBanner'
import { fetchBelgiumBundles } from '@/lib/api/bundles'
import { BELGIUM_CONFIG } from '@/lib/constants/countries'
import { getCountryInfo, transformBundleData, prepareCountryData } from '@/lib/utils/countryHelpers'
import networkProvidersData from '@/data/networkProviders.json'
import Testimonials from '@/components/shared/Testimonials'
import Faq from '@/components/shared/Faq'
import { readJsonFromData } from '@/lib/data'

export async function generateMetadata() {
    const slug = 'belgium';
    try {
        const json = await readJsonFromData(`data/countryData/${slug}.json`);
        const title = json?.seo_meta_title || json?.title || `Prepaid eSIM for ${slug.replace(/-/g, ' ')}`;
        const description = json?.meta_description || undefined;
        
        // Get country configuration for hero image preload
        const countryConfig = BELGIUM_CONFIG;
        const heroImageUrl = countryConfig?.heroImage || "https://images.unsplash.com/photo-1559113202-c916b8e44373?q=80&w=2070";
        
        return {
            title,
            description,
            openGraph: { title, description },
            twitter: { title, description },
            other: {
                'link': `<link rel="preload" as="image" href="${heroImageUrl}" />`
            }
        };
    } catch (_) {
        return {};
    }
}

export default async function EsimPage() {
    const slug = 'belgium';

    // Fetch country information and Belgium bundles in parallel
    const [countryInfo, bundleData] = await Promise.all([
        getCountryInfo('belgium'),
        fetchBelgiumBundles()
    ]);

    // Transform bundle data into plans
    const plans = transformBundleData(bundleData, slug);

    // Prepare country data using shared utility
    const { countryName, flagUrl, heroImageUrl, description, bundleCountryInfo } = 
        prepareCountryData(BELGIUM_CONFIG, countryInfo, bundleData, slug);

    // Get network providers for Belgium
    const networkProviders = networkProvidersData[BELGIUM_CONFIG.networkProviders] || 
        networkProvidersData['belgium'] || 
        networkProvidersData['be'] || 
        networkProvidersData['default'];

    // Fetch metadata/schema for SEO (server-side)
    let countryContent = null;
    try {
        const json = await readJsonFromData(`data/countryData/${slug}.json`);
        countryContent = {
            schema: {
                faq: json?.faqSchema || null,
                product: json?.schema || null,
                service: json?.serviceSchema || null,
                localBusiness: json?.localBusinessSchema || null,
            }
        };
    } catch (_) {
        countryContent = null;
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <EsimHeroSection
                countryName={countryName}
                countrySlug={slug}
                flagUrl={flagUrl}
                heroImageUrl={heroImageUrl}
                description={description}
                trustpilotRating={BELGIUM_CONFIG.trustpilotRating}
                reviewCount={BELGIUM_CONFIG.reviewCount}
            />

            {/* Data Plans Section */}
            <EsimPlansSection
                countrySlug={slug}
                plans={plans}
            />
            {/* Features Section with Tabs */}
            <EsimFeaturesSection
                countryName={countryName}
            />

            {/* Network Partners Section */}
            <EsimNetworkPartnersSection
                countryName={countryName}
                partnerInfo={{
                    text: "Partner in",
                    flag: flagUrl,
                    region: bundleCountryInfo?.region || countryInfo?.region
                }}
                networkProviders={networkProviders?.providers || []}
                iso={BELGIUM_CONFIG.iso}
            />
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
