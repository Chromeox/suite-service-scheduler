import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MobileLayout from '@/components/mobile/MobileLayout';
import { Calendar, Clock, Users, BarChart } from 'lucide-react';
import { colors, spacing, typography, shadows, borderRadius } from '@/styles/shared-theme';
import { useTheme } from '@/components/theme/ThemeProvider';

const Home = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // Theme-based styles
  const cardBgColor = isDark ? colors.neutral[800] : colors.neutral[50];
  const cardBorderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const iconColor = colors.primary[500];
  const textColor = isDark ? colors.text.dark.primary : colors.text.light.primary;
  const secondaryTextColor = isDark ? colors.text.dark.secondary : colors.text.light.secondary;
  return (
    <MobileLayout title="SuiteSync Home">
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
        <div style={{ 
          backgroundColor: cardBgColor,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md,
          overflow: 'hidden',
          border: `1px solid ${cardBorderColor}`
        }}>
          <div style={{ 
            padding: spacing[4],
            paddingBottom: spacing[2]
          }}>
            <h2 style={{ 
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: textColor,
              marginBottom: spacing[1]
            }}>
              Welcome to SuiteSync
            </h2>
            <p style={{ 
              fontSize: typography.fontSize.sm,
              color: secondaryTextColor,
              marginBottom: spacing[2]
            }}>
              Your service scheduling solution
            </p>
          </div>
          <div style={{ padding: spacing[4], paddingTop: 0 }}>
            <p style={{ 
              color: secondaryTextColor,
              marginBottom: spacing[4],
              fontSize: typography.fontSize.base
            }}>
              Manage your appointments, services, and customer relationships all in one place.
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: spacing[4] 
        }}>
          <button 
            onClick={() => navigate('/mobile/appointments')}
            className="mobile-card-button"
            style={{ 
              backgroundColor: cardBgColor,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.sm,
              overflow: 'hidden',
              border: `1px solid ${cardBorderColor}`,
              width: '100%',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <div style={{ padding: spacing[6], paddingBottom: spacing[4] }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: spacing[2]
              }}>
                <Calendar style={{ height: spacing[8], width: spacing[8], color: iconColor }} />
                <p style={{ 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: textColor
                }}>
                  Appointments
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/mobile/schedule')}
            className="mobile-card-button"
            style={{ 
              backgroundColor: cardBgColor,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.sm,
              overflow: 'hidden',
              border: `1px solid ${cardBorderColor}`,
              width: '100%',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <div style={{ padding: spacing[6], paddingBottom: spacing[4] }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: spacing[2]
              }}>
                <Clock style={{ height: spacing[8], width: spacing[8], color: iconColor }} />
                <p style={{ 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: textColor
                }}>
                  Schedule
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/mobile/clients')}
            className="mobile-card-button"
            style={{ 
              backgroundColor: cardBgColor,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.sm,
              overflow: 'hidden',
              border: `1px solid ${cardBorderColor}`,
              width: '100%',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <div style={{ padding: spacing[6], paddingBottom: spacing[4] }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: spacing[2]
              }}>
                <Users style={{ height: spacing[8], width: spacing[8], color: iconColor }} />
                <p style={{ 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: textColor
                }}>
                  Clients
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/mobile/analytics')}
            className="mobile-card-button"
            style={{ 
              backgroundColor: cardBgColor,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.sm,
              overflow: 'hidden',
              border: `1px solid ${cardBorderColor}`,
              width: '100%',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <div style={{ padding: spacing[6], paddingBottom: spacing[4] }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: spacing[2]
              }}>
                <BarChart style={{ height: spacing[8], width: spacing[8], color: iconColor }} />
                <p style={{ 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: textColor
                }}>
                  Analytics
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Home;
