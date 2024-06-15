import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // The port your Vite dev server is running on
    server: {
      hmr: {
          host: "localhost",
          protocol: "ws",
      },
    }
  },
});