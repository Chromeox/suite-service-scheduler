/**
 * Security audit utilities for SuiteSync
 * Helps identify potential security vulnerabilities
 */

interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  type: string;
  description: string;
  location?: string;
  recommendation: string;
}

/**
 * Check for sensitive data in localStorage
 * @returns Array of security issues found
 */
export function auditLocalStorage(): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  const sensitiveKeyPatterns = [
    /token/i, /key/i, /secret/i, /password/i, /credential/i, /auth/i
  ];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Check if the key matches sensitive patterns
      const isSensitive = sensitiveKeyPatterns.some(pattern => pattern.test(key));
      
      if (isSensitive) {
        issues.push({
          severity: 'high',
          type: 'Insecure Storage',
          description: `Potentially sensitive data stored in localStorage: ${key}`,
          location: 'localStorage',
          recommendation: 'Use SecureStorage utility with encryption for sensitive data'
        });
      }
    }
  } catch (error) {
    console.error('Error auditing localStorage:', error);
  }
  
  return issues;
}

/**
 * Check for insecure script sources
 * @returns Array of security issues found
 */
export function auditScriptSources(): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  
  try {
    const scripts = document.querySelectorAll('script');
    
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      
      if (src && !src.startsWith('https://') && !src.startsWith('/') && !src.startsWith('./')) {
        issues.push({
          severity: 'high',
          type: 'Insecure Script Source',
          description: `Script loaded from insecure or external source: ${src}`,
          location: 'DOM',
          recommendation: 'Use HTTPS for all external scripts and consider Content Security Policy'
        });
      }
      
      // Check for inline scripts without nonce
      if (!script.getAttribute('src') && !script.getAttribute('nonce')) {
        issues.push({
          severity: 'medium',
          type: 'Inline Script',
          description: 'Inline script without nonce attribute',
          location: 'DOM',
          recommendation: 'Add nonce attributes to inline scripts for CSP compliance'
        });
      }
    });
  } catch (error) {
    console.error('Error auditing script sources:', error);
  }
  
  return issues;
}

/**
 * Check for missing security headers
 * @returns Array of security issues found
 */
export function auditSecurityHeaders(): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  
  // This function needs to be run server-side or through a proxy
  // For client-side, we can only check if we're on HTTPS
  if (window.location.protocol !== 'https:') {
    issues.push({
      severity: 'high',
      type: 'Insecure Protocol',
      description: 'Application is not being served over HTTPS',
      location: 'Transport',
      recommendation: 'Configure the server to use HTTPS and redirect HTTP to HTTPS'
    });
  }
  
  return issues;
}

/**
 * Audit application for common security issues
 * @returns Object with audit results
 */
export function performSecurityAudit(): {
  issues: SecurityIssue[];
  score: number;
  timestamp: string;
} {
  const storageIssues = auditLocalStorage();
  const scriptIssues = auditScriptSources();
  const headerIssues = auditSecurityHeaders();
  
  const allIssues = [...storageIssues, ...scriptIssues, ...headerIssues];
  
  // Calculate security score (0-100)
  const severityWeights = {
    critical: 10,
    high: 5,
    medium: 3,
    low: 1,
    info: 0
  };
  
  const totalWeight = allIssues.reduce((sum, issue) => 
    sum + severityWeights[issue.severity], 0);
  
  // Higher score is better (100 = no issues)
  const score = Math.max(0, 100 - totalWeight);
  
  return {
    issues: allIssues,
    score,
    timestamp: new Date().toISOString()
  };
}

/**
 * Format security audit results as HTML
 * @param auditResults - Results from performSecurityAudit
 * @returns HTML string with formatted results
 */
export function formatAuditResultsAsHtml(auditResults: ReturnType<typeof performSecurityAudit>): string {
  const { issues, score, timestamp } = auditResults;
  
  const severityColors = {
    critical: '#ff0000',
    high: '#ff6600',
    medium: '#ffcc00',
    low: '#66cc00',
    info: '#0099cc'
  };
  
  let html = `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h1>Security Audit Report</h1>
      <p>Timestamp: ${new Date(timestamp).toLocaleString()}</p>
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <div style="width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                    background-color: ${score >= 90 ? '#4CAF50' : score >= 70 ? '#FFC107' : '#F44336'}; color: white; font-size: 24px; font-weight: bold;">
          ${score}
        </div>
        <div style="margin-left: 20px;">
          <h2 style="margin: 0;">Security Score</h2>
          <p style="margin: 0;">${
            score >= 90 ? 'Good' : score >= 70 ? 'Needs Improvement' : 'Critical Issues'
          }</p>
        </div>
      </div>
      
      <h2>Issues Found: ${issues.length}</h2>
  `;
  
  if (issues.length === 0) {
    html += '<p>No security issues found!</p>';
  } else {
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += `
      <tr style="background-color: #f2f2f2;">
        <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Severity</th>
        <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Type</th>
        <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Description</th>
        <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Recommendation</th>
      </tr>
    `;
    
    issues.forEach(issue => {
      html += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${severityColors[issue.severity]}; margin-right: 5px;"></span>
            ${issue.severity.toUpperCase()}
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">${issue.type}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${issue.description}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${issue.recommendation}</td>
        </tr>
      `;
    });
    
    html += '</table>';
  }
  
  html += `
    <h2>Recommendations</h2>
    <ul>
      <li>Implement Content Security Policy (CSP)</li>
      <li>Use HTTPS for all connections</li>
      <li>Encrypt sensitive data in storage</li>
      <li>Implement proper authentication and authorization</li>
      <li>Validate and sanitize all user inputs</li>
      <li>Keep dependencies updated</li>
    </ul>
    
    <p style="font-style: italic; color: #666;">
      This report is generated automatically and may not catch all security issues. 
      Regular manual security audits are recommended.
    </p>
  </div>
  `;
  
  return html;
}
