import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  },
  async viteFinal(config) {
    const uiPath = path.resolve(__dirname, '../../ui/src')
    
    // 确保 CSS 配置被正确合并
    const existingCss = config.css || {}
    const existingModules = existingCss.modules || {}
    
    return mergeConfig(config, {
      css: {
        ...existingCss,
        modules: {
          ...existingModules,
          generateScopedName: '[name]__[local]___[hash:base64:5]',
          hashPrefix: 'yuming',
          localsConvention: 'camelCase'
        },
        preprocessorOptions: {
          ...existingCss.preprocessorOptions,
          scss: {
            ...existingCss.preprocessorOptions?.scss
          }
        }
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@yuming/ui': path.resolve(uiPath, 'index.ts'),
          '@yuming/ui/style': path.resolve(uiPath, 'style/index.ts')
        },
        dedupe: ['react', 'react-dom', ...(config.resolve?.dedupe || [])]
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        exclude: ['@yuming/ui', ...(config.optimizeDeps?.exclude || [])],
        esbuildOptions: {
          ...config.optimizeDeps?.esbuildOptions,
          resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.scss']
        }
      },
      server: {
        ...config.server,
        fs: {
          ...config.server?.fs,
          allow: ['..', ...(config.server?.fs?.allow || [])]
        }
      }
    })
  }
}

export default config

