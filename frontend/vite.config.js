import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Autoriza a Vite a servir:
      // • Tu proyecto (.)  
      // • node_modules local (./node_modules)  
      // • carpeta un nivel arriba (por si tu frontend está en monorepo)  
      // • node_modules global de tu usuario (donde están las fuentes de KaTeX)
      allow: [
        '.', 
        'node_modules',
        path.resolve('..'),
        path.resolve('C:/Users/balld/node_modules')
      ]
    },
    proxy: {
      // Cada llamada a /api se redirige a tu Flask en el puerto 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
