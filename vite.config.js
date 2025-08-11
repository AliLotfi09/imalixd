import { defineConfig } from 'vite'

export default defineConfig({
  base: '/imalixd/', // حتما اسم ریپو باشه
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
})
