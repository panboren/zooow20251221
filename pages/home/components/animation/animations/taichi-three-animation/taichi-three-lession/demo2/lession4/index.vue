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

        <div class="concept">
          <h3>5. 多个内核协作</h3>
          <p>可以创建多个内核，它们可以共享同一个 Field 数据。</p>
          <pre class="code-block">
// 第一个内核：生成数据
const fillKernel = ti.kernel(function fill() {
  // ...
})

// 第二个内核：使用数据
const drawKernel = ti.kernel(function draw() {
  // ...
})

// 先运行第一个
fillKernel()
// 再运行第二个
drawKernel()</pre>
        </div>

        <div class="concept">
          <h3>6. 条件判断</h3>
          <p>在内核中使用 if-else 来实现条件逻辑。</p>
          <pre class="code-block">
if (dist < 0.2) {
  // 条件成立时的代码
  r = 1.0
} else if (dist < 0.35) {
  // 第二个条件
  g = 1.0
} else {
  // 其他情况
  r = 0.1
}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h2>🖥️ 当前演示：第四课 - 绘制像素</h2>
        <p class="description">
          在 Canvas 上绘制图形：绘制三个同心圆
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
const currentLesson = ref(3)

// 根据当前课程运行对应的演示
async function runDemo() {
  if (isRunning.value) return

  isRunning.value = true
  status.value = '正在初始化 taichi.js...'
  result.value = null

  try {
    const ti = await $loadTaichi()
    await ti.init()

    if (currentLesson.value === 0) {
      await runLesson1(ti)
    } else if (currentLesson.value === 1) {
      await runLesson2(ti)
    } else if (currentLesson.value === 2) {
      await runLesson3(ti)
    } else if (currentLesson.value === 3) {
      await runLesson4(ti)
    }
  } catch (error) {
    console.error('执行错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
    result.value = null
  } finally {
    isRunning.value = false
  }
}

// 第一课：Hello World
async function runLesson1(ti: any) {
  status.value = '正在创建数据...'

  const numbers = ti.field(ti.f32, [5])
  ti.addToKernelScope({ numbers })

  const kernel = ti.kernel(function fillArray() {
    for (let i of range(5)) {
      numbers[i] = i * 2
    }
  })

  kernel()
  status.value = '正在读取数据...'
  const data = await numbers.toArray1D()

  console.log('计算结果:', data)
  result.value = `数组内容: [${data.join(', ')}]`
  status.value = '✅ 完成！'

  await createSimpleImage(ti, data)
}

// 第二课：简单计算
async function runLesson2(ti: any) {
  status.value = '正在创建数据...'

  const pixels = ti.Vector.field(4, ti.f32, [512, 512])
  ti.addToKernelScope({ pixels })

  const kernel = ti.kernel(function drawWave() {
    for (let i of range(512)) {
      for (let j of range(512)) {
        const x = i / 512.0 * 6.28
        const y = j / 512.0 * 6.28
        const value = ti.sin(x) + ti.cos(y)

        const r = (value + 2.0) / 4.0
        const g = (ti.sin(x * 2.0) + 1.0) / 2.0
        const b = (ti.cos(y * 2.0) + 1.0) / 2.0

        pixels[[i, j]] = [r, g, b, 1.0]
      }
    }
  })

  status.value = 'GPU 正在计算...'
  kernel()

  status.value = '正在绘制图像...'
  const tiCanvas = new ti.Canvas(canvasEl.value!)
  await tiCanvas.setImage(pixels)

  status.value = '✅ 完成！'
  result.value = '成功绘制了正弦余弦波浪图案'
}

// 第三课：数组操作
async function runLesson3(ti: any) {
  status.value = '正在创建数据...'

  const pixels = ti.Vector.field(4, ti.f32, [512, 512])

  // 创建一个二维渐变字段
  const gradient = ti.field(ti.f32, [512, 512])

  ti.addToKernelScope({ pixels, gradient })

  // 第一个内核：生成渐变数据
  const fillKernel = ti.kernel(function fillGradient() {
    for (let i of range(512)) {
      for (let j of range(512)) {
        // 计算对角线距离，产生放射状渐变
        const dx = i - 256.0
        const dy = j - 256.0
        const distance = ti.sqrt(dx * dx + dy * dy)
        gradient[[i, j]] = distance / 362.0  // 归一化到 0-1
      }
    }
  })

  // 第二个内核：使用渐变数据绘制
  const drawKernel = ti.kernel(function drawFromGradient() {
    for (let i of range(512)) {
      for (let j of range(512)) {
        const value = gradient[[i, j]]

        // 根据渐变值生成彩虹色
        const r = ti.sin(value * 6.28 + 0.0) * 0.5 + 0.5
        const g = ti.sin(value * 6.28 + 2.09) * 0.5 + 0.5
        const b = ti.sin(value * 6.28 + 4.18) * 0.5 + 0.5

        pixels[[i, j]] = [r, g, b, 1.0]
      }
    }
  })

  status.value = 'GPU 正在生成渐变数据...'
  fillKernel()

  status.value = 'GPU 正在绘制图像...'
  drawKernel()

  status.value = '正在显示图像...'
  const tiCanvas = new ti.Canvas(canvasEl.value!)
  await tiCanvas.setImage(pixels)

  status.value = '✅ 完成！'
  result.value = '成功生成了放射状彩虹渐变图案'
}

// 第四课：绘制像素
async function runLesson4(ti: any) {
  try {
    status.value = '正在创建数据...'

    const IMAGE_SIZE = 512
    const CENTER_X = 0.5
    const CENTER_Y = 0.5
    const INNER_CIRCLE_RADIUS = 0.2
    const MIDDLE_CIRCLE_RADIUS = 0.35
    const OUTER_CIRCLE_RADIUS = 0.5

    const pixels = ti.Vector.field(4, ti.f32, [IMAGE_SIZE, IMAGE_SIZE])
    ti.addToKernelScope({ pixels })

    // 将常量添加到kernel作用域
    ti.addToKernelScope({
      IMAGE_SIZE,
      CENTER_X,
      CENTER_Y,
      INNER_CIRCLE_RADIUS,
      MIDDLE_CIRCLE_RADIUS,
      OUTER_CIRCLE_RADIUS
    })

    const kernel = ti.kernel(function drawShapes() {
      for (let i of range(IMAGE_SIZE)) {
        for (let j of range(IMAGE_SIZE)) {
          const x = i / IMAGE_SIZE
          const y = j / IMAGE_SIZE

          // 绘制三个同心圆
          const dx = x - CENTER_X
          const dy = y - CENTER_Y
          const dist = ti.sqrt(dx * dx + dy * dy)

          // 使用初始值和后续赋值都确保是浮点数
          let r = 0.1 * 1.0
          let g = 0.1 * 1.0
          let b = 0.15 * 1.0

          if (dist < INNER_CIRCLE_RADIUS) {
            // 中心圆：红色
            r = 1.0 * 1.0
            g = 0.2 * 1.0
            b = 0.2 * 1.0
          } else if (dist < MIDDLE_CIRCLE_RADIUS) {
            // 第二个圆：绿色
            r = 0.2 * 1.0
            g = 1.0 * 1.0
            b = 0.2 * 1.0
          } else if (dist < OUTER_CIRCLE_RADIUS) {
            // 第三个圆：蓝色
            r = 0.2 * 1.0
            g = 0.2 * 1.0
            b = 1.0 * 1.0
          } else {
            // 背景：深色（保持默认值）
            r = 0.1
            g = 0.1
            b = 0.15
          }

          pixels[[i, j]] = [r, g, b, 1.0]
        }
      }
    })

    // 执行kernel
    status.value = 'GPU 正在绘制图像...'
    kernel()

    // 显示图像
    status.value = '正在显示图像...'
    const tiCanvas = new ti.Canvas(canvasEl.value!)
    await tiCanvas.setImage(pixels)

    status.value = '✅ 完成！'
    result.value = '成功绘制了三个同心圆'

  } catch (error) {
    console.error('运行课程4时发生错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
    throw error
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
  // 根据当前课程更新标题和描述
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
