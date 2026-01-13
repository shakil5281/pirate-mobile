import CountriesClient from '@/components/features/countries/CountriesClient'
import ESimAppBanner from '@/components/shared/ESimAppBanner'
import { getCheapestPlan } from '@/lib/api/bundles'
import { getCountriesData } from '@/lib/api/countries'

export const metadata = {
  title: 'Countries | Pirate Mobile - eSIM Travel Connectivity',
  description: 'Connect globally in 190+ countries with Pirate Mobile eSIM. Fast, secure data with no roaming fees.',
  keywords: 'eSIM countries, international eSIM, travel connectivity, global eSIM, roaming free',
}

export const revalidate = 3600

async function fetchBundleForCountry(countryName) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
    
    // Create fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await fetch(`${apiBaseUrl}/e-sim/bundle?country=${encodeURIComponent(countryName)}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return getCheapestPlan(data);
  } catch (error) {
    // Suppress timeout errors in logs - they're common and expected
    if (error.name !== 'AbortError') {
      console.error(`Error fetching bundle for ${countryName}:`, error);
    }
    return null;
  }
}

async function enrichCountriesWithPricing(countries) {
  // Fetch pricing for first 20 countries to avoid too many API calls
  const countriesToFetch = countries.slice(0, 20);
  
  const pricingPromises = countriesToFetch.map(async (country) => {
    const pricing = await fetchBundleForCountry(country.name);
    return {
      ...country,
      pricing: pricing
    };
  });
  
  const enrichedCountries = await Promise.all(pricingPromises);
  
  // Merge enriched countries with remaining countries
  const remainingCountries = countries.slice(20);
  
  return [...enrichedCountries, ...remainingCountries];
}

export default async function Page() {
  const data = await getCountriesData();
  
  // Enrich countries with pricing data
  const enrichedCountries = await enrichCountriesWithPricing(data.countries || []);
  
  const enrichedData = {
    ...data,
    countries: enrichedCountries
  };
  
  return(
    <div>
      <CountriesClient data={enrichedData} />
      <ESimAppBanner />
    </div>
  )
}

