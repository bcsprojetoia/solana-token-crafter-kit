
// Import Buffer from the buffer package
import { Buffer } from 'buffer';

// Make Buffer available globally
window.Buffer = Buffer;

// Ensure global is defined (needed for Solana web3.js)
window.global = window as any;

// Add TextEncoder polyfill if needed
if (typeof window.TextEncoder === 'undefined') {
  try {
    const TextEncoderModule = require('text-encoding');
    window.TextEncoder = TextEncoderModule.TextEncoder;
  } catch (e) {
    console.warn('TextEncoder não pôde ser polyfilled');
  }
}

// Add TextDecoder polyfill if needed
if (typeof window.TextDecoder === 'undefined') {
  try {
    const TextDecoderModule = require('text-encoding');
    window.TextDecoder = TextDecoderModule.TextDecoder;
  } catch (e) {
    console.warn('TextDecoder não pôde ser polyfilled');
  }
}

// Ensure process is defined
window.process = window.process || { env: {} } as any;

// Fix for missing crypto in some environments
if (window.crypto === undefined) {
  window.crypto = {} as Crypto;
}

// Defensive check for any other potential missing browser APIs
if (typeof window.setTimeout === 'undefined') {
  console.warn('setTimeout não está disponível no ambiente atual');
}
