import React, { ReactNode, useEffect, useState } from 'react';
import { getPlatformInfo } from '@/utils/platform';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: number;
}

/**
 * A responsive container that adapts to different screen sizes and platforms
 * Provides proper constraints for mobile and desktop views
 */
export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 640, // Default max width for mobile-like experience
}: ResponsiveContainerProps) {
  const [width, setWidth] = useState<number>(0);
  const { isMobile } = getPlatformInfo();
  
  useEffect(() => {
    // Set initial width
    setWidth(window.innerWidth);
    
    // Update width on resize
    function handleResize() {
      setWidth(window.innerWidth);
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate container style based on screen width and platform
  const containerStyle = {
    maxWidth: `${maxWidth}px`,
    width: '100%',
    margin: '0 auto',
    // On desktop with larger screens, add a subtle border to create a phone-like container
    // when viewing mobile components
    ...(width > maxWidth && !isMobile ? {
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden',
      height: 'calc(100vh - 40px)',
      marginTop: '20px',
      marginBottom: '20px',
    } : {})
  };
  
  return (
    <div style={containerStyle} className={className}>
      {children}
    </div>
  );
}

export default ResponsiveContainer;
