
/// <reference types="vite/client" />

// Ensure global Buffer is recognized
declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
  }
}
