import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import path from 'path';

// Load env file based on NODE_ENV
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Now use process.env
const isProduction = process.env.VITE_NODE_ENV === 'production';

const backendURL = isProduction
  ? process.env.VITE_BACKEND_API_URL
  : process.env.VITE_BACKEND_API_URL_LOCAL;

if (!backendURL) {
  throw new Error('VITE_BACKEND_API_URL or VITE_BACKEND_API_URL_LOCAL is not defined');
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Allow connections from network IPs
    port: parseInt(process.env.VITE_PORT) || 5173,
    proxy: {
      '/api': {
        target: backendURL,
        changeOrigin: true,
        secure: isProduction,
      },
    },
  },
  preview: {
    port: parseInt(process.env.VITE_PORT) || 4173,
    host: '0.0.0.0',
    allowedHosts: ['hisabee.onrender.com'],
  },
});
