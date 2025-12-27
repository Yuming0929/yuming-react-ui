import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      hashPrefix: 'yuming',
      localsConvention: 'camelCase',
      // 确保在构建时正确处理
      getJSON: undefined
    },
    preprocessorOptions: {
      scss: {
        // 注意：这里不全局导入，让每个组件文件自己决定是否导入 token
        // additionalData: `@import "@/style/token.scss";`
      }
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'YumingUI',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') {
          return 'index.esm.js'
        }
        return 'index.cjs'
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        preserveModules: false,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'style.css'
          }
          return assetInfo.name || 'asset'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
