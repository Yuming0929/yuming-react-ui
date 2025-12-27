# Yuming React UI

一个现代化的 React UI 组件库，采用标准工程化实践构建。

## ✨ 特性

- ✅ **TypeScript First** - 完整的类型支持
- ✅ **Tree-shaking 友好** - 支持按需引入
- ✅ **主题可扩展** - 基于 Design Token 的主题系统
- ✅ **样式隔离** - CSS Modules 确保样式不冲突
- ✅ **文档即代码** - Storybook 驱动的组件文档
- ✅ **工程规范** - ESLint + Prettier + Husky + Changesets
- ✅ **Monorepo 架构** - 支持多包扩展

## 📦 技术栈

| 模块 | 技术 | 说明 |
|------|------|------|
| 框架 | React 18 | 行业标准 |
| 语言 | TypeScript | 强类型约束 |
| 构建 | Vite + Rollup | 快速构建，支持 preserveModules |
| 样式 | SCSS + CSS Modules | 工程稳定，样式隔离 |
| 文档 | Storybook | 行业标准文档工具 |
| 规范 | ESLint + Prettier | 代码规范统一 |
| 测试 | Vitest | 现代测试框架 |
| 发布 | Changesets | 版本管理工具 |
| 包管理 | pnpm | Monorepo 友好 |

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

启动 Storybook 文档：

```bash
pnpm dev
```

构建组件库：

```bash
pnpm build
```

### 使用组件

```tsx
import { Button } from '@yuming/ui'
import '@yuming/ui/src/style'

function App() {
  return (
    <div>
      <Button type="primary">主要按钮</Button>
      <Button type="success">成功按钮</Button>
    </div>
  )
}
```

## 📁 项目结构

```
yuming-react-ui/
├── packages/
│   ├── ui/                  # 组件库核心
│   │   ├── src/
│   │   │   ├── button/      # Button 组件
│   │   │   ├── style/       # 样式系统
│   │   │   └── index.ts     # 入口文件
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── docs/                # Storybook 文档
│   │   ├── stories/         # 组件故事
│   │   └── .storybook/      # Storybook 配置
│
├── scripts/                 # 自动化脚本
├── .changeset/              # Changesets 配置
├── .husky/                  # Git Hooks
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🎨 设计系统

组件库采用 Design Token 设计系统，所有设计变量集中在 `packages/ui/src/style/token.scss`：

- **颜色系统** - 主色、成功、警告、错误等
- **间距系统** - 统一的间距规范
- **字体系统** - 字体大小规范
- **圆角系统** - 统一的圆角规范
- **阴影系统** - 统一的阴影规范

## 📝 开发规范

### Commit 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat(button): add loading state
fix(input): fix placeholder color
docs: update README
```

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 使用 Stylelint 进行样式检查
- 使用 Husky + lint-staged 进行提交前检查

## 🧪 测试

```bash
# 运行测试
pnpm test

# 运行 UI 包测试
pnpm test:ui
```

## 📦 发布

使用 Changesets 管理版本和发布：

```bash
# 创建 changeset
pnpm changeset

# 更新版本
pnpm version

# 发布
pnpm release
```


