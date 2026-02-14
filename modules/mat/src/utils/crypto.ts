/**
 * Cryptographic utilities
 * Using Node.js built-in crypto module
 */

import { createHash } from 'crypto';

/**
 * Generate SHA-256 hash of input string
 */
export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Generate SHA-256 hash with salt
 */
export function sha256WithSalt(input: string, salt: string): string {
  return createHash('sha256').update(input + salt).digest('hex');
}
