import { NextResponse } from 'next/server'
import { readJsonFromData } from '@/lib/data'

export async function GET() {
  try {
    const data = await readJsonFromData('data/metadata/download-app.json')
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error loading download-app data:', err)
    return NextResponse.json({ error: "Failed to load page" }, { status: 500 })
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