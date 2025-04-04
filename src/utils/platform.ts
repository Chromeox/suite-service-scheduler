/**
 * Platform detection utilities for responsive design and platform-specific behavior
 */

/**
 * Platform types supported by the application
 */
interface PlatformInfo {
  isWeb: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isNative: boolean;
}

/**
 * Detects the current platform based on user agent and environment
 * @returns Object with platform detection flags
 */
export function getPlatformInfo(): PlatformInfo {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';
  
  if (!isBrowser) {
    // Default to web for SSR
    return {
      isWeb: true,
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isDesktop: true,
      isNative: false,
    };
  }

  const userAgent = navigator.userAgent || '';
  
  // Platform detection
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isMobile = isIOS || isAndroid || /Mobi/i.test(userAgent);
  const isDesktop = !isMobile;
  
  // Check if running in a native environment (Capacitor/Expo)
  const isNative = typeof (window as any).Capacitor !== 'undefined' || 
                  typeof (window as any).ExpoGo !== 'undefined' ||
                  typeof (window as any).__expo !== 'undefined';
  
  return {
    isWeb: !isNative,
    isIOS,
    isAndroid,
    isMobile,
    isDesktop,
    isNative,
  };
}

/**
 * Determines if the app is running in a development environment
 * @returns boolean indicating if in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Safe area insets for different platforms
 */
export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Gets default safe area insets based on platform
 * Note: For real apps, use react-native-safe-area-context instead
 * @returns Default safe area insets for the current platform
 */
export function getDefaultSafeAreaInsets(): SafeAreaInsets {
  const { isIOS, isMobile } = getPlatformInfo();
  
  if (!isMobile) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  
  // Default iOS insets (approximate)
  if (isIOS) {
    return { top: 44, right: 0, bottom: 34, left: 0 };
  }
  
  // Default Android insets (approximate)
  return { top: 24, right: 0, bottom: 0, left: 0 };
}
