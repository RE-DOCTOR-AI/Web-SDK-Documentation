// @ts-ignore
import path from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import tailwindcss from '@tailwindcss/vite'
import {viteStaticCopy} from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@redoctor/sdk/dist/onnx/*',
          dest: path.resolve(__dirname, 'public/onnx-wasm'),
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.ngrok-free.app'],
  },
})