/**
 * Deep linking utilities for SuiteSync
 * Enables seamless navigation between web and mobile views
 */
import { useNavigate } from 'react-router-dom';
import { isWeb, isMobile } from './platform-utils';

// Define route mappings between web and mobile
interface RouteMapping {
  web: string;
  mobile: string;
}

// Route mappings for common paths
const routeMappings: Record<string, RouteMapping> = {
  home: {
    web: '/dashboard',
    mobile: '/mobile',
  },
  settings: {
    web: '/settings',
    mobile: '/mobile/settings',
  },
  about: {
    web: '/about',
    mobile: '/mobile/about',
  },
  // Add more route mappings as needed
};

/**
 * Get the corresponding route for the current platform
 * @param routeKey The key for the route mapping
 * @returns The platform-specific route
 */
export function getRouteForPlatform(routeKey: string): string {
  if (!routeMappings[routeKey]) {
    console.warn(`No route mapping found for key: ${routeKey}`);
    return '/';
  }

  return isWeb && !window.location.pathname.includes('/mobile')
    ? routeMappings[routeKey].web
    : routeMappings[routeKey].mobile;
}

/**
 * Hook for navigating between platforms
 * @returns Navigation utilities
 */
export function useDeepLinking() {
  const navigate = useNavigate();

  /**
   * Navigate to a route based on the current platform
   * @param routeKey The key for the route mapping
   * @param params Optional params to append to the URL
   */
  const navigateToRoute = (routeKey: string, params?: Record<string, string>) => {
    const route = getRouteForPlatform(routeKey);
    
    // Add query params if provided
    let finalRoute = route;
    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      finalRoute = `${route}?${queryString}`;
    }
    
    navigate(finalRoute);
  };

  /**
   * Switch between web and mobile views while maintaining context
   * @param forceMobile Force switch to mobile view
   */
  const switchPlatformView = (forceMobile?: boolean) => {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    
    // Determine if we're switching to mobile or web
    const switchToMobile = forceMobile !== undefined ? forceMobile : !currentPath.includes('/mobile');
    
    if (switchToMobile) {
      // Web to mobile
      if (currentPath === '/' || currentPath === '/dashboard') {
        navigate('/mobile');
      } else if (currentPath === '/settings') {
        navigate('/mobile/settings');
      } else if (currentPath === '/about') {
        navigate('/mobile/about');
      } else {
        // Default to mobile home if no specific mapping
        navigate('/mobile');
      }
    } else {
      // Mobile to web
      if (currentPath === '/mobile') {
        navigate('/dashboard');
      } else if (currentPath === '/mobile/settings') {
        navigate('/settings');
      } else if (currentPath === '/mobile/about') {
        navigate('/about');
      } else {
        // Default to web home if no specific mapping
        navigate('/dashboard');
      }
    }
  };

  /**
   * Generate a deep link URL for sharing
   * @param routeKey The key for the route mapping
   * @param params Optional params to append to the URL
   * @returns The deep link URL
   */
  const generateDeepLink = (routeKey: string, params?: Record<string, string>): string => {
    const baseUrl = window.location.origin;
    const route = getRouteForPlatform(routeKey);
    
    // Add query params if provided
    let finalRoute = route;
    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      finalRoute = `${route}?${queryString}`;
    }
    
    return `${baseUrl}${finalRoute}`;
  };

  return {
    navigateToRoute,
    switchPlatformView,
    generateDeepLink,
  };
}

export default useDeepLinking;
