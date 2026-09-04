import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isPhase1 = mode === 'phase1'
  const isPhase2 = mode === 'phase2'
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@shared': resolve(__dirname, './shared'),
        '@phase1': resolve(__dirname, './phase1'),
        '@phase2': resolve(__dirname, './phase2')
      }
    },
    build: {
      outDir: isPhase1 ? 'dist/phase1' : isPhase2 ? 'dist/phase2' : 'dist',
      rollupOptions: {
        input: {
          main: resolve(__dirname, isPhase1 ? 'phase1/index.html' : isPhase2 ? 'phase2/index.html' : 'index.html')
        }
      }
    },
    define: {
      __PHASE__: JSON.stringify(mode || 'development'),
      __VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0')
    },
    server: {
      port: isPhase1 ? 3001 : isPhase2 ? 3002 : 3000,
      host: true
    }
  }
})