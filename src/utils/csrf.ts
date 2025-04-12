/**
 * CSRF protection utilities for SuiteSync
 * Implements token generation and validation for Cross-Site Request Forgery protection
 */
// Use browser-compatible crypto functions
import { generateRandomBytes, sha256Hash } from './crypto-utils';

// CSRF token secret from environment variables or generate a random one
const CSRF_SECRET = import.meta.env.VITE_CSRF_SECRET || generateRandomBytes(32);

// Token expiration time (default: 1 hour)
const TOKEN_EXPIRY = 60 * 60 * 1000;

interface TokenData {
  token: string;
  expires: number;
}

/**
 * Generate a CSRF token for a user session
 * @param userId - User identifier to bind the token to
 * @returns Object containing the token and expiration time
 */
export async function generateCsrfToken(userId: string): Promise<TokenData> {
  const expires = Date.now() + TOKEN_EXPIRY;
  const data = `${userId}:${expires}:${CSRF_SECRET}`;
  const token = await sha256Hash(data);
  
  return { token, expires };
}

/**
 * Validate a CSRF token
 * @param token - The token to validate
 * @param userId - User identifier the token should be bound to
 * @returns Whether the token is valid
 */
export async function validateCsrfToken(token: string, userId: string): Promise<boolean> {
  if (!token || !userId) return false;
  
  // Check all possible valid tokens within a small window
  // This helps with clock skew issues
  const now = Date.now();
  
  // Check current time and a few intervals before
  for (let time = now; time >= now - 300000; time -= 60000) {
    const expires = time + TOKEN_EXPIRY;
    const data = `${userId}:${expires}:${CSRF_SECRET}`;
    const expectedToken = await sha256Hash(data);
    
    if (token === expectedToken && expires > now) {
      return true;
    }
  }
  
  return false;
}

/**
 * Create a hidden input field with CSRF token for forms
 * @param userId - User identifier to bind the token to
 * @returns HTML string with hidden input field
 */
export async function csrfTokenField(userId: string): Promise<string> {
  const { token } = await generateCsrfToken(userId);
  return `<input type="hidden" name="_csrf" value="${token}" />`;
}

/**
 * Express middleware to validate CSRF tokens
 * @param options - Configuration options
 * @returns Express middleware function
 */
export function csrfProtection(options: { 
  ignoreMethods?: string[],
  cookieName?: string,
  headerName?: string
} = {}) {
  const ignoreMethods = options.ignoreMethods || ['GET', 'HEAD', 'OPTIONS'];
  const cookieName = options.cookieName || 'XSRF-TOKEN';
  const headerName = options.headerName || 'X-CSRF-Token';
  
  return async (req: any, res: any, next: () => void) => {
    // Skip CSRF check for specified methods
    if (ignoreMethods.includes(req.method)) {
      return next();
    }
    
    const userId = req.user?.id;
    if (!userId) {
      return res.status(403).json({ error: 'Unauthorized: No user session' });
    }
    
    // Get token from header or form body
    const token = req.headers[headerName.toLowerCase()] || 
                 req.body?._csrf || 
                 req.query?._csrf;
    
    if (!token) {
      return res.status(403).json({ error: 'CSRF token missing' });
    }
    
    if (!(await validateCsrfToken(token, userId))) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    
    next();
  };
}
