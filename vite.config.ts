import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the app to access process.env.API_KEY after build
    // Ensure you set API_KEY in your Netlify Environment Variables
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});