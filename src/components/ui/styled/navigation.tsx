import React, { ReactNode } from 'react';
import { colors, spacing, borderRadius, shadows, typography, zIndex } from '@/styles/shared-theme';
import { useStyledTheme } from './theme-context';
import { Container, Flex, SafeArea } from './containers';
import { Text } from './typography';
import { IconButton } from './buttons';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  transparent?: boolean;
  fixed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Header = ({
  title,
  leftElement,
  rightElement,
  showBackButton = false,
  onBack,
  transparent = false,
  fixed = true,
  className = '',
  style = {},
}: HeaderProps) => {
  const { isDark } = useStyledTheme();
  const navigate = useNavigate();
  
  // Theme-based styles
  const bgColor = transparent 
    ? 'transparent' 
    : isDark ? colors.neutral[800] : colors.neutral[50];
  const borderColor = isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)';
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  
  const headerStyles: React.CSSProperties = {
    backgroundColor: bgColor,
    borderBottomWidth: transparent ? 0 : 1,
    borderBottomStyle: 'solid',
    borderBottomColor: borderColor,
    boxShadow: transparent ? 'none' : shadows.sm,
    position: fixed ? 'sticky' : 'relative',
    top: 0,
    zIndex: zIndex.sticky,
    width: '100%',
    ...style,
  };
  
  return (
    <SafeArea 
      top
      left
      right
      bottom={false}
      className={`header ${className}`}
      style={headerStyles}
    >
      <Flex 
        justify="between" 
        align="center"
        padding={4}
      >
        <Flex align="center">
          {showBackButton && (
            <IconButton
              icon={<ArrowLeft size={20} />}
              variant="ghost"
              size="sm"
              ariaLabel="Go back"
              onClick={handleBack}
              style={{ marginRight: spacing[2] }}
            />
          )}
          {leftElement}
        </Flex>
        
        <Text 
          variant="h3"
          align="center"
          weight="bold"
        >
          {title}
        </Text>
        
        <Flex align="center">
          {rightElement || <div style={{ width: leftElement || showBackButton ? 24 : 0 }} />}
        </Flex>
      </Flex>
    </SafeArea>
  );
};

interface TabBarItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

export const TabBarItem = ({
  icon,
  label,
  to,
  active = false,
  onClick,
}: TabBarItemProps) => {
  const { isDark } = useStyledTheme();
  const navigate = useNavigate();
  
  // Theme-based styles
  const activeColor = colors.primary[500];
  const inactiveColor = isDark 
    ? colors.text.dark.secondary 
    : colors.text.light.secondary;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: '100%',
        color: active ? activeColor : inactiveColor,
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      <Text
        variant="caption"
        style={{ marginTop: spacing[1] }}
      >
        {label}
      </Text>
    </button>
  );
};

interface TabBarProps {
  items: TabBarItemProps[];
  className?: string;
  style?: React.CSSProperties;
}

export const TabBar = ({
  items,
  className = '',
  style = {},
}: TabBarProps) => {
  const { isDark } = useStyledTheme();
  const location = useLocation();
  
  // Theme-based styles
  const bgColor = isDark ? colors.neutral[800] : colors.neutral[50];
  const borderColor = isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)';
  
  const tabBarStyles: React.CSSProperties = {
    backgroundColor: bgColor,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: borderColor,
    boxShadow: shadows.sm,
    position: 'sticky',
    bottom: 0,
    zIndex: zIndex.sticky,
    width: '100%',
    height: spacing[16],
    ...style,
  };
  
  return (
    <SafeArea
      top={false}
      left
      right
      bottom
      className={`tab-bar ${className}`}
      style={tabBarStyles}
    >
      <Flex 
        justify="around" 
        align="center"
        style={{ height: '100%' }}
      >
        {items.map((item, index) => (
          <TabBarItem
            key={index}
            {...item}
            active={location.pathname === item.to || item.active}
          />
        ))}
      </Flex>
    </SafeArea>
  );
};

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  hideNavBar?: boolean;
  navItems?: TabBarItemProps[];
  headerLeftElement?: ReactNode;
  headerRightElement?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MobileLayout = ({
  children,
  title = 'SuiteSync',
  showBackButton = false,
  onBack,
  hideNavBar = false,
  navItems,
  headerLeftElement,
  headerRightElement,
  className = '',
  style = {},
}: MobileLayoutProps) => {
  const { isDark } = useStyledTheme();
  
  // Default navigation items if not provided
  const defaultNavItems = [
    {
      icon: <Home size={24} />,
      label: 'Home',
      to: '/mobile',
    },
    {
      icon: <Info size={24} />,
      label: 'About',
      to: '/mobile/about',
    },
    {
      icon: <Settings size={24} />,
      label: 'Settings',
      to: '/mobile/settings',
    },
  ];
  
  // Use provided nav items or default ones
  const navigationItems = navItems || defaultNavItems;
  
  // Theme-based styles
  const bgColor = isDark ? colors.background.dark : colors.background.light;
  
  return (
    <Container
      className={`mobile-layout ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: bgColor,
        ...style,
      }}
    >
      <Header
        title={title}
        showBackButton={showBackButton}
        onBack={onBack}
        leftElement={headerLeftElement}
        rightElement={headerRightElement}
      />
      
      <Container
        className="mobile-content"
        style={{
          flex: 1,
          overflow: 'auto',
          padding: spacing[4],
        }}
      >
        {children}
      </Container>
      
      {!hideNavBar && (
        <TabBar items={navigationItems} />
      )}
    </Container>
  );
};

// Import these at the top of the file
import { Home, Info, Settings } from 'lucide-react';
