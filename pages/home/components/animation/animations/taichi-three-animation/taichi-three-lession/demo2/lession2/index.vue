<template>
  <div class="page-content">
    <div class="lesson-container">
      <h1>taichi.js 教程 - 从零开始</h1>

      <div class="lesson-card">
        <h2>📚 教程导航</h2>
        <div class="lesson-list">
          <div class="lesson-item">
            <h3>第一课：Hello World</h3>
            <p>最简单的 taichi.js 程序</p>
          </div>
          <div class="lesson-item">
            <h3>第二课：简单计算</h3>
            <p>在 GPU 上进行数学运算</p>
          </div>
          <div class="lesson-item">
            <h3>第三课：数组操作</h3>
            <p>使用 Field 存储数据</p>
          </div>
          <div class="lesson-item">
            <h3>第四课：绘制像素</h3>
            <p>在 Canvas 上显示图像</p>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>📖 什么是 taichi.js？</h2>
        <p>
          taichi.js 是一个高性能的 JavaScript GPU 计算框架，可以在浏览器中利用显卡（GPU）进行并行计算。
        </p>
        <ul class="features">
          <li>🚀 极快的计算速度（使用 GPU）</li>
          <li>🌐 浏览器中运行（无需后端）</li>
          <li>🎨 支持图形渲染</li>
          <li>📊 适合科学计算和模拟</li>
        </ul>
      </div>

      <div class="card">
        <h2>🎯 核心概念</h2>
        <div class="concept">
          <h3>1. Kernel（内核）</h3>
          <p>在 GPU 上并行执行的函数，可以同时处理大量数据。</p>
          <pre class="code-block">
const kernel = ti.kernel(function name() {
  // GPU 上执行的代码
})</pre>
        </div>

        <div class="concept">
          <h3>2. Field（字段）</h3>
          <p>在 GPU 上存储的数组。</p>
          <pre class="code-block">
const arr = ti.field(ti.f32, [100])  // 100 个浮点数的数组</pre>
        </div>

        <div class="concept">
          <h3>3. range() 循环</h3>
          <p>用于遍历数组，会在 GPU 上并行执行。</p>
          <pre class="code-block">
for (let i of range(100)) {
  // 这里的代码会并行执行
}</pre>
        </div>

        <div class="concept">
          <h3>4. 数学函数</h3>
          <p>taichi.js 支持常见的数学函数，使用 <code>ti.</code> 前缀。</p>
          <pre class="code-block">
ti.sin(x)    // 正弦函数
ti.cos(x)    // 余弦函数
ti.sqrt(x)   // 平方根
ti.abs(x)    // 绝对值
ti.min(a, b) // 最小值
ti.max(a, b) // 最大值</pre>
        </div>
      </div>

      <div class="demo-section">
        <h2>🖥️ 当前演示：第二课 - 简单计算</h2>
        <p class="description">
          在 GPU 上进行数学运算：绘制正弦余弦波浪图案
        </p>
        <div class="canvas-container">
          <canvas ref="canvasEl" width="512" height="512"></canvas>
        </div>
        <div class="info">{{ status }}</div>
        <div class="button-group">
          <button class="btn btn-secondary" @click="prevLesson" :disabled="currentLesson === 0">
            ← 上一课
          </button>
          <button class="btn" @click="runDemo" :disabled="isRunning">
            {{ isRunning ? '运行中...' : '运行代码' }}
          </button>
          <button class="btn btn-secondary" @click="nextLesson" :disabled="currentLesson === 3">
            下一课 →
          </button>
        </div>
        <div class="result" v-if="result">
          <h3>运行结果：</h3>
          <p>{{ result }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { $loadTaichi } = useNuxtApp()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const status = ref('点击按钮运行演示')
const isRunning = ref(false)
const result = ref<string | null>(null)
const currentLesson = ref(1)

// 第二课：简单计算 - 在 GPU 上进行数学运算
async function runDemo() {
  if (isRunning.value) return

  isRunning.value = true
  status.value = '正在初始化 taichi.js...'
  result.value = null

  try {
    // ==================== 第1步：加载 taichi.js ====================
    const ti = await $loadTaichi()
    status.value = '正在初始化 GPU...'

    // ==================== 第2步：初始化 WebGPU ====================
    await ti.init()
    status.value = '正在创建数据...'

    // ==================== 第3步：创建数据 ====================
    // 创建一个 512x512 的图像像素数组
    const pixels = ti.Vector.field(4, ti.f32, [512, 512])

    // ==================== 第4步：添加到内核作用域 ====================
    // 必须在创建内核之前添加，否则内核无法访问 pixels
    ti.addToKernelScope({ pixels })

    // ==================== 第5步：创建内核 ====================
    const kernel = ti.kernel(function drawWave() {
      for (let i of range(512)) {
        for (let j of range(512)) {
          // 将坐标转换到 0-2π 范围
          const x = i / 512.0 * 6.28
          const y = j / 512.0 * 6.28

          // 计算波浪图案
          // sin(x) + cos(y) 产生复杂的波浪效果
          const value = ti.sin(x) + ti.cos(y)

          // 将结果映射到颜色 (0-1)
          const r = (value + 2.0) / 4.0  // 红色
          const g = (ti.sin(x * 2.0) + 1.0) / 2.0  // 绿色
          const b = (ti.cos(y * 2.0) + 1.0) / 2.0  // 蓝色

          pixels[[i, j]] = [r, g, b, 1.0]
        }
      }
    })

    // ==================== 第6步：执行内核 ====================

    // ==================== 第6步：执行内核 ====================
    status.value = 'GPU 正在计算...'
    kernel()

    // ==================== 第7步：显示结果 ====================
    status.value = '正在绘制图像...'
    const tiCanvas = new ti.Canvas(canvasEl.value!)
    await tiCanvas.setImage(pixels)

    status.value = '✅ 完成！'
    result.value = '成功绘制了正弦余弦波浪图案'

  } catch (error) {
    console.error('执行错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
    result.value = null
  } finally {
    isRunning.value = false
  }
}

function nextLesson() {
  if (currentLesson.value < 3) {
    currentLesson.value++
    loadLessonContent()
  }
}

function prevLesson() {
  if (currentLesson.value > 0) {
    currentLesson.value--
    loadLessonContent()
  }
}

function loadLessonContent() {
  // 根据当前课程加载不同内容
  status.value = '点击按钮运行演示'
  result.value = null
}
</script>

<style scoped lang="scss">
.page-content {
  width: 100vw;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d30 100%);
  color: #d4d4d4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.lesson-container {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #4ec9b0;
  font-size: 36px;
  margin-bottom: 40px;
  font-weight: 600;
}

.lesson-card {
  background: #252526;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.lesson-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.lesson-item {
  background: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #4ec9b0;

  h3 {
    color: #4ec9b0;
    margin: 0 0 10px 0;
    font-size: 18px;
  }

  p {
    margin: 0;
    color: #a0a0a0;
  }
}

.card {
  background: #252526;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  h2 {
    color: #9cdcfe;
    margin: 0 0 15px 0;
    font-size: 24px;
  }

  p {
    color: #d4d4d4;
    line-height: 1.6;
    margin-bottom: 15px;
  }
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 10px 0;
    color: #d4d4d4;
    font-size: 16px;
  }
}

.concept {
  background: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #9cdcfe;

  h3 {
    color: #9cdcfe;
    margin: 0 0 10px 0;
    font-size: 18px;
  }

  p {
    color: #a0a0a0;
    margin-bottom: 15px;
  }
}

.code-block {
  background: #1e1e1e;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  color: #d4d4d4;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  margin: 0;
  border: 1px solid #3c3c3c;
}

.demo-section {
  background: #252526;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  h2 {
    color: #4ec9b0;
    margin: 0 0 15px 0;
    font-size: 24px;
  }

  .description {
    color: #d4d4d4;
    margin-bottom: 20px;
  }
}

.canvas-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

canvas {
  background: #000;
  border: 2px solid #3c3c3c;
  border-radius: 8px;
  max-width: 100%;
}

.info {
  padding: 15px 25px;
  background: #2d2d30;
  border-radius: 8px;
  color: #d4d4d4;
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
  border-left: 4px solid #4ec9b0;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  flex: 2;
  padding: 15px 32px;
  background: #4ec9b0;
  color: #1e1e1e;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #3db89e;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(78, 201, 176, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-secondary {
  flex: 1;
  background: #9cdcfe;
  color: #1e1e1e;

  &:hover:not(:disabled) {
    background: #8cbce8;
    box-shadow: 0 6px 16px rgba(156, 220, 254, 0.3);
  }
}

.result {
  background: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #c586c0;
  margin-top: 20px;

  h3 {
    color: #c586c0;
    margin: 0 0 10px 0;
    font-size: 18px;
  }

  p {
    color: #d4d4d4;
    margin: 0;
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 20px 10px;
  }

  h1 {
    font-size: 28px;
  }

  .lesson-list {
    grid-template-columns: 1fr;
  }
}
</style>
