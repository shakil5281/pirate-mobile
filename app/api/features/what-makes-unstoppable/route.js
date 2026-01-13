import { NextResponse } from 'next/server'
import whatMakesUnstoppableData from '@/data/features/whatMakesUsUnstoppable.json'

export async function GET() {
  try {
    return NextResponse.json(whatMakesUnstoppableData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch what makes us unstoppable data' },
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

