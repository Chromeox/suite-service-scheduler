import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Info, Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import ResponsiveContainer from '@/components/layout/ResponsiveContainer';
import { isWeb, isMobile, getPlatformStyles } from '@/utils/platform-utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import { colors, typography, spacing, borderRadius, shadows, zIndex } from '@/styles/shared-theme';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  hideNavBar?: boolean;
  headerClassName?: string;
  contentClassName?: string;
}

function MobileLayout({ 
  children, 
  title, 
  showBackButton = false,
  onBack,
  hideNavBar = false,
  headerClassName = '',
  contentClassName = ''
}: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [safeAreaTop, setSafeAreaTop] = useState('0px');
  const [safeAreaBottom, setSafeAreaBottom] = useState('0px');
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Set meta viewport for mobile devices
  useEffect(() => {
    if (isWeb) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      }
      
      // Set safe area insets
      if (isMobile) {
        // Get safe area insets from CSS environment variables if available
        const computedStyle = getComputedStyle(document.documentElement);
        const topInset = computedStyle.getPropertyValue('--sat') || '0px';
        const bottomInset = computedStyle.getPropertyValue('--sab') || '0px';
        
        setSafeAreaTop(topInset);
        setSafeAreaBottom(bottomInset);
        
        // Add CSS variables for safe areas
        document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top, 0px)');
        document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom, 0px)');
      }
      
      return () => {
        // Reset viewport when unmounting
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1');
        }
      };
    }
  }, []);
  
  // Get theme-based styles
  const bgColor = isDark ? colors.background.dark : colors.background.light;
  const textColor = isDark 
    ? colors.text.dark.primary 
    : colors.text.light.primary;
  const borderColor = isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)';
  
  return (
    <ResponsiveContainer maxWidth="sm">
      <div 
        className="flex flex-col min-h-screen"
        style={{ 
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {/* Header */}
        <header 
          className={`sticky top-0 z-10 border-b ${headerClassName}`}
          style={{ 
            backgroundColor: isDark ? colors.neutral[800] : colors.neutral[50],
            borderColor: borderColor,
            padding: spacing[4],
            paddingTop: `calc(${spacing[4]} + ${safeAreaTop})`,
            boxShadow: shadows.sm
          }}
        >
          <div className="flex items-center justify-between">
            {showBackButton && (
              <button 
                onClick={handleBack}
                style={{ 
                  padding: spacing[1],
                  borderRadius: borderRadius.full,
                  color: colors.primary[500]
                }}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 
              className={`font-bold ${showBackButton ? '' : 'text-center w-full'}`}
              style={{ 
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold
              }}
            >
              {title || 'SuiteSync'}
            </h1>
            {showBackButton && <div style={{ width: spacing[6] }} />} {/* Spacer for alignment */}
          </div>
        </header>
        
        {/* Main Content */}
        <main 
          className={`flex-1 overflow-auto ${contentClassName}`}
          style={{ padding: spacing[4] }}
        >
          {children}
        </main>
        
        {/* Bottom Navigation */}
        {!hideNavBar && (
          <nav 
            className="sticky bottom-0 z-10 border-t"
            style={{ 
              backgroundColor: isDark ? colors.neutral[800] : colors.neutral[50],
              borderColor: borderColor,
              paddingBottom: safeAreaBottom,
              boxShadow: shadows.sm
            }}
          >
            <div className="flex justify-around items-center" style={{ height: spacing[16] }}>
              <button 
                onClick={() => navigate('/mobile')}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '33.333%',
                  height: '100%',
                  color: isActive('/mobile') 
                    ? colors.primary[500] 
                    : isDark ? colors.text.dark.secondary : colors.text.light.secondary
                }}
              >
                <Home size={24} />
                <span style={{ 
                  fontSize: typography.fontSize.xs,
                  marginTop: spacing[1]
                }}>Home</span>
              </button>
              
              <button 
                onClick={() => navigate('/mobile/about')}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '33.333%',
                  height: '100%',
                  color: isActive('/mobile/about') 
                    ? colors.primary[500] 
                    : isDark ? colors.text.dark.secondary : colors.text.light.secondary
                }}
              >
                <Info size={24} />
                <span style={{ 
                  fontSize: typography.fontSize.xs,
                  marginTop: spacing[1]
                }}>About</span>
              </button>
              
              <button 
                onClick={() => navigate('/mobile/settings')}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '33.333%',
                  height: '100%',
                  color: isActive('/mobile/settings') 
                    ? colors.primary[500] 
                    : isDark ? colors.text.dark.secondary : colors.text.light.secondary
                }}
              >
                <SettingsIcon size={24} />
                <span style={{ 
                  fontSize: typography.fontSize.xs,
                  marginTop: spacing[1]
                }}>Settings</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </ResponsiveContainer>
  );
}

export default MobileLayout;
