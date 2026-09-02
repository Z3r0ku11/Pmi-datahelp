import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@pages': resolve(__dirname, './src/pages'),
        '@assets': resolve(__dirname, './src/assets'),
        '@utils': resolve(__dirname, './src/utils'),
        '@types': resolve(__dirname, './src/types')
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify('3.1.0'),
      __FRAMEWORK_VERSION__: JSON.stringify('Morris Framework 3.1'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    },
    build: {
      outDir: mode === 'staging' ? 'dist-stage' : 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            charts: ['chart.js', 'react-chartjs-2'],
            icons: ['lucide-react'],
            animations: ['framer-motion']
          }
        }
      }
    },
    server: {
      port: mode === 'staging' ? 3001 : 3000,
      host: true
    },
    preview: {
      port: mode === 'staging' ? 4174 : 4173
    }
  }
})