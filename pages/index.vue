<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero bg-gradient-primary text-white py-20">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-5xl font-bold mb-6">企业级产品解决方案</h1>
          <p class="text-xl mb-8 opacity-90">基于 Nuxt 3 + UnoCSS + Element Plus 构建</p>
          <div class="flex justify-center gap-4">
            <el-button type="primary" size="large">开始使用</el-button>
            <el-button size="large">了解更多</el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="section py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">技术栈展示</h2>
          <p class="text-gray-600">已整合企业级开发所需的所有技术</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- UnoCSS -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">🎨</div>
            <h3 class="text-xl font-bold mb-2">UnoCSS</h3>
            <p class="text-gray-600 mb-4">原子化 CSS 引擎，极速开发体验</p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">性能优异</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">按需生成</span>
            </div>
          </div>

          <!-- Element Plus -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">🧩</div>
            <h3 class="text-xl font-bold mb-2">Element Plus</h3>
            <p class="text-gray-600 mb-4">Vue 3 组件库，丰富的 UI 组件</p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">组件丰富</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">TS 支持</span>
            </div>
          </div>

          <!-- Pinia -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">💾</div>
            <h3 class="text-xl font-bold mb-2">Pinia</h3>
            <p class="text-gray-600 mb-4">Vue 3 状态管理，简洁高效</p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">类型安全</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">模块化</span>
            </div>
          </div>

          <!-- SCSS -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">🎭</div>
            <h3 class="text-xl font-bold mb-2">Sass/SCSS</h3>
            <p class="text-gray-600 mb-4">CSS 预处理器，强大的样式能力</p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">变量嵌套</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">@apply</span>
            </div>
          </div>

          <!-- ESLint -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">✅</div>
            <h3 class="text-xl font-bold mb-2">ESLint</h3>
            <p class="text-gray-600 mb-4">代码规范检查，保持代码质量</p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">自动修复</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">规范统一</span>
            </div>
          </div>

          <!-- Color Mode -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">🌓</div>
            <h3 class="text-xl font-bold mb-2">Color Mode</h3>
            <p class="text-gray-600 mb-4">深色模式支持，用户友好体验</p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">自动切换</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">持久化</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section class="section py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">组件演示</h2>
          <p class="text-gray-600">Element Plus + UnoCSS 组合使用示例</p>
        </div>

        <div class="max-w-2xl mx-auto space-y-6">
          <!-- Form Demo -->
          <el-card class="shadow-md">
            <template #header>
              <div class="font-bold">表单演示</div>
            </template>
            <el-form label-width="80px">
              <el-form-item label="用户名">
                <el-input v-model="form.name" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="form.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item label="主题">
                <el-select v-model="form.theme" placeholder="选择主题">
                  <el-option label="浅色" value="light" />
                  <el-option label="深色" value="dark" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
                <el-button @click="handleReset">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- Buttons Demo -->
          <el-card class="shadow-md">
            <template #header>
              <div class="font-bold">按钮演示</div>
            </template>
            <div class="flex flex-wrap gap-4">
              <el-button>默认按钮</el-button>
              <el-button type="primary">主要按钮</el-button>
              <el-button type="success">成功按钮</el-button>
              <el-button type="warning">警告按钮</el-button>
              <el-button type="danger">危险按钮</el-button>
            </div>
          </el-card>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section py-20 bg-gradient-primary text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-6">开始使用</h2>
        <p class="text-xl mb-8 opacity-90">立即体验企业级前端开发框架</p>
        <div class="flex justify-center gap-4">
          <el-button type="primary" size="large" plain>查看文档</el-button>
          <el-button size="large" plain>GitHub</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { setSeoMeta } = useSeo()
const appStore = useAppStore()

setSeoMeta({
  title: '首页',
  description: '专业的企业级产品解决方案，助力企业数字化转型'
})

// 表单数据
const form = ref({
  name: '',
  email: '',
  theme: 'light'
})

// 获取当前主题
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// 处理提交
const handleSubmit = () => {
  console.log('表单提交:', form.value)
  ElMessage.success('提交成功！')
}

// 处理重置
const handleReset = () => {
  form.value = {
    name: '',
    email: '',
    theme: 'light'
  }
  ElMessage.info('表单已重置')
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
}

.section {
  min-height: 50vh;
}

.card {
  @apply bg-white rounded-lg shadow-md p-6 transition-transform duration-300;

  &:hover {
    @apply -translate-y-1;
  }
}
</style>
