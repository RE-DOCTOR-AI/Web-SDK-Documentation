import { resolve } from 'path'
import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    root: resolve(__dirname, '.'), // Point to project root
    base: '/',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      exclude: ['**/node_modules/**'],
      setupFiles: './test/setup.ts',
    },
  })
)
