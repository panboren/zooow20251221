<template>
  <div class="home-page" :class="{ 'dark': isDark }">
    <!-- Dark Mode Toggle -->
    <div class="fixed top-4 right-4 z-50">
      <el-button
        circle
        size="small"
        class="theme-btn"
        @click="toggleColorMode"
      >
        {{ isDark ? '🌙' : '☀️' }}
      </el-button>
    </div>

    <!-- Hero Section -->
    <section class="hero bg-gradient-primary text-white py-20">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-5xl font-bold mb-6">
            企业产品官网
          </h1>
          <p class="text-xl mb-8 opacity-90">
            专业的企业产品展示官网，使用最新技术构建
          </p>
          <div class="flex justify-center gap-4">
            <el-button
              type="primary"
              size="large"
            >
              了解更多
            </el-button>
            <el-button size="large">
              阅读更多
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="section py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">
            技术栈
          </h2>
          <p class="text-gray-600">
            使用最新技术栈构建的现代化企业产品官网
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- UnoCSS -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">
              🎨
            </div>
            <h3 class="text-xl font-bold mb-2">
              UnoCSS
            </h3>
            <p class="text-gray-600 mb-4">
              即时原子化CSS引擎，提供极高的性能和开发体验
            </p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">高性能</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">按需生成</span>
            </div>
          </div>

          <!-- Element Plus -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">
              🧩
            </div>
            <h3 class="text-xl font-bold mb-2">
              Element Plus
            </h3>
            <p class="text-gray-600 mb-4">
              一套为开发者、设计师和产品经理准备的Vue 3组件库
            </p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">丰富组件</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">主题定制</span>
            </div>
          </div>

          <!-- Pinia -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">
              💾
            </div>
            <h3 class="text-xl font-bold mb-2">
              Pinia
            </h3>
            <p class="text-gray-600 mb-4">
              Vue 3的官方状态管理库，提供完整的TypeScript支持
            </p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">TypeScript</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">模块化</span>
            </div>
          </div>

          <!-- SCSS -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">
              🎭
            </div>
            <h3 class="text-xl font-bold mb-2">
              SCSS
            </h3>
            <p class="text-gray-600 mb-4">
              CSS预处理器，提供变量、嵌套、混合等强大功能
            </p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">变量</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">嵌套</span>
            </div>
          </div>

          <!-- ESLint -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">
              ✅
            </div>
            <h3 class="text-xl font-bold mb-2">
              ESLint
            </h3>
            <p class="text-gray-600 mb-4">
              代码质量检查工具，确保代码风格统一和高质量
            </p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">代码规范</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">自动修复</span>
            </div>
          </div>

          <!-- Color Mode -->
          <div class="card hover-lift">
            <div class="text-4xl mb-4">
              🌓
            </div>
            <h3 class="text-xl font-bold mb-2">
              Color Mode
            </h3>
            <p class="text-gray-600 mb-4">
              支持亮色/暗色模式切换，自动检测系统偏好
            </p>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">暗色模式</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-600 text-sm rounded">自动切换</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section class="section py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">
            组件演示
          </h2>
          <p class="text-gray-600">
            展示Element Plus组件库的核心功能
          </p>
        </div>

        <div class="max-w-2xl mx-auto space-y-6">
          <!-- Form Demo -->
          <el-card class="shadow-md">
            <template #header>
              <div class="font-bold">
                表单演示
              </div>
            </template>
            <el-form label-width="80px">
              <el-form-item label="用户名">
                <el-input
                  v-model="form.name"
                  placeholder="请输入用户名"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="form.email"
                  placeholder="请输入邮箱"
                />
              </el-form-item>
              <el-form-item label="主题">
                <el-select
                  v-model="form.theme"
                  placeholder="请选择主题"
                >
                  <el-option
                    label="亮色"
                    value="light"
                  />
                  <el-option
                    label="暗色"
                    value="dark"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleSubmit"
                >
                  提交
                </el-button>
                <el-button @click="handleReset">
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- Buttons Demo -->
          <el-card class="shadow-md">
            <template #header>
              <div class="font-bold">
                按钮演示
              </div>
            </template>
            <div class="flex flex-wrap gap-4">
              <el-button>默认按钮</el-button>
              <el-button type="primary">
                主要按钮
              </el-button>
              <el-button type="success">
                成功按钮
              </el-button>
              <el-button type="warning">
                警告按钮
              </el-button>
              <el-button type="danger">
                危险按钮
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section py-20 bg-gradient-primary text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-6">
          开始使用
        </h2>
        <p class="text-xl mb-8 opacity-90">
          立即构建您的企业产品官网
        </p>
        <div class="flex justify-center gap-4">
          <el-button
            type="primary"
            size="large"
            plain
          >
            查看文档
          </el-button>
          <el-button
            size="large"
            plain
          >
            GitHub
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

// 表单数据
const form = ref({
  name: '',
  email: '',
  theme: 'light',
})

// 获取当前主题
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// 切换主题
const toggleColorMode = () => {
  colorMode.value = isDark.value ? 'light' : 'dark'
}

// 处理提交
const handleSubmit = () => {
  console.log('表单提交:', form.value)
  ElMessage.success('提交成功')
}

// 处理重置
const handleReset = () => {
  form.value = {
    name: '',
    email: '',
    theme: 'light',
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

.theme-btn {
  font-size: 16px;
  padding: 8px;
}
</style>
