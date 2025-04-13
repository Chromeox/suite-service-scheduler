import React, { ReactNode } from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '@/styles/shared-theme';
import { useStyledTheme } from './theme-context';
import { Container, Flex } from './containers';
import { Text } from './typography';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  padding?: keyof typeof spacing;
  shadow?: keyof typeof shadows;
  borderRadius?: keyof typeof borderRadius;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Card = ({
  children,
  title,
  subtitle,
  padding = 4,
  shadow = 'md',
  borderRadius: borderRadiusKey = 'lg',
  onClick,
  className = '',
  style = {},
}: CardProps) => {
  const { isDark } = useStyledTheme();
  
  // Theme-based styles
  const cardBgColor = isDark ? colors.neutral[800] : colors.neutral[50];
  const cardBorderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  
  const cardStyles: React.CSSProperties = {
    backgroundColor: cardBgColor,
    borderRadius: borderRadius[borderRadiusKey],
    boxShadow: shadows[shadow],
    border: `1px solid ${cardBorderColor}`,
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };
  
  // Add hover effects if card is clickable
  if (onClick) {
    cardStyles[':hover'] = {
      transform: 'translateY(-2px)',
      boxShadow: shadows.lg,
    };
    cardStyles[':active'] = {
      transform: 'translateY(0)',
      boxShadow: shadows.sm,
    };
  }
  
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  return (
    <div 
      className={`card ${className}`}
      style={{
        ...cardStyles,
        padding: spacing[padding]
      }}
      onClick={handleClick}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: spacing[4] }}>
          {title && (
            <Text 
              variant="h3" 
              style={{ marginBottom: subtitle ? spacing[1] : 0 }}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text 
              variant="caption" 
              color={isDark ? colors.text.dark.secondary : colors.text.light.secondary}
            >
              {subtitle}
            </Text>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

interface CardButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const CardButton = ({
  icon,
  label,
  onClick,
  className = '',
  style = {},
}: CardButtonProps) => {
  const { isDark } = useStyledTheme();
  
  // Theme-based styles
  const cardBgColor = isDark ? colors.neutral[800] : colors.neutral[50];
  const cardBorderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const iconColor = colors.primary[500];
  const textColor = isDark ? colors.text.dark.primary : colors.text.light.primary;
  
  const cardButtonStyles: React.CSSProperties = {
    backgroundColor: cardBgColor,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.sm,
    border: `1px solid ${cardBorderColor}`,
    overflow: 'hidden',
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ...style,
  };
  
  return (
    <button 
      onClick={onClick}
      className={`mobile-card-button ${className}`}
      style={cardButtonStyles}
    >
      <Flex 
        direction="column" 
        align="center" 
        justify="center"
        padding={6}
        gap={2}
      >
        {React.cloneElement(icon as React.ReactElement, { 
          style: { 
            height: spacing[8], 
            width: spacing[8], 
            color: iconColor 
          } 
        })}
        <Text 
          variant="body"
          weight="medium"
          color={textColor}
        >
          {label}
        </Text>
      </Flex>
    </button>
  );
};
