# 快速开始指南

## 📋 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 🚀 安装步骤

### 1. 安装依赖

```bash
pnpm install
```

### 2. 初始化 Git Hooks

```bash
pnpm prepare
```

这将初始化 Husky，用于 Git 提交前的代码检查。

### 3. 启动开发环境

启动 Storybook 查看组件文档：

```bash
pnpm dev
```

访问 http://localhost:6006 查看组件文档。

### 4. 构建组件库

```bash
pnpm build
```

构建产物将输出到 `packages/ui/dist` 目录。

## 📦 使用组件库

### 在项目中使用

```bash
# 在你的项目中安装
pnpm add @yuming/ui
```

### 基本使用

```tsx
import React from 'react'
import { Button } from '@yuming/ui'
import '@yuming/ui/src/style'

function App() {
  return (
    <div>
      <Button type="primary">主要按钮</Button>
      <Button type="success">成功按钮</Button>
      <Button type="warning" loading>
        加载中
      </Button>
    </div>
  )
}

export default App
```

### 按需引入（Tree-shaking）

```tsx
// 只引入需要的组件
import { Button } from '@yuming/ui/button'
```

## 🛠️ 开发新组件

### 1. 创建组件目录

在 `packages/ui/src` 下创建新组件目录，例如 `input`：

```
packages/ui/src/input/
├── Input.tsx        # 组件实现
├── type.ts          # 类型定义
├── module.scss      # 样式文件
└── index.ts         # 导出文件
```

### 2. 组件模板

**Input.tsx**

```tsx
import React, { forwardRef } from 'react'
import { InputProps } from './type'
import styles from './module.scss'
import classNames from 'classnames'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...restProps }, ref) => {
    const classes = classNames(styles.input, className)

    return <input ref={ref} className={classes} {...restProps} />
  }
)

Input.displayName = 'Input'
```

**type.ts**

```tsx
import { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // 自定义属性
}
```

**module.scss**

```scss
@import '../style/token.scss';

.input {
  // 组件样式
}
```

**index.ts**

```tsx
export { Input } from './Input'
export type { InputProps } from './type'
```

### 3. 导出组件

在 `packages/ui/src/index.ts` 中添加：

```tsx
export { Input } from './input'
export type { InputProps } from './input/type'
```

### 4. 创建 Storybook 文档

在 `packages/docs/stories` 下创建 `Input.stories.tsx`：

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@yuming/ui'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: '请输入...'
  }
}
```

## 🧪 运行测试

```bash
# 运行所有测试
pnpm test

# 运行 UI 包测试
pnpm test:ui

# 监听模式
pnpm test:ui --watch
```

## 📝 代码规范

### 提交代码前

代码会自动进行以下检查：

- ESLint 代码检查
- Prettier 代码格式化
- Stylelint 样式检查

### Commit 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat(button): add loading state
fix(input): fix placeholder color
docs: update README
style: format code
refactor: optimize component structure
test: add unit tests
chore: update dependencies
```

## 📦 发布流程

### 1. 创建 Changeset

```bash
pnpm changeset
```

选择版本类型（major/minor/patch）并描述变更。

### 2. 更新版本

```bash
pnpm version
```

这将根据 changeset 自动更新版本号。

### 3. 发布

```bash
pnpm release
```

## 🎨 主题定制

组件库使用 Design Token 系统，所有设计变量在 `packages/ui/src/style/token.scss` 中定义。

### 覆盖主题变量

```scss
// 在你的项目中覆盖主题变量
:root {
  --yuming-color-primary: #your-color;
  --yuming-spacing-md: 20px;
}
```

## 📚 更多文档

- [README.md](./README.md) - 项目概述
- [Storybook](http://localhost:6006) - 组件文档和示例

## ❓ 常见问题

### Q: 构建失败，提示找不到模块？

A: 确保已运行 `pnpm install` 安装所有依赖。

### Q: Storybook 启动失败？

A: 检查 `packages/docs` 目录下的依赖是否已安装。

### Q: 样式不生效？

A: 确保已导入样式文件：`import '@yuming/ui/src/style'`

### Q: TypeScript 类型错误？

A: 运行 `pnpm type-check` 检查类型定义。

---

Happy Coding! 🎉
