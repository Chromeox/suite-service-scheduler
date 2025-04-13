import React, { ReactNode } from 'react';
import { spacing, borderRadius, shadows, colors } from '@/styles/shared-theme';
import { useStyledTheme } from './theme-context';
import { isWeb } from '@/utils/platform-utils';

interface ContainerProps {
  children: ReactNode;
  padding?: keyof typeof spacing;
  margin?: keyof typeof spacing;
  width?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
  height?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: keyof typeof borderRadius;
  shadow?: keyof typeof shadows;
  className?: string;
  style?: React.CSSProperties;
}

export const Container = ({
  children,
  padding = 4,
  margin,
  width,
  maxWidth,
  height,
  backgroundColor,
  borderColor,
  borderWidth,
  borderRadius: borderRadiusKey = 'none',
  shadow = 'none',
  className = '',
  style = {},
}: ContainerProps) => {
  const { isDark } = useStyledTheme();
  
  // Default background color based on theme
  const defaultBgColor = isDark ? colors.background.dark : colors.background.light;
  
  // Convert maxWidth to actual value
  const getMaxWidth = () => {
    if (!maxWidth) return undefined;
    
    switch (maxWidth) {
      case 'sm': return '640px';
      case 'md': return '768px';
      case 'lg': return '1024px';
      case 'xl': return '1280px';
      case 'full': return '100%';
      default: return maxWidth;
    }
  };
  
  const containerStyles: React.CSSProperties = {
    padding: spacing[padding],
    margin: margin ? spacing[margin] : undefined,
    width: width,
    maxWidth: getMaxWidth(),
    height: height,
    backgroundColor: backgroundColor || defaultBgColor,
    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: borderRadius[borderRadiusKey],
    boxShadow: shadows[shadow],
    ...style,
  };
  
  return (
    <div className={className} style={containerStyles}>
      {children}
    </div>
  );
};

interface FlexProps extends ContainerProps {
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: 'nowrap' | 'wrap';
  gap?: keyof typeof spacing;
}

export const Flex = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = 'nowrap',
  gap,
  ...rest
}: FlexProps) => {
  // Convert justify value to CSS value
  const getJustifyContent = () => {
    switch (justify) {
      case 'start': return 'flex-start';
      case 'center': return 'center';
      case 'end': return 'flex-end';
      case 'between': return 'space-between';
      case 'around': return 'space-around';
      case 'evenly': return 'space-evenly';
      default: return 'flex-start';
    }
  };
  
  // Convert align value to CSS value
  const getAlignItems = () => {
    switch (align) {
      case 'start': return 'flex-start';
      case 'center': return 'center';
      case 'end': return 'flex-end';
      case 'stretch': return 'stretch';
      default: return 'flex-start';
    }
  };
  
  const flexStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    justifyContent: getJustifyContent(),
    alignItems: getAlignItems(),
    flexWrap: wrap,
    gap: gap ? spacing[gap] : undefined,
  };
  
  return (
    <Container {...rest} style={{ ...flexStyles, ...rest.style }}>
      {children}
    </Container>
  );
};

interface GridProps extends ContainerProps {
  columns?: number | string;
  rows?: number | string;
  gap?: keyof typeof spacing;
  columnGap?: keyof typeof spacing;
  rowGap?: keyof typeof spacing;
}

export const Grid = ({
  children,
  columns = 1,
  rows,
  gap,
  columnGap,
  rowGap,
  ...rest
}: GridProps) => {
  // Convert columns to CSS grid-template-columns
  const getGridTemplateColumns = () => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    return columns;
  };
  
  // Convert rows to CSS grid-template-rows
  const getGridTemplateRows = () => {
    if (!rows) return undefined;
    
    if (typeof rows === 'number') {
      return `repeat(${rows}, 1fr)`;
    }
    return rows;
  };
  
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getGridTemplateColumns(),
    gridTemplateRows: getGridTemplateRows(),
    gap: gap ? spacing[gap] : undefined,
    columnGap: columnGap ? spacing[columnGap] : undefined,
    rowGap: rowGap ? spacing[rowGap] : undefined,
  };
  
  return (
    <Container {...rest} style={{ ...gridStyles, ...rest.style }}>
      {children}
    </Container>
  );
};

interface SafeAreaProps extends ContainerProps {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

export const SafeArea = ({
  children,
  top = true,
  bottom = true,
  left = true,
  right = true,
  ...rest
}: SafeAreaProps) => {
  // Only apply safe area insets on mobile
  const safeAreaStyles: React.CSSProperties = isWeb ? {
    paddingTop: top ? 'env(safe-area-inset-top, 0px)' : undefined,
    paddingBottom: bottom ? 'env(safe-area-inset-bottom, 0px)' : undefined,
    paddingLeft: left ? 'env(safe-area-inset-left, 0px)' : undefined,
    paddingRight: right ? 'env(safe-area-inset-right, 0px)' : undefined,
  } : {};
  
  return (
    <Container {...rest} style={{ ...safeAreaStyles, ...rest.style }}>
      {children}
    </Container>
  );
};
