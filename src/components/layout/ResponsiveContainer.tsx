import React, { ReactNode, CSSProperties } from 'react';
import { getPlatformStyles, isWeb, isMobile } from '@/utils/platform-utils';
import { breakpoints } from '@/styles/shared-theme';

interface ResponsiveContainerProps {
  children: ReactNode;
  maxWidth?: keyof typeof breakpoints | string;
  fullHeight?: boolean;
  centered?: boolean;
  className?: string;
}

/**
 * A responsive container that adapts to different screen sizes and platforms
 * Uses the shared theme breakpoints for consistent sizing
 */
function ResponsiveContainer({
  children,
  maxWidth = 'md',
  fullHeight = true,
  centered = true,
  className = '',
}: ResponsiveContainerProps) {
  // Get the max width value from breakpoints or use the provided string
  const maxWidthValue = typeof maxWidth === 'string' && maxWidth in breakpoints 
    ? breakpoints[maxWidth as keyof typeof breakpoints]
    : maxWidth;

  // Platform-specific styles
  const containerStyles = getPlatformStyles<CSSProperties>({
    webStyles: {
      maxWidth: maxWidthValue,
      width: '100%',
      margin: centered ? '0 auto' : undefined,
      height: fullHeight ? '100vh' : 'auto',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column' as 'column',
    },
    mobileStyles: {
      width: '100%',
      height: fullHeight ? '100%' : 'auto',
      flex: fullHeight ? 1 : undefined,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column' as 'column',
    },
  });

  // For web, we use a container div with max-width
  // For mobile, we use the full screen width
  if (isWeb) {
    return (
      <div 
        className={`responsive-container ${className}`}
        style={{
          ...containerStyles,
          boxShadow: isMobile ? 'none' : '0 0 10px rgba(0, 0, 0, 0.1)' as string,
          border: isMobile ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: isMobile ? '0' : '8px',
        }}
      >
        {children}
      </div>
    );
  }

  // For native mobile, just return the children with appropriate container
  return (
    <div 
      className={`responsive-container ${className}`}
      style={containerStyles}
    >
      {children}
    </div>
  );
}

export default ResponsiveContainer;
