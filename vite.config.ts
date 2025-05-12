
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "buffer": "buffer", // Explicitly map buffer
    },
  },
  define: {
    // This is required for Solana web3.js
    'process.env': {},
    'global': 'globalThis',
  },
  // Add the necessary polyfills for Solana
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    include: ['buffer', '@solana/web3.js', '@solana/spl-token'] // Ensure these are pre-bundled
  },
}));
