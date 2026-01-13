import { NextResponse } from 'next/server';
import { getCountryConfig } from '@/lib/constants/countries';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    // Get country configuration
    const countryConfig = getCountryConfig(slug);

    // Prefer explicit endpoint from config when it already specifies a bundle group (special cases)
    const hasExplicitGroup = typeof countryConfig.apiEndpoint === 'string' && countryConfig.apiEndpoint.includes('bundleGroup=');
    const countrySlug = typeof slug === 'string' ? slug.toLowerCase() : countryConfig.slug;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';
  const endpoint = hasExplicitGroup
      ? countryConfig.apiEndpoint
      : `${apiBaseUrl}/e-sim/bundle?country=${encodeURIComponent(countrySlug)}&bundleGroup=${encodeURIComponent('Standard Fixed Unlimited Essential')}`;

    // Fetch bundle/data plans for specific country using the resolved endpoint with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(endpoint, {
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    // Suppress timeout errors in logs - they're common and expected
    if (error.name !== 'AbortError') {
      console.error('Error fetching bundle data:', error);
    }
    
    // Return cached data or fallback if available
    if (error.name === 'AbortError' || error.message === 'Request timeout') {
      return NextResponse.json(
        { 
          error: 'Request timeout', 
          message: 'API request took too long, please try again',
          cached: true 
        },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch bundle data', message: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}