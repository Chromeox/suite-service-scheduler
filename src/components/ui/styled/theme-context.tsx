import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { sharedTheme } from '@/styles/shared-theme';
import { isWeb, isIOS, isAndroid } from '@/utils/platform-utils';

interface ThemeContextType {
  theme: typeof sharedTheme;
  isDark: boolean;
  toggleTheme: () => void;
  platformName: 'web' | 'ios' | 'android';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: sharedTheme,
  isDark: false,
  toggleTheme: () => {},
  platformName: 'web',
});

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark';
}

export const StyledThemeProvider = ({ 
  children, 
  initialTheme = 'light' 
}: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(initialTheme === 'dark');
  
  // Determine platform
  const platformName = isIOS ? 'ios' : isAndroid ? 'android' : 'web';
  
  // Check system preference for dark mode
  useEffect(() => {
    if (isWeb) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
      };
      
      // Set initial value
      setIsDark(mediaQuery.matches);
      
      // Listen for changes
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);
  
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };
  
  return (
    <ThemeContext.Provider value={{ 
      theme: sharedTheme, 
      isDark, 
      toggleTheme,
      platformName
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useStyledTheme = () => useContext(ThemeContext);
