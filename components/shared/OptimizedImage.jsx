'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { isSlowLoadingDomain } from '@/lib/utils/imageHelpers'
import ImageErrorBoundary from './ImageErrorBoundary'

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
  sizes,
  quality = 100,
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
  fallbackSrc = '/placeholder.jpg',
  fallbackType,
  onError,
  onLoad,
  ...props
}) => {
  // Determine if we should use the image proxy for slow-loading domains
  const shouldUseProxy = isSlowLoadingDomain(src)
  // Ensure quality is one of the configured values
  const validQuality = [75, 80, 85, 90, 95, 100].includes(quality) ? quality : 80
  const proxySrc = shouldUseProxy 
    ? `/api/image-proxy?url=${encodeURIComponent(src)}&quality=${validQuality}${width ? `&width=${width}` : ''}${height ? `&height=${height}` : ''}`
    : src

  // For slow-loading domains, use a more aggressive fallback strategy
  const isSlowDomain = isSlowLoadingDomain(src)

  const [imageSrc, setImageSrc] = useState(proxySrc)
  const [isLoading, setIsLoading] = useState(false) // Start with false to avoid opacity issues
  const [hasError, setHasError] = useState(false)

  // Update imageSrc when src prop changes
  useEffect(() => {
    const shouldUseProxy = isSlowLoadingDomain(src)
    const validQuality = [75, 80, 85, 90, 95, 100].includes(quality) ? quality : 80
    const newProxySrc = shouldUseProxy 
      ? `/api/image-proxy?url=${encodeURIComponent(src)}&quality=${validQuality}${width ? `&width=${width}` : ''}${height ? `&height=${height}` : ''}`
      : src
    
    console.log('OptimizedImage Debug:', {
      originalSrc: src,
      shouldUseProxy,
      newProxySrc,
      validQuality
    })
    
    setImageSrc(newProxySrc)
    setHasError(false)
    setIsLoading(false)
  }, [src, quality, width, height])

  const handleError = (error) => {
    console.warn(`Image failed to load: ${imageSrc}`, error)
    
    // Try original image if proxy failed
    if (imageSrc.includes('/api/image-proxy') && imageSrc !== src) {
      console.log('Trying original image after proxy failure')
      setImageSrc(src)
      return
    }
    
    // Try fallback image if current image fails
    if (imageSrc !== fallbackSrc) {
      console.log('Trying fallback image')
      setImageSrc(fallbackSrc)
      return
    }
    
    setHasError(true)
    setIsLoading(false)
    
    // Call custom error handler if provided
    if (onError) {
      onError(error)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
    
    // Call custom load handler if provided
    if (onLoad) {
      onLoad()
    }
  }

  // If we're using fill prop, we don't need width/height
  const imageProps = fill 
    ? {
        fill,
        className: cn(
          'object-cover',
          className
        ),
        ...props
      }
    : {
        width,
        height,
        className: cn(
          className
        ),
        ...props
      }

  return (
    <ImageErrorBoundary className={className}>
      <div className={cn('relative', !fill && 'inline-block')}>
        <Image
          src={imageSrc}
          alt={alt}
          priority={priority}
          sizes={sizes}
          quality={validQuality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onError={handleError}
          onLoad={handleLoad}
          {...imageProps}
        />
        
        {/* Loading state */}
        {isLoading && (
          <div className={cn(
            'absolute inset-0 flex items-center justify-center bg-gray-100',
            'animate-pulse'
          )}>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        )}
        
        {/* Error state */}
        {hasError && imageSrc === fallbackSrc && (
          <div className={cn(
            'absolute inset-0 flex items-center justify-center bg-gray-100',
            'text-gray-400 text-sm'
          )}>
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <span>Image unavailable</span>
            </div>
          </div>
        )}
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-1 left-1 bg-black bg-opacity-75 text-white text-xs p-1 rounded">
            {imageSrc.includes('/api/image-proxy') ? 'Proxy' : 'Direct'}
          </div>
        )}
      </div>
    </ImageErrorBoundary>
  )
}

export default OptimizedImage
