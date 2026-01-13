import { NextResponse } from 'next/server'
import { handleCorsOptions, addCorsHeaders } from '@/lib/utils/cors'

// Timeout configuration
const IMAGE_TIMEOUT = 3000 // 3 seconds for slow-loading images
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

// Slow-loading domains that need special handling
const SLOW_DOMAINS = [
  'esimgo-cms-images-prod.s3.eu-west-1.amazonaws.com'
]

/**
 * Custom image proxy to handle timeout issues with external images
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')
  const quality = parseInt(searchParams.get('quality')) || 100
  const width = parseInt(searchParams.get('width'))
  const height = parseInt(searchParams.get('height'))

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 })
  }

  try {
    // Validate URL
    const url = new URL(imageUrl)
    
    // Only allow HTTPS URLs
    if (url.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTPS URLs are allowed' }, { status: 400 })
    }

    // Check if it's a slow-loading domain
    const isSlowDomain = SLOW_DOMAINS.includes(url.hostname)
    const timeout = isSlowDomain ? IMAGE_TIMEOUT : IMAGE_TIMEOUT * 2 // Give slow domains less time

    try {
      // Fetch the image with timeout using Promise.race
      const fetchPromise = fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
        },
      })
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      })
      
      const response = await Promise.race([fetchPromise, timeoutPromise])

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`)
      }

      // Check content type
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL does not point to an image')
      }

      // Check content length
      const contentLength = response.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > MAX_IMAGE_SIZE) {
        throw new Error('Image too large')
      }

      // Get image data
      const imageBuffer = await response.arrayBuffer()
      
      if (imageBuffer.byteLength > MAX_IMAGE_SIZE) {
        throw new Error('Image too large')
      }

      // Return the image with appropriate headers
      const cacheControl = isSlowDomain 
        ? 'public, max-age=86400, s-maxage=86400' // 24 hours for slow domains
        : 'public, max-age=31536000, immutable' // 1 year for fast domains

      const imageResponse = new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': imageBuffer.byteLength.toString(),
          'Cache-Control': cacheControl,
          'X-Image-Source': imageUrl,
          'X-Image-Proxy': 'true',
          'X-Slow-Domain': isSlowDomain ? 'true' : 'false',
        },
      })
      
      return addCorsHeaders(imageResponse)

    } catch (fetchError) {
      if (fetchError.message === 'Request timeout') {
        console.warn(`Image fetch timeout for: ${imageUrl}`)
        return NextResponse.json(
          { error: 'Image request timeout', url: imageUrl },
          { status: 408 }
        )
      }
      
      throw fetchError
    }

  } catch (error) {
    console.error('Image proxy error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch image',
        details: error.message,
        url: imageUrl
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return handleCorsOptions();
}
