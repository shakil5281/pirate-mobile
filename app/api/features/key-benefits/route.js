import { NextResponse } from 'next/server'
import keyBenefitsData from '@/data/features/keyBenefitsFeatures.json'

export async function GET() {
  try {
    return NextResponse.json(keyBenefitsData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch key benefits data' },
      { status: 500 }
    )
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