/**
 * Country constants and configurations
 * This file centralizes all country-specific data and API responses
 */

// Thailand specific constants
export const THAILAND_CONFIG = {
  slug: 'thailand',
  name: 'Thailand',
  flag: 'https://flagcdn.com/w80/th.png',
  heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070',
  description: 'Get an eSIM for Thailand and enjoy reliable and affordable Internet access on your trip to the Land of Smiles.',
  region: 'Asia',
  iso: 'th',
  networkProviders: 'thailand',
  trustpilotRating: 4.9,
  reviewCount: '32K+',
  apiEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg'}/e-sim/bundle?country=thailand`
};

// Hajj specific constants
export const HAJJ_CONFIG = {
  slug: 'hajj',
  name: 'Hajj eSIM',
  flag: 'https://flagcdn.com/w80/sa.png',
  heroImage: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070',
  description: 'Get an eSIM for Hajj and enjoy reliable connectivity during your spiritual journey in Saudi Arabia.',
  region: 'Middle East',
  iso: 'sa',
  networkProviders: 'saudi-arabia',
  trustpilotRating: 4.9,
  reviewCount: '32K+',
  apiEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg'}/e-sim/bundle?iso=sa&bundleGroup=Standard Fixed`
};

// Generic country configuration template
export const createCountryConfig = (slug, name, options = {}) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
  return {
    slug,
    name,
    flag: options.flag || `https://flagcdn.com/w80/${slug.substring(0, 2).toLowerCase()}.png`,
    heroImage: options.heroImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070',
    description: options.description || `Get an eSIM for ${name} and enjoy reliable and affordable Internet access on your trip.`,
    region: options.region || 'Global',
    iso: options.iso || slug.substring(0, 2).toLowerCase(),
    networkProviders: options.networkProviders || slug,
    trustpilotRating: options.trustpilotRating || 4.9,
    reviewCount: options.reviewCount || '32K+',
    apiEndpoint: options.apiEndpoint || `${apiBaseUrl}/e-sim/bundle?country=${slug}`
  };
};

// United States specific constants
export const UNITED_STATES_CONFIG = {
  slug: 'united-states',
  name: 'United States',
  flag: 'https://flagcdn.com/w80/us.png',
  heroImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=2070',
  description: 'Get an eSIM for the United States and enjoy reliable and affordable Internet access during your visit to America.',
  region: 'North America',
  iso: 'us',
  networkProviders: 'united-states',
  trustpilotRating: 4.9,
  reviewCount: '32K+',
  apiEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg'}/e-sim/bundle?country=united-states`
};

// Europe region configuration
export const EUROPE_CONFIG = {
  slug: 'europe',
  name: 'Europe',
  flag: 'https://flagcdn.com/w80/eu.png',
  heroImage: 'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?q=80&w=2070',
  description: 'Get a regional eSIM for Europe and enjoy reliable and affordable Internet access across multiple countries.',
  region: 'Europe',
  iso: 'eu',
  networkProviders: 'europe',
  trustpilotRating: 4.9,
  reviewCount: '32K+',
  apiEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg'}/e-sim/bundle?bundleGroup=Standard Fixed&region=Europe Lite`
};

// Belgium specific constants
export const BELGIUM_CONFIG = {
  slug: 'belgium',
  name: 'Belgium',
  flag: 'https://flagcdn.com/w80/be.png',
  heroImage: 'https://images.unsplash.com/photo-1559113202-c916b8e44373?q=80&w=2070',
  description: 'Get an eSIM for Belgium and enjoy reliable and affordable Internet access on your trip.',
  region: 'Europe',
  iso: 'be',
  networkProviders: 'belgium',
  trustpilotRating: 4.9,
  reviewCount: '32K+',
  apiEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg'}/e-sim/bundle?country=belgium`
};

// Country configurations map
export const COUNTRY_CONFIGS = {
  thailand: THAILAND_CONFIG,
  hajj: HAJJ_CONFIG,
  'united-states': UNITED_STATES_CONFIG,
  europe: EUROPE_CONFIG,
  belgium: BELGIUM_CONFIG,
  // Example: Add more countries as needed
  // japan: createCountryConfig('japan', 'Japan', { 
  //   region: 'Asia', 
  //   iso: 'jp',
  //   flag: 'https://flagcdn.com/w80/jp.png',
  //   heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070',
  //   description: 'Get an eSIM for Japan and enjoy reliable connectivity during your visit to the Land of the Rising Sun.',
  //   networkProviders: 'japan'
  // }),
  // singapore: createCountryConfig('singapore', 'Singapore', { 
  //   region: 'Asia', 
  //   iso: 'sg',
  //   flag: 'https://flagcdn.com/w80/sg.png',
  //   heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2070',
  //   description: 'Get an eSIM for Singapore and stay connected in this modern city-state.',
  //   networkProviders: 'singapore'
  // }),
};

// Helper function to get country config by slug
export const getCountryConfig = (slug) => {
  return COUNTRY_CONFIGS[slug] || createCountryConfig(slug, slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' '));
};

// API response constants
export const API_RESPONSES = {
  THAILAND: {
    // This will be populated with actual API response data
    // You can update this when you get the actual response structure
    bundles: [],
    country: THAILAND_CONFIG,
    currency: 'USD'
  },
  HAJJ: {
    bundles: [],
    country: HAJJ_CONFIG,
    currency: 'USD'
  },
  'UNITED-STATES': {
    bundles: [],
    country: UNITED_STATES_CONFIG,
    currency: 'USD'
  }
};

// Helper function to get API response for a country
export const getCountryApiResponse = (slug) => {
  return API_RESPONSES[slug.toUpperCase()] || {
    bundles: [],
    country: getCountryConfig(slug),
    currency: 'USD'
  };
};
