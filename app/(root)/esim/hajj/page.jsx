import React from 'react'
import HajjHeroSection from '@/components/features/destinations/hajj/HajjHeroSection'
import HajjOffersSection from '@/components/features/destinations/hajj/HajjOffersSection'
import EsimPlansSection from '@/components/features/destinations/EsimPlansSection'
import EsimFeaturesSection from '@/components/features/destinations/EsimFeaturesSection'
import EsimNetworkPartnersSection from '@/components/features/destinations/EsimNetworkPartnersSection'
import { fetchHajjBundles } from '@/lib/api/bundles'
import networkProvidersData from '@/data/networkProviders.json'
import hajjData from '@/data/countryData/hajj.json'
import Testimonials from '@/components/shared/Testimonials'
import Faq from '@/components/shared/Faq'
import HajjHowItWorksSection from '@/components/features/destinations/hajj/HajjHowItWorksSection'
import HajjBenefitsSection from '@/components/features/destinations/hajj/HajjBenefitsSection'
import HajjConnectivityBanner from '@/components/features/destinations/hajj/HajjConnectivityBanner'

// Metadata for SEO
export const metadata = {
    title: hajjData.seo_meta_title || hajjData.title,
    description: hajjData.meta_description,
    openGraph: {
        title: hajjData.seo_meta_title || hajjData.title,
        description: hajjData.meta_description,
    },
}

// Helper function to get country info from API
async function getCountryInfo(slug) {
    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
        const response = await fetch(`${apiBaseUrl}/e-sim/countries`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const countries = data.countries || [];

        // Find the country by slug
        const country = countries.find(c =>
            c.slug === slug ||
            c.name.toLowerCase().replace(/\s+/g, '-') === slug
        );

        return country;
    } catch (error) {
        console.error('Error fetching country info:', error);
        return null;
    }
}

// Helper function to convert MB to GB display format
function formatDataAmount(mb) {
    if (mb >= 1000) {
        const gb = mb / 1000;
        return gb % 1 === 0 ? `${gb} GB` : `${gb.toFixed(1)} GB`;
    }
    return `${mb} MB`;
}

// Helper function to transform bundle data into plans
function transformBundleData(bundleData, slug) {
    // Handle both array and object with bundles property
    const bundles = Array.isArray(bundleData) ? bundleData : (bundleData?.bundles || []);

    if (!bundles || bundles.length === 0) {
        return { regular: [], unlimited: [] };
    }

    const regular = [];
    const unlimited = [];

    bundles.forEach((bundle, index) => {
        const dataAmount = bundle.dataAmount || 1000; // Default to 1GB in MB
        // Sanitize bundle name by removing any trailing curly braces or invalid URL characters
        const sanitizedName = bundle.name ? bundle.name.replace(/[{}]/g, '') : `${slug}-${index}`;
        const plan = {
            label: formatDataAmount(dataAmount),
            validity: `${bundle.duration || 7} Days`,
            price: parseFloat(bundle.salePrice || bundle.price || 4.49),
            oldPrice: bundle.price ? parseFloat(bundle.price) : null,
            pathName: sanitizedName,
            mostPopular: bundle.mostPopular || false,
            speed: bundle.speed || ["4G", "5G"],
            autostart: bundle.autostart || true
        };

        // Check if it's an unlimited plan
        if (bundle.unlimited === true) {
            unlimited.push(plan);
        } else {
            regular.push(plan);
        }
    });

    return { regular, unlimited };
}

export default async function EsimPage() {
    // Hardcode slug for Hajj page since it's a static route
    const slug = 'hajj';

    // Fetch country information and Hajj bundles in parallel
    const [countryInfo, bundleData] = await Promise.all([
        getCountryInfo('saudi-arabia'), // Use Saudi Arabia for Hajj
        fetchHajjBundles()
    ]);

    // Transform bundle data into plans
    const plans = transformBundleData(bundleData, slug);

    // Extract country info from bundle data if available
    const bundles = Array.isArray(bundleData) ? bundleData : (bundleData?.bundles || []);
    const firstBundle = bundles[0];
    const bundleCountryInfo = firstBundle?.country;

    // Prepare country data for hero section
    const countryName = bundleCountryInfo?.name ||
        countryInfo?.name ||
        "Saudi Arabia";

    const flagUrl = bundleCountryInfo?.flag ||
        countryInfo?.flag ||
        "https://flagcdn.com/w80/sa.png";

    const heroImageUrl = firstBundle?.imageUrl ||
        countryInfo?.image ||
        countryInfo?.heroImage ||
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070";

    const description = countryInfo?.description ||
        `Get an eSIM for Hajj in Saudi Arabia and enjoy reliable and affordable Internet access during your pilgrimage.`;

    // Get network providers for Saudi Arabia
    const networkProviders = networkProvidersData['saudi-arabia'] || networkProvidersData['sa'] || networkProvidersData['default'];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <HajjHeroSection
                countryName={countryName}
                countrySlug={slug}
                flagUrl={flagUrl}
                heroImageUrl={heroImageUrl}
                description={description}
                trustpilotRating={4.9}
                reviewCount="32K+"
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
            <HajjConnectivityBanner />

            {/* Special Hajj Offers Section */}
            <HajjOffersSection />

            {/* How It Works Section */}
            <HajjHowItWorksSection />

            {/* Benefits Section */}
            <HajjBenefitsSection />

            {/* Testimonials Section */}
            <Testimonials />

            {/* FAQ Section */}
            <Faq faqs={hajjData.faqs} />

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(hajjData.schema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(hajjData.faqSchema) }}
            />
        </div>
    )
}
