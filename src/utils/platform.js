import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

export const isExpoGo = () => {
  return (
    !isWeb && 
    process.env.NODE_ENV !== 'production' && 
    !process.env.EXPO_PUBLIC_IS_PRODUCTION
  );
};

export default {
  isWeb,
  isIOS,
  isAndroid,
  isMobile,
  isExpoGo,
};
