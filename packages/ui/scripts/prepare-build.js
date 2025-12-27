// 构建前准备脚本：将 package.json 的 main/module 指向 dist
const fs = require('fs')
const path = require('path')

const packagePath = path.resolve(__dirname, '../package.json')
const package = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))

// 保存原始配置
if (!package._originalMain) {
  package._originalMain = package.main
  package._originalModule = package.module
  package._originalTypes = package.types
}

// 更新为构建后的路径
package.main = 'dist/index.cjs'
package.module = 'dist/index.esm.js'
package.types = 'dist/index.d.ts'

// 更新 exports
package.exports = {
  '.': {
    types: './dist/index.d.ts',
    import: './dist/index.esm.js',
    require: './dist/index.cjs'
  },
  './style': './dist/style.css',
  './src/*': './src/*'
}

fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n')
console.log('✅ Package.json updated for build')

