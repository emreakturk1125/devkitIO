import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) {
            return 'react-vendor';
          }
          if (id.includes('lucide-react')) return 'icons';
          // Editor core only. Language packs and themes stay in their own async chunks.
          if (
            id.includes('@uiw/react-codemirror') ||
            id.includes('@codemirror/view') ||
            id.includes('@codemirror/state') ||
            id.includes('@codemirror/language') ||
            id.includes('@codemirror/commands') ||
            id.includes('@codemirror/autocomplete') ||
            id.includes('@codemirror/search') ||
            id.includes('@codemirror/lint')
          ) {
            return 'codemirror';
          }
        },
      },
    },
  },
})
