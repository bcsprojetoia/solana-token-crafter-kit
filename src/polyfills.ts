
// Import Buffer from the buffer package
import { Buffer } from 'buffer';

// Make Buffer available globally
window.Buffer = Buffer;

// Ensure global is defined (needed for Solana web3.js)
window.global = window as any;
window.process = window.process || { env: {} } as any;

// Define crypto if it's not available
if (window.crypto === undefined) {
  window.crypto = {} as Crypto;
}

// TextEncoder & TextDecoder polyfills if needed
if (typeof window.TextEncoder === 'undefined') {
  try {
    const TextEncoderModule = require('text-encoding');
    window.TextEncoder = TextEncoderModule.TextEncoder;
  } catch (e) {
    console.error('TextEncoder não pôde ser polyfilled:', e);
  }
}

if (typeof window.TextDecoder === 'undefined') {
  try {
    const TextDecoderModule = require('text-encoding');
    window.TextDecoder = TextDecoderModule.TextDecoder;
  } catch (e) {
    console.error('TextDecoder não pôde ser polyfilled:', e);
  }
}

// Add essential browser APIs that might be missing
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
}

// Console polyfill for environments that might not have it
if (!window.console) {
  window.console = {} as Console;
}

if (!window.console.log) {
  window.console.log = function() {};
}

// Polyfill for setTimeout
if (typeof window.setTimeout === 'undefined') {
  console.warn('setTimeout não está disponível no ambiente atual');
}
