/**
 * Enhanced platform detection utilities
 */
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Basic platform detection
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Expo environment detection
export const isExpo = Constants?.executionEnvironment === 'storeClient' || 
                      Constants?.executionEnvironment === 'standalone';
export const isExpoGo = Constants?.executionEnvironment === 'storeClient';
export const isExpoWeb = isWeb && (typeof Constants !== 'undefined');

// Detailed environment reporting
export const getEnvironmentInfo = () => {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    isExpo,
    isExpoGo,
    isExpoWeb,
    isDevelopment,
    isProduction,
    constants: Constants,
  };
};

export default {
  isWeb,
  isIOS,
  isAndroid,
  isMobile,
  isDevelopment,
  isProduction,
  isExpo,
  isExpoGo,
  isExpoWeb,
  getEnvironmentInfo,
};
