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
      </div>

      <div class="demo-section">
        <h2>🖥️ 当前演示：Hello World</h2>
        <p class="description">
          点击按钮，运行第一个 taichi.js 程序！
        </p>
        <div class="canvas-container">
          <canvas ref="canvasEl" width="512" height="512"></canvas>
        </div>
        <div class="info">{{ status }}</div>
        <button class="btn" @click="runDemo" :disabled="isRunning">
          {{ isRunning ? '运行中...' : '运行代码' }}
        </button>
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

// 第一课：Hello World - 最简单的程序
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
    // 这会启动显卡加速
    await ti.init()
    status.value = '正在创建数据...'

    // ==================== 第3步：创建数据 ====================
    // 创建一个包含 5 个浮点数的数组
    // ti.f32 表示 32位浮点数
    // [5] 表示数组长度为 5
    const numbers = ti.field(ti.f32, [5])

    // ==================== 第4步：添加到内核作用域 ====================
    // 这一步很重要！必须把数据添加到内核作用域，
    // 否则内核无法访问这些数据
    ti.addToKernelScope({ numbers })

    // ==================== 第5步：创建内核（GPU 程序） ====================
    // kernel 是在 GPU 上执行的函数
    const kernel = ti.kernel(function fillArray() {
      // range(5) 表示从 0 到 4 循环
      // 这个循环会在 GPU 上并行执行，非常快！
      for (let i of range(5)) {
        // 给数组的每个位置赋值
        numbers[i] = i * 2  // 0*2=0, 1*2=2, 2*2=4, ...
      }
    })

    // ==================== 第6步：执行内核 ====================
    // 这会调用 GPU 执行上面的代码
    kernel()
    status.value = '正在读取数据...'

    // ==================== 第7步：读取结果 ====================
    // toArray1D() 把 GPU 上的数据复制到 CPU
    // 返回一个普通的 JavaScript 数组
    const data = await numbers.toArray1D()

    // ==================== 第8步：显示结果 ====================
    console.log('计算结果:', data)
    result.value = `数组内容: [${data.join(', ')}]`
    status.value = '✅ 完成！'

    // 创建一个简单的图像显示
    await createSimpleImage(ti, data)

  } catch (error) {
    console.error('执行错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
    result.value = null
  } finally {
    isRunning.value = false
  }
}

// 创建简单的测试图像
async function createSimpleImage(ti: any, data: number[]) {
  if (!canvasEl.value) return

  // 先把 data 数组转换为 GPU 可以访问的 field
  const dataField = ti.field(ti.f32, [5])
  for (let i = 0; i < data.length; i++) {
    dataField[i] = data[i]
  }
  dataField.toArray1D()  // 同步数据到 GPU

  // 创建一个 5x5 的小图像用于演示
  const pixels = ti.Vector.field(4, ti.f32, [5, 5])

  // 添加到作用域（包含 dataField）
  ti.addToKernelScope({ pixels, dataField })

  // 定义内核
  const kernel = ti.kernel(function k() {
    for (let i of range(5)) {
      for (let j of range(5)) {
        // 从 GPU 的 dataField 中读取值
        const value = dataField[i]
        const r = value / 8.0   // 红色
        const g = 0.5             // 绿色固定
        const b = j / 4.0         // 蓝色
        pixels[[i, j]] = [r, g, b, 1.0]
      }
    }
  })

  // 执行
  kernel()

  // 显示
  const tiCanvas = new ti.Canvas(canvasEl.value)
  await tiCanvas.setImage(pixels)
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

.btn {
  display: block;
  width: 100%;
  padding: 15px 32px;
  background: #4ec9b0;
  color: #1e1e1e;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;

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
