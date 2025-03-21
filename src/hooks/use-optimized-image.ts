import { useState, useEffect } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
}

interface OptimizedImageOptions {
  placeholder?: string;
  loadingStrategy?: 'eager' | 'lazy';
  quality?: number;
  dimensions?: ImageDimensions;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
}

/**
 * A hook for optimized image loading with support for lazy loading,
 * placeholder images, and modern image formats.
 * 
 * @param src The source URL of the image
 * @param options Configuration options for image optimization
 * @returns Object containing optimized image properties and loading state
 */
export function useOptimizedImage(
  src: string,
  options: OptimizedImageOptions = {}
) {
  const {
    placeholder = '',
    loadingStrategy = 'lazy',
    quality = 80,
    dimensions,
    format
  } = options;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [optimizedSrc, setOptimizedSrc] = useState(placeholder || src);
  
  useEffect(() => {
    // Reset state when source changes
    setIsLoaded(false);
    setError(null);
    
    if (!src) {
      setOptimizedSrc(placeholder);
      return;
    }
    
    // For demo purposes, we're just simulating image optimization
    // In a real app, you would use an image optimization service or CDN
    const optimizeImage = async () => {
      try {
        // Simulate network delay for image optimization
        if (process.env.NODE_ENV === 'development') {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // In a real implementation, you would transform the URL to use
        // an image optimization service like Cloudinary, Imgix, etc.
        // For now, we'll just use the original source
        let optimized = src;
        
        // Apply query parameters for optimization if needed
        const params = new URLSearchParams();
        
        if (quality && quality < 100) {
          params.append('q', quality.toString());
        }
        
        if (dimensions) {
          params.append('w', dimensions.width.toString());
          params.append('h', dimensions.height.toString());
        }
        
        if (format && !src.endsWith(`.${format}`)) {
          params.append('fm', format);
        }
        
        // Add query parameters if any were set
        if (params.toString()) {
          optimized += (src.includes('?') ? '&' : '?') + params.toString();
        }
        
        // Create a new image to preload
        const img = new Image();
        
        img.onload = () => {
          setOptimizedSrc(optimized);
          setIsLoaded(true);
        };
        
        img.onerror = () => {
          setError(new Error('Failed to load image'));
          // Fall back to the original source or placeholder
          setOptimizedSrc(placeholder || src);
        };
        
        img.src = optimized;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setOptimizedSrc(placeholder || src);
      }
    };
    
    optimizeImage();
  }, [src, placeholder, quality, dimensions, format]);
  
  return {
    src: optimizedSrc,
    isLoaded,
    error,
    loading: loadingStrategy,
    // Additional props for the img element
    imgProps: {
      src: optimizedSrc,
      loading: loadingStrategy,
      ...(dimensions && {
        width: dimensions.width,
        height: dimensions.height
      })
    }
  };
}
