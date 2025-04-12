/**
 * Security utility functions for SuiteSync
 * Provides consistent security implementations across the application
 */
import DOMPurify from 'dompurify';
import { z } from 'zod';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param content - The content to sanitize
 * @returns Sanitized content safe for rendering
 */
export function sanitizeHtml(content: string): string {
  if (!content) return '';
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

/**
 * Sanitizes a URL to prevent javascript: protocol and other malicious URLs
 * @param url - The URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    const safeProtocols = ['http:', 'https:'];
    
    if (!safeProtocols.includes(urlObj.protocol)) {
      return '';
    }
    
    return url;
  } catch (e) {
    // If URL parsing fails, return empty string
    return '';
  }
}

/**
 * Validates and sanitizes user input based on a schema
 * @param schema - Zod schema for validation
 * @param data - Data to validate
 * @returns Validated and sanitized data or null if invalid
 */
export function validateInput<T>(schema: z.ZodType<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
}

/**
 * Generates a nonce for Content Security Policy
 * @returns A random nonce string
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Masks sensitive data for logging (e.g., API keys, tokens)
 * @param data - The data containing sensitive information
 * @param keysToMask - Array of keys to mask in the data
 * @returns Data with sensitive information masked
 */
export function maskSensitiveData(data: Record<string, any>, keysToMask: string[]): Record<string, any> {
  const maskedData = { ...data };
  
  for (const key of keysToMask) {
    if (maskedData[key]) {
      const value = maskedData[key].toString();
      if (value.length > 8) {
        // Show first 4 and last 4 characters, mask the rest
        maskedData[key] = `${value.substring(0, 4)}****${value.substring(value.length - 4)}`;
      } else {
        maskedData[key] = '********';
      }
    }
  }
  
  return maskedData;
}

/**
 * Rate limiting utility to prevent brute force attacks
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; timestamp: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if a key (IP, user ID) is rate limited
   * @param key - Unique identifier (IP, user ID)
   * @returns Whether the key is rate limited
   */
  isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return false;
    }
    
    if (now - record.timestamp > this.windowMs) {
      // Reset if window has passed
      this.attempts.set(key, { count: 1, timestamp: now });
      return false;
    }
    
    if (record.count >= this.maxAttempts) {
      return true;
    }
    
    // Increment attempt count
    this.attempts.set(key, { 
      count: record.count + 1, 
      timestamp: record.timestamp 
    });
    
    return false;
  }

  /**
   * Reset rate limiting for a key
   * @param key - Unique identifier to reset
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Common security schemas for validation
export const securitySchemas = {
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).max(100),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  url: z.string().url().transform(sanitizeUrl),
  safeHtml: z.string().transform(sanitizeHtml),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/),
};
