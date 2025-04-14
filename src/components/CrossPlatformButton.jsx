import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform,
  Pressable
} from 'react-native';
import { isWeb } from '../utils/platform';

/**
 * CrossPlatformButton - A button component that works consistently across web and mobile
 * 
 * @param {Object} props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Function to call when button is pressed
 * @param {Object} props.style - Additional styles for the button container
 * @param {Object} props.textStyle - Additional styles for the button text
 * @param {string} props.variant - Button variant (primary, secondary, outline, text)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left side of the button
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right side of the button
 */
export default function CrossPlatformButton({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  disabled = false,
  leftIcon,
  rightIcon,
  ...rest
}) {
  // Use different component based on platform for best native experience
  const ButtonComponent = isWeb ? Pressable : TouchableOpacity;
  
  // Get styles based on variant
  const buttonStyle = getButtonStyle(variant, disabled);
  const buttonTextStyle = getTextStyle(variant, disabled);

  return (
    <ButtonComponent
      onPress={disabled ? null : onPress}
      style={({pressed}) => [
        styles.button,
        buttonStyle,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      {...(isWeb && {
        role: 'button',
        'aria-disabled': disabled,
      })}
      {...rest}
    >
      <React.Fragment>
        {leftIcon && <React.Fragment>{leftIcon}</React.Fragment>}
        <Text style={[styles.text, buttonTextStyle, textStyle]}>
          {title}
        </Text>
        {rightIcon && <React.Fragment>{rightIcon}</React.Fragment>}
      </React.Fragment>
    </ButtonComponent>
  );
}

// Helper functions to get styles based on variant
function getButtonStyle(variant, disabled) {
  switch (variant) {
    case 'primary':
      return styles.primaryButton;
    case 'secondary':
      return styles.secondaryButton;
    case 'outline':
      return styles.outlineButton;
    case 'text':
      return styles.textButton;
    default:
      return styles.primaryButton;
  }
}

function getTextStyle(variant, disabled) {
  switch (variant) {
    case 'primary':
      return styles.primaryText;
    case 'secondary':
      return styles.secondaryText;
    case 'outline':
      return styles.outlineText;
    case 'text':
      return styles.textOnlyText;
    default:
      return styles.primaryText;
  }
}

// Styles
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        outline: 'none',
        userSelect: 'none',
        transition: 'background-color 0.2s, transform 0.1s',
      },
    }),
  },
  pressed: {
    opacity: 0.8,
    ...Platform.select({
      web: {
        transform: 'scale(0.98)',
      },
    }),
  },
  disabled: {
    opacity: 0.5,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      },
    }),
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Primary button styles
  primaryButton: {
    backgroundColor: '#f4511e',
  },
  primaryText: {
    color: '#ffffff',
  },
  // Secondary button styles
  secondaryButton: {
    backgroundColor: '#f8f9fa',
  },
  secondaryText: {
    color: '#f4511e',
  },
  // Outline button styles
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f4511e',
  },
  outlineText: {
    color: '#f4511e',
  },
  // Text-only button styles
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  textOnlyText: {
    color: '#f4511e',
  },
});
