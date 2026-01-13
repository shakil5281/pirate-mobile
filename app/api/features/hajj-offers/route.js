import { NextResponse } from 'next/server';
import hajjOffersData from '@/data/features/hajjOffers.json';

export async function GET() {
  try {
    // Simulate a small delay to mimic real API behavior
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      success: true,
      data: hajjOffersData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching Hajj offers data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Hajj offers data',
        message: 'An error occurred while loading the features data'
      },
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