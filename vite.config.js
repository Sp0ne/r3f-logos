import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import restart from 'vite-plugin-restart'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/r3f-logos/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000
  },
  plugins: [ restart({ restart: [ '../public/**' ] }), react(), glsl()]
})
