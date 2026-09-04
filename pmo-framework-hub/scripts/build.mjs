import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { build } from 'vite';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDirectory, '..');

await build({
  configFile: false,
  root,
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(root, 'src'),
      '@/components': resolve(root, 'src/components'),
      '@/pages': resolve(root, 'src/pages'),
      '@/services': resolve(root, 'src/services'),
      '@/hooks': resolve(root, 'src/hooks'),
      '@/types': resolve(root, 'src/types'),
      '@/utils': resolve(root, 'src/utils'),
      '@/data': resolve(root, 'src/data'),
      '@/styles': resolve(root, 'src/styles'),
      '@/assets': resolve(root, 'src/assets'),
    },
  },
  define: {
    'process.env': {},
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['zod', 'fuse.js'],
        },
      },
    },
  },
});
