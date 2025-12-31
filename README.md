# 企业产品展示官网

基于 Nuxt.js 3 构建的企业产品展示官网项目。

## 项目特性

- 🚀 基于 Nuxt 3 + TypeScript + Vue 3
- 📱 完全响应式设计
- 🎨 UnoCSS 原子化 CSS + Element Plus 组件库
- 🌍 支持深色模式
- 🔍 SEO 优化
- ⚡ 性能优化（ISR、组件懒加载）
- 💾 Pinia 状态管理
- 📦 模块化组件架构
- ✨ ESLint 代码规范检查

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Nuxt 3** | ^3.11 | Vue 3 元框架 |
| **Vue 3** | ^3.4 | 渐进式框架 |
| **TypeScript** | ^5.4 | 类型安全 |
| **UnoCSS** | ^0.58 | 原子化 CSS（内置 Normalize.css） |
| **Element Plus** | ^2.6 | Vue 3 UI 组件库 |
| **Sass/SCSS** | ^1.76 | CSS 预处理器 |
| **Pinia** | ^2.1 | 状态管理 |
| **ESLint** | ^8.57 | 代码规范检查 |
| **VueUse** | ^10.10 | Vue 组合式工具库 |

## 项目结构

```
enterprise-product-website/
├── assets/                      # 静态资源
│   ├── images/                 # 图片资源
│   └── styles/                # 样式文件
│       ├── main.scss          # 主样式文件
│       └── variables.scss     # 样式变量
│
├── components/                 # Vue 组件
│   ├── layout/              # 布局组件
│   │   ├── TheHeader.vue
│   │   └── TheFooter.vue
│   ├── common/              # 通用组件
│   └── business/            # 业务组件
│
├── composables/              # 组合式函数
│   ├── index.ts
│   ├── useSeo.ts
│   ├── useProducts.ts
│   ├── useArticles.ts
│   └── useContact.ts
│
├── layouts/                 # 布局模板
│   ├── default.vue
│   └── home.vue
│
├── pages/                  # 页面路由
│   ├── index.vue
│   ├── products/
│   └── news/
│
├── stores/                 # Pinia 状态管理
│   ├── index.ts
│   ├── app.ts
│   ├── product.ts
│   └── article.ts
│
├── types/                  # TypeScript 类型
│   └── index.ts
│
├── public/                # 公共静态文件
│
├── nuxt.config.ts         # Nuxt 配置
├── uno.config.ts          # UnoCSS 配置
├── .eslintrc.cjs         # ESLint 配置
├── package.json          # 依赖配置
└── tsconfig.json         # TypeScript 配置
```

## 快速开始

### 安装依赖

```bash
npm install --legacy-peer-deps
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 生成静态网站

```bash
npm run generate
```

### 代码检查

```bash
npm run lint          # 检查代码
npm run lint:fix      # 自动修复
```

## 核心功能

### 1. 首页
- Hero 区域
- 核心优势展示
- 热门产品展示
- 数据统计
- 客户评价
- CTA 区域

### 2. 产品中心
- 产品列表展示
- 分类筛选
- 产品详情页
- 相关产品推荐

### 3. 新闻动态
- 新闻列表
- 新闻详情
- 相关文章推荐

### 4. 其他页面
- 解决方案
- 关于我们
- 联系我们

## 配置说明

### SEO 配置

```typescript
const { setSeoMeta } = useSeo()

setSeoMeta({
  title: '页面标题',
  description: '页面描述',
  keywords: '关键词',
  image: '分享图片'
})
```

### UnoCSS 使用

```vue
<template>
  <div class="flex items-center justify-center p-4 bg-primary-500">
    UnoCSS 样式
  </div>
</template>
```

### Element Plus 使用

```vue
<template>
  <el-button type="primary">按钮</el-button>
  <el-input v-model="value" />
</template>
```

### Pinia 使用

```typescript
const productStore = useProductStore()
await productStore.fetchProducts()
```

## 样式方案

项目采用 UnoCSS + SCSS 混合方案：

1. **UnoCSS** - 原子化样式（优先）
2. **SCSS** - 复杂组件样式、全局样式
3. **Element Plus** - UI 组件库

```vue
<template>
  <!-- UnoCSS 工具类 -->
  <div class="flex items-center justify-between p-4 bg-white rounded-lg">
    <!-- Element Plus 组件 -->
    <el-button type="primary">按钮</el-button>
  </div>
</template>

<style scoped lang="scss">
.btn-primary {
  @apply bg-primary-500 text-white px-4 py-2;
}
</style>
```

## 性能优化

- ISR（增量静态再生）
- 组件懒加载
- 图片优化
- UnoCSS 按需生成
- Pinia 状态优化

## 部署

### Vercel
```bash
npm run build
```

### Netlify
```bash
npm run generate
```

## 相关文档

- [架构说明](./ARCHITECTURE.md) - 项目架构详情
- [技术栈文档](./TECH_STACK.md) - 技术栈整合说明

## License

MIT
