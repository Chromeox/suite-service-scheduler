import React, { ReactNode } from 'react';
import { colors, spacing, borderRadius, shadows, typography, animation } from '@/styles/shared-theme';
import { useStyledTheme } from './theme-context';
import { getPlatformValue } from '@/utils/platform-utils';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  className = '',
  style = {},
}: ButtonProps) => {
  const { isDark, platformName } = useStyledTheme();
  
  // Get padding based on size
  const getPadding = () => {
    switch (size) {
      case 'sm': return `${spacing[1]} ${spacing[3]}`;
      case 'lg': return `${spacing[3]} ${spacing[6]}`;
      default: return `${spacing[2]} ${spacing[4]}`;
    }
  };
  
  // Get font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'sm': return typography.fontSize.sm;
      case 'lg': return typography.fontSize.lg;
      default: return typography.fontSize.base;
    }
  };
  
  // Get styles based on variant and theme
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? colors.neutral[400] : colors.primary[500],
          color: colors.neutral[50],
          border: 'none',
          boxShadow: shadows.sm,
          ':hover': {
            backgroundColor: colors.primary[600],
          },
          ':active': {
            backgroundColor: colors.primary[700],
          },
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? colors.neutral[300] : colors.secondary[500],
          color: colors.neutral[50],
          border: 'none',
          boxShadow: shadows.sm,
          ':hover': {
            backgroundColor: colors.secondary[600],
          },
          ':active': {
            backgroundColor: colors.secondary[700],
          },
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: disabled ? colors.neutral[400] : isDark ? colors.primary[300] : colors.primary[500],
          border: `1px solid ${disabled ? colors.neutral[400] : isDark ? colors.primary[300] : colors.primary[500]}`,
          ':hover': {
            backgroundColor: isDark ? 'rgba(24, 144, 255, 0.1)' : 'rgba(24, 144, 255, 0.05)',
          },
          ':active': {
            backgroundColor: isDark ? 'rgba(24, 144, 255, 0.2)' : 'rgba(24, 144, 255, 0.1)',
          },
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: disabled ? colors.neutral[400] : isDark ? colors.primary[300] : colors.primary[500],
          border: 'none',
          ':hover': {
            backgroundColor: isDark ? 'rgba(24, 144, 255, 0.1)' : 'rgba(24, 144, 255, 0.05)',
          },
          ':active': {
            backgroundColor: isDark ? 'rgba(24, 144, 255, 0.2)' : 'rgba(24, 144, 255, 0.1)',
          },
        };
      case 'link':
        return {
          backgroundColor: 'transparent',
          color: disabled ? colors.neutral[400] : isDark ? colors.primary[300] : colors.primary[500],
          border: 'none',
          padding: 0,
          boxShadow: 'none',
          textDecoration: 'underline',
          ':hover': {
            textDecoration: 'none',
          },
        };
      default:
        return {};
    }
  };
  
  // Platform-specific adjustments
  const platformStyles = {
    // iOS buttons often have more rounded corners
    borderRadius: getPlatformValue(
      borderRadius.md,
      platformName === 'ios' ? borderRadius.lg : borderRadius.md
    ),
    // Android buttons often have a ripple effect, which we can't replicate with CSS alone
    // but we can adjust other properties
    fontFamily: getPlatformValue(
      typography.fontFamily.sans,
      platformName === 'ios' ? 'System' : 'Roboto'
    ),
  };
  
  const buttonStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: getPadding(),
    fontSize: getFontSize(),
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${animation.durations.normal} ${animation.easings.easeInOut}`,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    ...getVariantStyles(),
    ...platformStyles,
    ...style,
  };
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      style={buttonStyles}
    >
      {leftIcon && <span style={{ marginRight: spacing[2] }}>{leftIcon}</span>}
      {children}
      {rightIcon && <span style={{ marginLeft: spacing[2] }}>{rightIcon}</span>}
    </button>
  );
};

interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: ReactNode;
  ariaLabel: string;
}

export const IconButton = ({
  icon,
  ariaLabel,
  size = 'md',
  ...rest
}: IconButtonProps) => {
  // Get size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'sm': return spacing[4];
      case 'lg': return spacing[6];
      default: return spacing[5];
    }
  };
  
  // Get padding based on button size
  const getPadding = () => {
    switch (size) {
      case 'sm': return spacing[1];
      case 'lg': return spacing[3];
      default: return spacing[2];
    }
  };
  
  const iconButtonStyles: React.CSSProperties = {
    padding: getPadding(),
    width: 'auto',
    height: 'auto',
    minWidth: getIconSize(),
    minHeight: getIconSize(),
  };
  
  return (
    <Button
      size={size}
      aria-label={ariaLabel}
      {...rest}
      style={{ ...iconButtonStyles, ...rest.style }}
    >
      {icon}
    </Button>
  );
};
