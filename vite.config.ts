
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/todolist/', // Add this line
  plugins: [react()],
  // ... any other configurations you have
});