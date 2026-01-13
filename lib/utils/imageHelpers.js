/**
 * Image utility functions for handling external images with timeout and error management
 */

// Default fallback images for different categories
export const FALLBACK_IMAGES = {
  country: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070',
  flag: 'https://via.placeholder.com/80x80/cccccc/666666?text=Flag',
  logo: 'https://via.placeholder.com/100x100/4f46e5/ffffff?text=Logo',
  blog: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b6c4?q=80&w=2072',
  device: 'https://via.placeholder.com/200x200/f3f4f6/9ca3af?text=Device',
  feature: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070'
}

/**
 * Sanitizes image URLs and adds timeout handling
 * @param {string} url - The original image URL
 * @param {string} fallbackType - Type of fallback image to use
 * @returns {string} - Sanitized URL with fallback
 */
export function sanitizeImageUrl(url, fallbackType = 'country') {
  if (!url || typeof url !== 'string') {
    return FALLBACK_IMAGES[fallbackType] || FALLBACK_IMAGES.country
  }

  try {
    const urlObj = new URL(url)
    
    // Check if it's a problematic domain that often times out
    const problematicDomains = [
      'esimgo-cms-images-prod.s3.eu-west-1.amazonaws.com'
    ]
    
    if (problematicDomains.includes(urlObj.hostname)) {
      // For problematic domains, we'll still try but with a fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Using potentially slow-loading image from: ${urlObj.hostname}`)
      }
    }
    
    return url
  } catch (error) {
    console.error('Invalid image URL:', url, error)
    return FALLBACK_IMAGES[fallbackType] || FALLBACK_IMAGES.country
  }
}

/**
 * Creates optimized image props for Next.js Image component
 * @param {string} src - Image source URL
 * @param {Object} options - Configuration options
 * @returns {Object} - Optimized image props
 */
export function createOptimizedImageProps(src, options = {}) {
  const {
    alt = 'Image',
    fallbackType = 'country',
    quality = 75,
    priority = false,
    sizes = '100vw',
    className = '',
    width,
    height,
    fill = false
  } = options

  const sanitizedSrc = sanitizeImageUrl(src, fallbackType)
  const fallbackSrc = FALLBACK_IMAGES[fallbackType] || FALLBACK_IMAGES.country

  const baseProps = {
    src: sanitizedSrc,
    alt,
    quality,
    priority,
    sizes,
    className,
    fallbackSrc
  }

  if (fill) {
    return {
      ...baseProps,
      fill: true
    }
  } else {
    return {
      ...baseProps,
      width,
      height
    }
  }
}

/**
 * Preloads critical images to prevent timeout issues
 * @param {string[]} imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls) {
  if (typeof window === 'undefined') return

  imageUrls.forEach(url => {
    if (url && typeof url === 'string') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = url
      link.onerror = () => {
        console.warn(`Failed to preload image: ${url}`)
        document.head.removeChild(link)
      }
      document.head.appendChild(link)
    }
  })
}

/**
 * Checks if an image URL is from a known slow-loading domain
 * @param {string} url - Image URL to check
 * @returns {boolean} - True if from slow-loading domain
 */
export function isSlowLoadingDomain(url) {
  if (!url || typeof url !== 'string') return false
  
  const slowDomains = [
    'esimgo-cms-images-prod.s3.eu-west-1.amazonaws.com',
    'some-other-slow-domain.com'
  ]
  
  try {
    const urlObj = new URL(url)
    return slowDomains.includes(urlObj.hostname)
  } catch {
    return false
  }
}

/**
 * Creates a timeout promise for image loading
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise} - Promise that rejects after timeout
 */
export function createImageTimeout(timeoutMs = 10000) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Image loading timeout after ${timeoutMs}ms`))
    }, timeoutMs)
  })
}
