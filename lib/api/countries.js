import { unstable_cache } from 'next/cache'

const ONE_HOUR = 60 * 60
const CACHE_TAG = 'countries-data'
const CACHE_KEY = ['countries-data-cache-v1']

async function fetchCountriesFromApi() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg'

  const response = await fetch(`${apiBaseUrl}/e-sim/countries`, {
    next: { revalidate: ONE_HOUR, tags: [CACHE_TAG] },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

const getCountriesDataCached = unstable_cache(
  async () => {
    const data = await fetchCountriesFromApi()

    return {
      countries: data?.countries || [],
      popularCountries: data?.popularCountries || [],
      metadata: data?.metadata,
    }
  },
  CACHE_KEY,
  { revalidate: ONE_HOUR, tags: [CACHE_TAG] }
)

export async function getCountriesData() {
  try {
    return await getCountriesDataCached()
  } catch (error) {
    console.error('Error fetching countries data:', error)
    return { countries: [], popularCountries: [] }
  }
}

