/**
 * Platform-specific utilities to help with cross-platform compatibility
 * between React web and React Native/Expo
 */

import { Platform, Dimensions } from 'react-native';

// Check if the app is running on web
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

// Get screen dimensions (responsive design helper)
export const getScreenDimensions = () => {
  return {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };
};

// Determine if the device is in portrait or landscape mode
export const isPortrait = () => {
  const { width, height } = getScreenDimensions();
  return height > width;
};

// Helper for platform-specific styles
export const platformStyles = (webStyles, nativeStyles) => {
  return isWeb ? webStyles : nativeStyles;
};

// Helper for platform-specific components
export const PlatformComponent = ({ web, native }) => {
  return isWeb ? web : native;
};

// Helper for handling touch vs mouse events
export const getTouchableProps = (props) => {
  if (isWeb) {
    const { onPress, ...rest } = props;
    return {
      onClick: onPress,
      ...rest,
    };
  }
  return props;
};

// Helper for handling different navigation behaviors
export const getNavigationConfig = () => {
  return {
    // Different animation types based on platform
    animation: isIOS ? 'default' : isAndroid ? 'slide_from_right' : 'fade',
    // Different header configurations
    headerConfig: {
      headerShown: true,
      headerTitleAlign: isIOS ? 'center' : 'left',
      ...(!isWeb && {
        headerBackVisible: true,
      }),
    },
  };
};

// Safe area insets fallback for web
export const getSafeAreaInsets = (insets) => {
  if (isWeb) {
    // Provide sensible defaults for web
    return {
      top: insets?.top || 0,
      right: insets?.right || 0,
      bottom: insets?.bottom || 0,
      left: insets?.left || 0,
    };
  }
  return insets;
};

// Helper to handle Expo Go specific configurations
export const isExpoGo = () => {
  // This is a simple check that works in many cases
  // For more accurate detection, you might need to use expo-constants
  return (
    !isWeb && 
    process.env.NODE_ENV !== 'production' && 
    !process.env.EXPO_PUBLIC_IS_PRODUCTION
  );
};

// Export a default configuration object for easy imports
export default {
  isWeb,
  isIOS,
  isAndroid,
  isMobile,
  getScreenDimensions,
  isPortrait,
  platformStyles,
  PlatformComponent,
  getTouchableProps,
  getNavigationConfig,
  getSafeAreaInsets,
  isExpoGo,
};
