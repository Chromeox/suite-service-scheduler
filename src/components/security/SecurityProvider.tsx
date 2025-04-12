/**
 * Security Provider Component
 * Implements application-wide security features
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { performSecurityAudit } from '@/utils/security-audit';
import { generateNonce } from '@/utils/security';
import { SecureStorage } from '@/utils/secure-storage';

// Security context type
interface SecurityContextType {
  nonce: string;
  securityScore: number;
  isSecureContext: boolean;
  hasSecureStorage: boolean;
  hasHttpsConnection: boolean;
  performAudit: () => void;
}

// Create context with default values
const SecurityContext = createContext<SecurityContextType>({
  nonce: '',
  securityScore: 0,
  isSecureContext: false,
  hasSecureStorage: false,
  hasHttpsConnection: false,
  performAudit: () => {},
});

// Hook to use security context
export const useSecurity = () => useContext(SecurityContext);

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [nonce] = useState(() => generateNonce());
  const [securityScore, setSecurityScore] = useState(0);
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [hasSecureStorage, setHasSecureStorage] = useState(false);
  const [hasHttpsConnection, setHasHttpsConnection] = useState(false);

  // Initialize security features
  useEffect(() => {
    // Check if we're in a secure context (HTTPS)
    setIsSecureContext(window.isSecureContext);
    setHasHttpsConnection(window.location.protocol === 'https:');

    // Test secure storage
    const testSecureStorage = async () => {
      try {
        await SecureStorage.setItem('security_test', 'test_value');
        const value = await SecureStorage.getItem('security_test');
        setHasSecureStorage(value === 'test_value');
        await SecureStorage.removeItem('security_test');
      } catch (error) {
        console.error('Secure storage test failed:', error);
        setHasSecureStorage(false);
      }
    };

    testSecureStorage();

    // Perform initial security audit
    const auditResults = performSecurityAudit();
    setSecurityScore(auditResults.score);

    // Log security warnings in development
    if (process.env.NODE_ENV === 'development') {
      if (!window.isSecureContext) {
        console.warn(
          'Application is not running in a secure context. Some security features may be disabled.'
        );
      }
      
      if (window.location.protocol !== 'https:') {
        console.warn(
          'Application is not being served over HTTPS. Consider using HTTPS even in development.'
        );
      }
    }
  }, []);

  // Function to perform a security audit on demand
  const performAudit = () => {
    const auditResults = performSecurityAudit();
    setSecurityScore(auditResults.score);
    return auditResults;
  };

  // Create meta tag for CSP nonce if it doesn't exist
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="csp-nonce"]');
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'csp-nonce');
      metaTag.setAttribute('content', nonce);
      document.head.appendChild(metaTag);
    } else {
      metaTag.setAttribute('content', nonce);
    }

    return () => {
      if (metaTag && metaTag.parentNode) {
        metaTag.parentNode.removeChild(metaTag);
      }
    };
  }, [nonce]);

  const contextValue: SecurityContextType = {
    nonce,
    securityScore,
    isSecureContext,
    hasSecureStorage,
    hasHttpsConnection,
    performAudit,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
