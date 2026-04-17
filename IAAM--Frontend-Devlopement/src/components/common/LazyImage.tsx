'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface LazyImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallback?: string
  containerClassName?: string
  priority?: boolean
}

export default function LazyImage({
  fallback = '/placeholder.png',
  containerClassName = '',
  className = '',
  priority = false,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // If there's an error, show fallback
  if (hasError) {
    return (
      <div className={`relative overflow-hidden ${containerClassName} ${props.fill ? 'w-full h-full' : ''}`}>
        <div className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${props.fill ? 'w-full h-full' : ''}`}>
          <span className="text-gray-500 text-sm">Image not available</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName} ${props.fill ? 'w-full h-full' : ''}`}>
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${props.fill ? 'w-full h-full' : ''}`}>
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        {...props}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        unoptimized={props.src?.toString().includes('.gif') || false}
      />
    </div>
  )
}
