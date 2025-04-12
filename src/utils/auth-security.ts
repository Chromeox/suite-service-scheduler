/**
 * Authentication security utilities for SuiteSync
 * Implements secure password handling and session management
 */
// Use browser-compatible crypto functions
import { generateRandomBytes, sha256Hash, timingSafeEqual, generateToken } from './crypto-utils';
import { z } from 'zod';
import { RateLimiter } from './security';

// Create a rate limiter for login attempts (5 attempts per minute)
const loginRateLimiter = new RateLimiter(5, 60000);

// Password validation schema
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Hash a password using a secure algorithm
 * @param password - Plain text password
 * @returns Object containing hash and salt
 */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = generateRandomBytes(16);
  const hash = await sha256Hash(password + salt);
  
  return { hash, salt };
}

/**
 * Verify a password against a stored hash
 * @param password - Plain text password to verify
 * @param storedHash - Previously stored password hash
 * @param salt - Salt used for the stored hash
 * @returns Whether the password is correct
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const hash = await sha256Hash(password + salt);
  
  // Use timing-safe comparison to prevent timing attacks
  return timingSafeEqual(hash, storedHash);
}

/**
 * Check if a login attempt is rate limited
 * @param identifier - User identifier (email or IP)
 * @returns Whether the login is rate limited
 */
export function isLoginRateLimited(identifier: string): boolean {
  return loginRateLimiter.isRateLimited(identifier);
}

/**
 * Reset rate limiting after successful login
 * @param identifier - User identifier (email or IP)
 */
export function resetRateLimit(identifier: string): void {
  loginRateLimiter.reset(identifier);
}

/**
 * Generate a secure session token
 * @returns Secure random token
 */
export function generateSessionToken(): string {
  return generateToken(32);
}

/**
 * Configure secure cookie options
 * @param isProduction - Whether the app is in production mode
 * @returns Secure cookie options
 */
export function getSecureCookieOptions(isProduction: boolean): Record<string, any> {
  return {
    httpOnly: true, // Prevents JavaScript access
    secure: isProduction, // HTTPS only in production
    sameSite: 'strict', // Prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
}

/**
 * Generate a password reset token
 * @param userId - User identifier
 * @param expiryMinutes - Token expiry in minutes
 * @returns Object with token and expiry timestamp
 */
export function generatePasswordResetToken(
  userId: string,
  expiryMinutes: number = 30
): { token: string; expires: number } {
  const token = generateToken(32);
  const expires = Date.now() + expiryMinutes * 60 * 1000;
  
  return { token, expires };
}

/**
 * Validate a password reset token
 * @param token - Token to validate
 * @param storedToken - Previously stored token
 * @param expiryTimestamp - Expiry timestamp for the token
 * @returns Whether the token is valid and not expired
 */
export function validateResetToken(
  token: string,
  storedToken: string,
  expiryTimestamp: number
): boolean {
  if (!token || !storedToken || !expiryTimestamp) {
    return false;
  }
  
  // Check if token has expired
  if (Date.now() > expiryTimestamp) {
    return false;
  }
  
  // Use timing-safe comparison
  return timingSafeEqual(token, storedToken);
}
