import { NextResponse } from 'next/server';

/**
 * CORS configuration for API routes
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function handleCorsOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * Add CORS headers to any NextResponse
 */
export function addCorsHeaders(response) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Create a CORS-enabled JSON response
 */
export function corsJsonResponse(data, init = {}) {
  const response = NextResponse.json(data, init);
  return addCorsHeaders(response);
}
