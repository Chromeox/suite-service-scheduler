import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

export default function CrossPlatformButton({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  disabled = false,
}) {
  // Get styles based on variant
  const buttonStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const buttonTextStyle = variant === 'primary' ? styles.primaryText : styles.secondaryText;

  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      style={[
        styles.button,
        buttonStyle,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
    >
      <Text style={[styles.text, buttonTextStyle, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
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
  },
  disabled: {
    opacity: 0.5,
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
    borderWidth: 1,
    borderColor: '#f4511e',
  },
  secondaryText: {
    color: '#f4511e',
  },
});
