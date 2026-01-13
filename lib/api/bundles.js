import { getCountryConfig, getCountryApiResponse } from '@/lib/constants/countries';

/**
 * Fetch data bundles/plans for a specific country
 * @param {string} country - Country name or ISO code
 * @returns {Promise<Object>} Bundle data
 */
export async function fetchCountryBundles(country, options = {}) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
    const countryConfig = getCountryConfig(country);
    // Prefer explicit endpoint from config when it already specifies a bundle group (special cases like Hajj/Europe)
    const hasExplicitGroup = typeof countryConfig.apiEndpoint === 'string' && countryConfig.apiEndpoint.includes('bundleGroup=');
    const countrySlug = typeof country === 'string' ? country.toLowerCase() : countryConfig.slug;
    const endpoint = hasExplicitGroup
      ? countryConfig.apiEndpoint
      : `${apiBaseUrl}/e-sim/bundle?country=${encodeURIComponent(countrySlug)}&bundleGroup=${encodeURIComponent('Standard Fixed')}`;

    // Create fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(endpoint, { 
      next: { revalidate: 3600 }, // Revalidate every hour
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    // Only log error if not suppressed and not a timeout error
    if (!options.suppressErrorLog && error.name !== 'AbortError') {
      console.error(`Error fetching bundles for ${country}:`, error);
    }
    return null;
  }
}

/**
 * Fetch data bundles/plans for a specific country with a specific bundle group
 * @param {string} country - Country name or ISO code
 * @param {string} bundleGroup - Bundle group type (e.g., 'Standard Fixed', 'Standard Unlimited Essential')
 * @returns {Promise<Object>} Bundle data
 */
export async function fetchCountryBundlesWithGroup(country, bundleGroup) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
    const countryConfig = getCountryConfig(country);
    const countrySlug = typeof country === 'string' ? country.toLowerCase() : countryConfig.slug;
    const lowerGroup = typeof bundleGroup === 'string' ? bundleGroup.toLowerCase() : '';

    // Some regions (e.g., Europe) use region-based endpoints instead of country for bundles
    let regionFromConfig = null;
    if (typeof countryConfig.apiEndpoint === 'string') {
      try {
        const url = new URL(countryConfig.apiEndpoint);
        regionFromConfig = url.searchParams.get('region');
      } catch {
        regionFromConfig = null;
      }
    }

    const isEurope = countrySlug === 'europe';
    const region = isEurope
      ? (lowerGroup === 'standard unlimited essential' ? 'europe' : (regionFromConfig || 'europe'))
      : regionFromConfig;

    const isHajj = countrySlug === 'hajj';
    const isHajjUnlimited = isHajj && lowerGroup === 'standard unlimited essential';

    const endpoint = isHajjUnlimited
      ? `${apiBaseUrl}/e-sim/bundle?country=${encodeURIComponent('saudi-arabia')}&bundleGroup=${encodeURIComponent(bundleGroup)}`
      : isHajj
      ? `${apiBaseUrl}/e-sim/bundle?iso=${encodeURIComponent(countryConfig.iso || 'sa')}&bundleGroup=${encodeURIComponent(bundleGroup)}`
      : region
      ? `${apiBaseUrl}/e-sim/bundle?region=${encodeURIComponent(region)}&bundleGroup=${encodeURIComponent(bundleGroup)}`
      : `${apiBaseUrl}/e-sim/bundle?country=${encodeURIComponent(countrySlug)}&bundleGroup=${encodeURIComponent(bundleGroup)}`;

    // Create fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(endpoint, { 
      next: { revalidate: 3600 }, // Revalidate every hour
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    // Suppress timeout errors in logs
    if (error.name !== 'AbortError') {
      console.error(`Error fetching bundles for ${country} with group ${bundleGroup}:`, error);
    }
    return null;
  }
}

/**
 * Fetch bundles for multiple countries
 * @param {Array<string>} countries - Array of country names
 * @returns {Promise<Object>} Map of country to bundle data
 */
export async function fetchMultipleCountryBundles(countries) {
  const bundlePromises = countries.map(country => 
    fetchCountryBundles(country)
      .then(data => ({ country, data }))
      .catch(() => ({ country, data: null }))
  );
  
  const results = await Promise.all(bundlePromises);
  
  return results.reduce((acc, { country, data }) => {
    acc[country] = data;
    return acc;
  }, {});
}

/**
 * Fetch Thailand-specific bundles
 * @returns {Promise<Object>} Thailand bundle data
 */
export async function fetchThailandBundles() {
  return fetchCountryBundles('thailand');
}

/**
 * Fetch Hajj-specific bundles for Saudi Arabia
 * @returns {Promise<Object>} Hajj bundle data
 */
export async function fetchHajjBundles() {
  return fetchCountryBundles('hajj');
}

/**
 * Fetch United States-specific bundles
 * @returns {Promise<Object>} United States bundle data
 */
export async function fetchUnitedStatesBundles() {
  return fetchCountryBundles('united-states');
}

/**
 * Fetch Belgium-specific bundles
 * @returns {Promise<Object>} Belgium bundle data
 */
export async function fetchBelgiumBundles() {
  return fetchCountryBundles('belgium');
}

/**
 * Get the cheapest plan from bundle data
 * @param {Object} bundleData - Bundle data from API
 * @returns {Object|null} Cheapest plan info
 */
export function getCheapestPlan(bundleData) {
  if (!bundleData || !bundleData.bundles || bundleData.bundles.length === 0) {
    return null;
  }
  
  const cheapest = bundleData.bundles.reduce((min, bundle) => {
    const price = parseFloat(bundle.price || bundle.amount || 0);
    const minPrice = parseFloat(min.price || min.amount || Infinity);
    return price < minPrice ? bundle : min;
  }, bundleData.bundles[0]);
  
  return {
    price: cheapest.price || cheapest.amount,
    currency: cheapest.currency || bundleData.currency || 'USD',
    data: cheapest.data || cheapest.dataAmount,
    validity: cheapest.validity || cheapest.duration,
    id: cheapest.id
  };
}
