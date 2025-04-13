import React, { ReactNode } from 'react';
import { typography, colors } from '@/styles/shared-theme';
import { useStyledTheme } from './theme-context';
import { getPlatformValue } from '@/utils/platform-utils';

interface TextProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  style?: React.CSSProperties;
}

export const Text = ({
  children,
  variant = 'body',
  color,
  align = 'left',
  weight,
  className = '',
  style = {},
}: TextProps) => {
  const { isDark, platformName } = useStyledTheme();
  
  // Default text color based on theme
  const defaultColor = isDark ? colors.text.dark.primary : colors.text.light.primary;
  
  // Get font size based on variant
  const getFontSize = () => {
    switch (variant) {
      case 'h1': return typography.fontSize['3xl'];
      case 'h2': return typography.fontSize['2xl'];
      case 'h3': return typography.fontSize.xl;
      case 'h4': return typography.fontSize.lg;
      case 'h5': return typography.fontSize.base;
      case 'h6': return typography.fontSize.sm;
      case 'body': return typography.fontSize.base;
      case 'caption': return typography.fontSize.sm;
      case 'label': return typography.fontSize.sm;
      default: return typography.fontSize.base;
    }
  };
  
  // Get font weight based on variant or explicit weight prop
  const getFontWeight = () => {
    if (weight) return typography.fontWeight[weight];
    
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4': return typography.fontWeight.bold;
      case 'h5':
      case 'h6': return typography.fontWeight.semibold;
      case 'label': return typography.fontWeight.medium;
      default: return typography.fontWeight.normal;
    }
  };
  
  // Get line height based on variant
  const getLineHeight = () => {
    switch (variant) {
      case 'h1':
      case 'h2': return typography.lineHeight.tight;
      default: return typography.lineHeight.normal;
    }
  };
  
  // Platform-specific adjustments
  const platformStyles = {
    fontFamily: getPlatformValue(
      typography.fontFamily.sans, // web
      platformName === 'ios' ? 'System' : 'Roboto', // mobile (iOS or Android)
    ),
  };
  
  const textStyles = {
    fontSize: getFontSize(),
    fontWeight: getFontWeight(),
    lineHeight: getLineHeight(),
    color: color || defaultColor,
    textAlign: align,
    ...platformStyles,
    ...style,
  };
  
  // Choose the appropriate HTML element based on variant
  const Component = (() => {
    switch (variant) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'h5': return 'h5';
      case 'h6': return 'h6';
      case 'caption': return 'span';
      case 'label': return 'label';
      default: return 'p';
    }
  })();
  
  return (
    <Component className={className} style={textStyles}>
      {children}
    </Component>
  );
};

export const Heading = (props: Omit<TextProps, 'variant'>) => (
  <Text {...props} variant="h1" />
);

export const Subheading = (props: Omit<TextProps, 'variant'>) => (
  <Text {...props} variant="h2" />
);

export const Title = (props: Omit<TextProps, 'variant'>) => (
  <Text {...props} variant="h3" />
);

export const Subtitle = (props: Omit<TextProps, 'variant'>) => (
  <Text {...props} variant="h4" />
);

export const BodyText = (props: Omit<TextProps, 'variant'>) => (
  <Text {...props} variant="body" />
);

export const Caption = (props: Omit<TextProps, 'variant'>) => (
  <Text {...props} variant="caption" />
);

export const Label = (props: Omit<TextProps, 'variant'>) => (
  <Text {...props} variant="label" />
);
