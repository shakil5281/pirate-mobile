/**
 * Shared utility functions for country pages
 * This file centralizes common helper functions used across country pages
 */

import { sanitizeImageUrl, isSlowLoadingDomain } from './imageHelpers'

// Helper function to get country info from API (fallback)
export async function getCountryInfo(slug) {
    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
        const response = await fetch(`${apiBaseUrl}/e-sim/countries`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
export function formatDataAmount(mb) {
    // Handle unlimited plans (typically -1 MB)
    if (mb === -1 || mb < 0) {
        return "Unlimited";
    }
    if (mb >= 1000) {
        const gb = mb / 1000;
        return gb % 1 === 0 ? `${gb} GB` : `${gb.toFixed(1)} GB`;
    }
    return `${mb} MB`;
}

// Helper function to transform bundle data into plans
export function transformBundleData(bundleData, slug) {
    // Handle multiple response shapes
    const bundles = Array.isArray(bundleData)
        ? bundleData
        : (bundleData?.bundles
            || bundleData?.data?.bundles
            || bundleData?.data
            || []);

    if (!bundles || bundles.length === 0) {
        return { regular: [], unlimited: [] };
    }

    const regular = [];
    const unlimited = [];

    bundles.forEach((bundle, index) => {
        // Normalize basic fields across possible API shapes
        const rawDataAmount = bundle.dataAmount
            || bundle.data
            || bundle.mb
            || (typeof bundle.gb === 'number' ? bundle.gb * 1000 : undefined);
        const dataAmount = typeof rawDataAmount === 'number' ? rawDataAmount : 1000; // Default to 1GB in MB
        // Sanitize bundle name by removing any trailing curly braces or invalid URL characters
        const sanitizedName = bundle.name ? bundle.name.replace(/[{}]/g, '') : `${slug}-${index}`;
        const durationDays = bundle.duration || bundle.validity || bundle.days || bundle.durationInDays || 7;
        const salePrice = bundle.salePrice ?? bundle.sale_price ?? bundle.amount ?? bundle.price;
        const basePrice = bundle.price ?? bundle.listPrice ?? bundle.list_price ?? null;
        const plan = {
            label: formatDataAmount(dataAmount),
            validity: `${durationDays} Days`,
            price: parseFloat(salePrice ?? 4.49),
            oldPrice: basePrice != null ? parseFloat(basePrice) : null,
            pathName: sanitizedName,
            mostPopular: bundle.mostPopular || false,
            speed: bundle.speed || ["4G", "5G"],
            autostart: bundle.autostart || true
        };

        // Check if it's an unlimited plan (support multiple API shapes)
        const isUnlimitedFlag = bundle.unlimited === true ||
            (typeof bundle.type === 'string' && /unlimited/i.test(bundle.type)) ||
            (typeof bundle.name === 'string' && /unlimited/i.test(bundle.name)) ||
            (typeof bundle.bundleGroup === 'string' && /unlimited/i.test(bundle.bundleGroup)) ||
            (Array.isArray(bundle.groups) && bundle.groups.some(g => /unlimited/i.test(String(g))));

        if (isUnlimitedFlag) {
            unlimited.push(plan);
        } else {
            regular.push(plan);
        }
    });

    return { regular, unlimited };
}

// Helper function to prepare country data for components
export function prepareCountryData(countryConfig, countryInfo, bundleData, slug) {
    // Extract country info from bundle data if available
    const bundles = Array.isArray(bundleData) ? bundleData : (bundleData?.bundles || []);
    const firstBundle = bundles[0];
    const bundleCountryInfo = firstBundle?.country;

    // Use constants as primary source, with API data as fallback
    const countryName = bundleCountryInfo?.name ||
        countryInfo?.name ||
        countryConfig.name;

    const flagUrl = bundleCountryInfo?.flag ||
        countryInfo?.flag ||
        countryConfig.flag;

    const rawHeroImageUrl = firstBundle?.imageUrl ||
        countryInfo?.image ||
        countryInfo?.heroImage ||
        countryConfig.heroImage;
    
    // Sanitize and optimize the hero image URL
    const heroImageUrl = sanitizeImageUrl(rawHeroImageUrl, 'country');

    const description = countryInfo?.description ||
        countryConfig.description;

    return {
        countryName,
        flagUrl,
        heroImageUrl,
        description,
        bundleCountryInfo,
        firstBundle
    };
}
