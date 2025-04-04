import React from 'react';
import { Button } from '@/components/ui/button';
import { useDeepLinking } from '@/utils/deep-linking';
import { isWeb, isMobile } from '@/utils/platform-utils';
import { colors, spacing, typography, borderRadius } from '@/styles/shared-theme';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Smartphone, Monitor } from 'lucide-react';

interface PlatformSwitcherProps {
  className?: string;
  compact?: boolean;
}

/**
 * PlatformSwitcher component
 * Allows users to switch between web and mobile views
 */
export function PlatformSwitcher({ className = '', compact = false }: PlatformSwitcherProps) {
  const { switchPlatformView } = useDeepLinking();
  const { isDark } = useTheme();
  
  // Determine current platform
  const currentPlatform = isWeb && !window.location.pathname.includes('/mobile') ? 'web' : 'mobile';
  
  // Theme-based styles
  const backgroundColor = isDark ? colors.neutral[800] : colors.neutral[50];
  const textColor = isDark ? colors.text.dark.primary : colors.text.light.primary;
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const activeColor = colors.primary[500];
  const inactiveColor = isDark ? colors.neutral[600] : colors.neutral[300];
  
  // Handle platform switch
  const handleSwitchPlatform = () => {
    switchPlatformView(currentPlatform === 'web');
  };
  
  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSwitchPlatform}
        className={className}
        title={`Switch to ${currentPlatform === 'web' ? 'mobile' : 'web'} view`}
      >
        {currentPlatform === 'web' ? (
          <Smartphone className="h-5 w-5" />
        ) : (
          <Monitor className="h-5 w-5" />
        )}
      </Button>
    );
  }
  
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor,
        padding: spacing[2],
        borderRadius: borderRadius.md,
        border: `1px solid ${borderColor}`,
      }}
    >
      <button
        onClick={() => switchPlatformView(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          padding: `${spacing[2]} ${spacing[3]}`,
          borderRadius: borderRadius.sm,
          backgroundColor: currentPlatform === 'web' ? (isDark ? colors.neutral[700] : colors.neutral[200]) : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: textColor,
          fontWeight: currentPlatform === 'web' ? typography.fontWeight.medium : typography.fontWeight.normal,
        }}
      >
        <Monitor style={{ color: currentPlatform === 'web' ? activeColor : inactiveColor }} size={16} />
        <span>Web</span>
      </button>
      
      <button
        onClick={() => switchPlatformView(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          padding: `${spacing[2]} ${spacing[3]}`,
          borderRadius: borderRadius.sm,
          backgroundColor: currentPlatform === 'mobile' ? (isDark ? colors.neutral[700] : colors.neutral[200]) : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: textColor,
          fontWeight: currentPlatform === 'mobile' ? typography.fontWeight.medium : typography.fontWeight.normal,
        }}
      >
        <Smartphone style={{ color: currentPlatform === 'mobile' ? activeColor : inactiveColor }} size={16} />
        <span>Mobile</span>
      </button>
    </div>
  );
}

export default PlatformSwitcher;
