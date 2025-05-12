
// Import and set up necessary polyfills for Solana
import { Buffer } from 'buffer';

// Make Buffer available globally
window.Buffer = Buffer;

// Ensure global is available
if (typeof window !== 'undefined') {
  window.global = window;
}
