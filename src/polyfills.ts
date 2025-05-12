
// Import Buffer from the buffer package
import { Buffer } from 'buffer';

// Make Buffer available globally
window.Buffer = Buffer;

// Ensure global is defined (needed for Solana web3.js)
window.global = window;

// Add TextEncoder polyfill if needed
if (typeof TextEncoder === 'undefined') {
  window.TextEncoder = TextEncoder;
}

// Add TextDecoder polyfill if needed
if (typeof TextDecoder === 'undefined') {
  window.TextDecoder = TextDecoder;
}

// Ensure process is defined
// Using 'as any' to avoid TypeScript errors since we're just providing minimal process properties
window.process = window.process || { env: {} } as any;
