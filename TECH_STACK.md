# 技术栈整合文档

## 📦 已整合技术栈

### 1. **UnoCSS** - 原子化 CSS 引擎
```bash
npm install -D unocss @unocss/nuxt
```

**特性：**
- 原子化 CSS，类似 Tailwind CSS
- 内置 Normalize.css（无需额外引入）
- 极致性能，按需生成
- 支持 JIT（即时编译）

**使用示例：**
```vue
<template>
  <div class="flex items-center justify-center p-4 bg-primary-500 text-white rounded-lg">
    UnoCSS 样式
  </div>
</template>
```

**配置文件：** `uno.config.ts`

---

### 2. **Element Plus** - Vue 3 组件库
```bash
npm install element-plus @element-plus/nuxt
```

**特性：**
- 丰富的 UI 组件
- 暗黑模式支持
- 主题定制
- TypeScript 支持

**常用组件：**
```vue
<template>
  <el-button type="primary">按钮</el-button>
  <el-input v-model="value" placeholder="请输入" />
  <el-dialog v-model="visible" title="标题">内容</el-dialog>
  <el-table :data="tableData">
    <el-table-column prop="name" label="名称" />
  </el-table>
</template>
```

---

### 3. **Pinia** - 状态管理
```bash
npm install pinia @pinia/nuxt
```

**特性：**
- Vue 3 官方推荐状态管理
- 完整的 TypeScript 支持
- 极简的 API
- 模块化 Store

**Store 示例：**
```typescript
// stores/app.ts
export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const setLoading = (value: boolean) => {
    loading.value = value
  }
  return { loading, setLoading }
})
```

**在组件中使用：**
```vue
<script setup lang="ts">
const appStore = useAppStore()
appStore.setLoading(true)
</script>
```

---

### 4. **Sass/SCSS** - CSS 预处理器
```bash
npm install -D sass
```

**特性：**
- 变量、嵌套、混合
- 函数和运算
- 模块化导入
- 与 UnoCSS 结合使用

**配置：**
```typescript
// nuxt.config.ts
vite: {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;`
      }
    }
  }
}
```

**使用 @apply 指令：**
```scss
.btn-primary {
  @apply bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600;
}
```

---

### 5. **ESLint** - 代码规范检查
```bash
npm install -D eslint @nuxt/eslint
```

**配置文件：** `.eslintrc.cjs`

**运行检查：**
```bash
npm run lint          # 检查代码
npm run lint:fix      # 自动修复
```

**配置规则：**
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@nuxt/eslint'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn'
  }
}
```

---

## 🎨 样式方案整合

### 使用优先级
1. **UnoCSS** - 原子化样式（推荐）
2. **SCSS** - 复杂组件样式、全局样式
3. **Element Plus** - 覆盖组件库样式
4. **CSS Modules** - 局部样式（需要时）

### UnoCSS 快捷方式
```typescript
// uno.config.ts
shortcuts: {
  'btn': 'px-4 py-2 rounded-md font-medium transition-all',
  'btn-primary': 'btn bg-primary-500 text-white hover:bg-primary-600',
  'card': 'bg-white rounded-lg shadow-md p-6',
  'flex-center': 'flex items-center justify-center'
}
```

### 自定义主题
```typescript
// uno.config.ts
theme: {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb'
    }
  }
}
```

---

## 🏗️ 项目架构

```
enterprise-product-website/
├── stores/              # Pinia 状态管理
│   ├── index.ts         # 统一导出
│   ├── app.ts          # 应用状态
│   ├── product.ts      # 产品状态
│   └── article.ts      # 文章状态
│
├── components/          # Vue 组件
├── composables/         # 组合式函数
├── assets/styles/       # 样式文件
│   ├── main.scss       # 主样式
│   └── variables.scss # 样式变量
│
├── uno.config.ts       # UnoCSS 配置
├── .eslintrc.cjs      # ESLint 配置
└── nuxt.config.ts     # Nuxt 配置
```

---

## 📝 开发规范

### 1. 样式优先级
```vue
<template>
  <!-- 1. 使用 UnoCSS 工具类 -->
  <div class="flex items-center justify-between p-4 bg-white rounded-lg">

    <!-- 2. 复杂样式使用 @apply -->
    <div class="btn-primary">

      <!-- 3. Element Plus 组件 -->
      <el-button type="primary">按钮</el-button>

    </div>
  </div>
</template>

<style scoped lang="scss">
// 4. 特殊样式使用 SCSS
.custom-style {
  @apply text-gradient;
  background: url('/image.png');
}
</style>
```

### 2. 状态管理
```typescript
// 优先使用 Pinia Store
const productStore = useProductStore()
await productStore.fetchProducts()

// 简单状态使用 Composables
const { loading, error } = useProducts()
```

### 3. 组件开发
```vue
<script setup lang="ts">
// Props 定义
interface Props {
  title: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: ''
})

// 使用 Pinia Store
const appStore = useAppStore()

// 使用 UnoCSS 类名
</script>

<template>
  <div class="card">
    <h2 class="text-xl font-bold mb-2">{{ title }}</h2>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>
```

---

## 🚀 性能优化

### 1. UnoCSS 优化
- 按需生成，无冗余代码
- JIT 模式，极快的开发体验
- 自动提取使用的类名

### 2. Pinia 优化
- 使用 `readonly` 导出状态
- 合理拆分 Store
- 使用计算属性缓存

### 3. ESLint 检查
- 安装 `npm run lint` 集成到 CI/CD
- 配置 Git Hooks 自动检查

---

## 📚 快速开始

### 安装依赖
```bash
npm install --legacy-peer-deps
```

### 开发模式
```bash
npm run dev
```

### 构建生产
```bash
npm run build
```

### 代码检查
```bash
npm run lint
npm run lint:fix
```

---

## 🎯 最佳实践

### 1. UnoCSS 使用
- ✅ 优先使用工具类：`flex`, `p-4`, `bg-primary-500`
- ✅ 复杂组合定义 shortcuts
- ❌ 避免内联样式
- ❌ 避免过深的类名嵌套

### 2. Element Plus 使用
- ✅ 使用预置组件
- ✅ 按需导入（自动）
- ❌ 避免过度依赖组件库
- ✅ 覆盖默认主题

### 3. Pinia 使用
- ✅ 按功能拆分 Store
- ✅ 使用 TypeScript 类型
- ✅ 状态只读导出
- ❌ 避免 Store 过大

### 4. ESLint 使用
- ✅ 提交前运行检查
- ✅ 使用 Prettier 格式化
- ✅ 自定义团队规则
- ❌ 不要忽略严重警告

---

## 🔗 参考文档

- [UnoCSS 文档](https://unocss.dev/)
- [Element Plus 文档](https://element-plus.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Sass 文档](https://sass-lang.com/)
- [ESLint 文档](https://eslint.org/)
