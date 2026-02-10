import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // <--- 1. IMPORT THIS

import path from 'path'; // Needed for path aliases

export default defineConfig({
  plugins: [
    react(), // <--- 2. USE THIS IN THE PLUGINS ARRAY
  ],
  resolve: {
    alias: {
      // 3. Keep the alias fix we did earlier
      '@': path.resolve(__dirname, './src'), 
    },
  },
})
