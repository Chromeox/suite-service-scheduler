import React from 'react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { Calendar } from 'lucide-react';
import { colors, spacing, typography } from '@/styles/shared-theme';
import { useTheme } from '@/components/theme/ThemeProvider';

const Appointments = () => {
  const { isDark } = useTheme();
  
  // Theme-based styles
  const textColor = isDark ? colors.text.dark.primary : colors.text.light.primary;
  const secondaryTextColor = isDark ? colors.text.dark.secondary : colors.text.light.secondary;
  const iconColor = colors.primary[500];
  
  return (
    <MobileLayout title="Appointments" showBackButton>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6], alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
        <Calendar style={{ height: spacing[16], width: spacing[16], color: iconColor }} />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: textColor,
            marginBottom: spacing[2]
          }}>
            Appointments
          </h2>
          <p style={{ 
            fontSize: typography.fontSize.base,
            color: secondaryTextColor
          }}>
            Manage your appointments and bookings
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Appointments;
