/**
 * Platform utilities to help with cross-platform styling and behavior
 * This module provides platform detection and utilities for responsive design
 * that work in both web and React Native environments
 */
import sharedTheme from '@/styles/shared-theme';

/**
 * Simple platform detection that works in both web and React Native environments
 */
type PlatformType = 'web' | 'ios' | 'android';

/**
 * Efficient platform detection with memoization
 * Only runs the detection logic once during the application lifecycle
 */
const detectPlatform = (): PlatformType => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // iOS detection
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    }
    
    // Android detection
    if (/android/.test(userAgent)) {
      return 'android';
    }
    
    // Default to web for browser environments
    return 'web';
  }
  
  // For server-side rendering, default to web
  return 'web';
};

// Module-level variable for memoization
let cachedPlatform: PlatformType | null = null;

/**
 * Get the current platform with memoization
 * This ensures the detection only runs once
 */
const getCurrentPlatform = (): PlatformType => {
  if (cachedPlatform === null) {
    cachedPlatform = detectPlatform();
  }
  return cachedPlatform;
};

// Current platform - detect once and cache the result
const currentPlatform = getCurrentPlatform();

/**
 * Check if the app is running in a web environment
 */
export const isWeb = currentPlatform === 'web';

/**
 * Check if the app is running on iOS
 */
export const isIOS = currentPlatform === 'ios';

/**
 * Check if the app is running on Android
 */
export const isAndroid = currentPlatform === 'android';

/**
 * Check if the app is running on a mobile device (iOS or Android)
 */
export const isMobile = isIOS || isAndroid;

/**
 * Get platform-specific styles with fallbacks
 * @param webStyles Styles for web platform
 * @param mobileStyles Styles for mobile platforms (iOS and Android)
 * @param iOSStyles iOS-specific styles (optional)
 * @param androidStyles Android-specific styles (optional)
 * @returns Platform-specific styles object
 */
export function getPlatformStyles<T>({
  webStyles,
  mobileStyles,
  iOSStyles,
  androidStyles,
}: {
  webStyles: T;
  mobileStyles: T;
  iOSStyles?: Partial<T>;
  androidStyles?: Partial<T>;
}): T {
  if (isWeb) {
    return webStyles;
  }
  
  if (isIOS && iOSStyles) {
    return { ...mobileStyles, ...iOSStyles };
  }
  
  if (isAndroid && androidStyles) {
    return { ...mobileStyles, ...androidStyles };
  }
  
  return mobileStyles;
}

/**
 * Get a platform-specific value
 * @param webValue Value for web platform
 * @param mobileValue Value for mobile platforms (iOS and Android)
 * @param iOSValue iOS-specific value (optional)
 * @param androidValue Android-specific value (optional)
 * @returns Platform-specific value
 */
export function getPlatformValue<T>(
  webValue: T,
  mobileValue: T,
  iOSValue?: T,
  androidValue?: T
): T {
  if (isWeb) {
    return webValue;
  }
  
  if (isIOS && iOSValue !== undefined) {
    return iOSValue;
  }
  
  if (isAndroid && androidValue !== undefined) {
    return androidValue;
  }
  
  return mobileValue;
}

/**
 * Get a responsive font size based on the platform
 * @param size Base font size from the theme
 * @param webScale Scale factor for web (default: 1)
 * @param mobileScale Scale factor for mobile (default: 1)
 * @returns Responsive font size string
 */
export function getResponsiveFontSize(
  size: keyof typeof sharedTheme.typography.fontSize,
  webScale = 1,
  mobileScale = 1
): string {
  const baseSize = sharedTheme.typography.fontSize[size];
  const numericSize = parseFloat(baseSize);
  
  if (isWeb) {
    return `${numericSize * webScale}rem`;
  }
  
  // For mobile, convert rem to pixels (assuming 1rem = 16px)
  return `${numericSize * 16 * mobileScale}px`;
}

export default {
  isWeb,
  isIOS,
  isAndroid,
  isMobile,
  getPlatformStyles,
  getPlatformValue,
  getResponsiveFontSize,
};
