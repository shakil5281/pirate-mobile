import { handleCorsOptions, corsJsonResponse } from '@/lib/utils/cors';
import { getCountriesData } from '@/lib/api/countries';

export const revalidate = 3600;
const CACHE_CONTROL_HEADER = 'public, s-maxage=3600, stale-while-revalidate=86400';

export async function GET() {
  try {
    const data = await getCountriesData();

    const transformedData = {
      countries: data.countries || [],
      popularCountries: data.popularCountries || [],
      metadata: data.metadata || {
        title: 'Countries | Pirate Mobile - eSIM Travel Connectivity',
        description: 'Connect globally in 190+ countries with Pirate Mobile eSIM. Fast, secure data with no roaming fees.',
      }
    };
    
    return corsJsonResponse(transformedData, {
      headers: {
        'Cache-Control': CACHE_CONTROL_HEADER,
      }
    });
  } catch (error) {
    console.error('Error fetching countries data:', error);
    return corsJsonResponse(
      { error: 'Failed to fetch countries data', message: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return handleCorsOptions();
}

