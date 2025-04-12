/**
 * Security headers middleware for SuiteSync
 * Implements Content Security Policy and other security headers
 */
import { generateNonce } from '@/utils/security';

/**
 * Applies security headers to the response
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function applySecurityHeaders(req: any, res: any, next: () => void) {
  // Generate a nonce for inline scripts (if needed)
  const nonce = generateNonce();
  res.locals.cspNonce = nonce;

  // Content Security Policy
  const cspDirectives = [
    // Default policy for everything
    "default-src 'self'",
    // Allow styles from self and specific CDNs
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Allow fonts from self and specific CDNs
    "font-src 'self' https://fonts.gstatic.com",
    // Allow images from self and specific CDNs
    "img-src 'self' data: https://api.qrserver.com https://cndgtyzjwjlelglieoyf.supabase.co",
    // Allow scripts from self and nonce
    `script-src 'self' 'nonce-${nonce}'`,
    // Allow connections to Supabase and other APIs
    "connect-src 'self' https://cndgtyzjwjlelglieoyf.supabase.co wss://cndgtyzjwjlelglieoyf.supabase.co",
    // Frame ancestors
    "frame-ancestors 'none'",
    // Form actions
    "form-action 'self'",
    // Object security
    "object-src 'none'",
    // Base URI
    "base-uri 'self'",
  ].join('; ');

  // Set security headers
  res.setHeader('Content-Security-Policy', cspDirectives);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Set Strict-Transport-Security header for HTTPS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
}

/**
 * Applies CORS headers for API endpoints
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function applyCorsHeaders(req: any, res: any, next: () => void) {
  // Get allowed origins from environment variables
  const allowedOrigins = (import.meta.env.VITE_ALLOWED_ORIGINS || '').split(',');
  const origin = req.headers.origin;

  // Check if the request origin is in the allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Default to the application's own origin
    res.setHeader('Access-Control-Allow-Origin', import.meta.env.VITE_APP_URL || '*');
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
}
