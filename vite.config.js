import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/polar-command-hub/',
  plugins: [react()],
})
