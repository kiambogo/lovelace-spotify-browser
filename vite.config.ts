import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/lovelace-spotify-browser.ts',
      formats: ['es'],
      fileName: () => 'lovelace-spotify-browser.js',
    },
    outDir: 'dist',
    rollupOptions: {
      output: { inlineDynamicImports: true }
    }
  }
})
