/**
 * Browser-compatible crypto utilities for SuiteSync
 * Provides cryptographic functions using the Web Crypto API
 */

/**
 * Generate random bytes and return as hex string
 * @param length Number of bytes to generate
 * @returns Hex string of random bytes
 */
export function generateRandomBytes(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a SHA-256 hash of the input string
 * @param data Input string to hash
 * @returns Hex string of the hash
 */
export async function sha256Hash(data: string): Promise<string> {
  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Hash the data using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  
  // Convert hash to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Compare two strings in a timing-safe manner to prevent timing attacks
 * @param a First string to compare
 * @param b Second string to compare
 * @returns Whether the strings are equal
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  // XOR comparison with constant time
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Generate a secure random token
 * @param length Length of the token in bytes
 * @returns Hex string of the token
 */
export function generateToken(length: number = 32): string {
  return generateRandomBytes(length);
}
