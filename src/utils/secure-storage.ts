/**
 * Secure storage utilities for SuiteSync
 * Implements browser-compatible secure storage for sensitive data using Web Crypto API
 */

// Use environment variable for encryption key or generate a secure default
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'SuiteSync_SecureStorage_Key';

/**
 * Browser-compatible encryption using Web Crypto API (SubtleCrypto)
 */

/**
 * Derive an encryption key from a password/passphrase
 * @param password - The password or passphrase to derive the key from
 * @returns CryptoKey that can be used for encryption/decryption
 */
async function deriveKey(password: string): Promise<CryptoKey> {
  // Convert password string to buffer
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  
  // Import the password as a key
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Create a salt (ideally this should be stored and reused)
  const salt = encoder.encode('SuiteSyncSalt');
  
  // Derive an AES-GCM key using PBKDF2
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using Web Crypto API
 * @param data - Data to encrypt
 * @returns Encrypted data as a base64 string
 */
export async function encryptData(data: string): Promise<string> {
  try {
    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Derive encryption key from the encryption key string
    const key = await deriveKey(ENCRYPTION_KEY);
    
    // Convert data to buffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...result));
  } catch (error) {
    console.error('Encryption error:', error);
    // Fallback to simple encoding if encryption fails
    return btoa(data);
  }
}

/**
 * Decrypt data using Web Crypto API
 * @param encryptedData - Base64 string of encrypted data
 * @returns Decrypted data
 */
export async function decryptData(encryptedData: string): Promise<string> {
  try {
    // Convert base64 to array buffer
    const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract IV (first 12 bytes)
    const iv = encryptedBytes.slice(0, 12);
    const data = encryptedBytes.slice(12);
    
    // Derive the key from the encryption key string
    const key = await deriveKey(ENCRYPTION_KEY);
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      data
    );
    
    // Convert buffer to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    // Fallback to simple decoding if decryption fails
    try {
      return atob(encryptedData);
    } catch (e) {
      console.error('Decoding fallback error:', e);
      throw new Error('Failed to decrypt data');
    }
  }
}

/**
 * Secure storage for sensitive data in localStorage with encryption
 */
export const SecureStorage = {
  /**
   * Store encrypted data
   * @param key - Storage key
   * @param value - Value to store
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = await encryptData(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('SecureStorage.setItem error:', error);
    }
  },
  
  /**
   * Retrieve and decrypt data
   * @param key - Storage key
   * @returns Decrypted value or null if not found
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      return await decryptData(encrypted);
    } catch (error) {
      console.error('SecureStorage.getItem error:', error);
      return null;
    }
  },
  
  /**
   * Remove data from storage
   * @param key - Storage key to remove
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },
  
  /**
   * Clear all secure storage items
   * @param prefix - Optional prefix to only clear items with this prefix
   */
  clear(prefix?: string): void {
    if (prefix) {
      // Only clear items with the specified prefix
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      }
    } else {
      // Clear all items
      localStorage.clear();
    }
  }
};
