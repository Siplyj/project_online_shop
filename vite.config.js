import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      config: path.resolve(__dirname, './config.js'),
      assets: path.resolve(__dirname, './src/assets'),
      components: path.resolve(__dirname, './src/components'),
      files: path.resolve(__dirname, './src/files'),
      hooks: path.resolve(__dirname, './src/hooks'),
      pages: path.resolve(__dirname, './src/pages'),
      store: path.resolve(__dirname, './src/store'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },
  plugins: [react()],
  base: '/project_online_shop/',
  server: {
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost+3-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost+3.pem')),
    },
    port: 5173,
  },
});