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
          <div class="lesson-item">
            <h3>第五课：动画效果</h3>
            <p>使用 requestAnimationFrame 实现动画</p>
          </div>
          <div class="lesson-item">
            <h3>第六课：认识粒子</h3>
            <p>什么是粒子，绘制单个粒子</p>
          </div>
          <div class="lesson-item">
            <h3>第七课：粒子系统</h3>
            <p>多个粒子和重力模拟</p>
          </div>
          <div class="lesson-item">
            <h3>第八课：粒子动画</h3>
            <p>让单个粒子运动和交互</p>
          </div>
          <div class="lesson-item">
            <h3>第九课：粒子碰撞</h3>
            <p>粒子之间的碰撞检测和反应</p>
          </div>
          <div class="lesson-item">
            <h3>第十课：碰撞系统</h3>
            <p>多个粒子的碰撞系统</p>
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

        <div class="concept">
          <h3>7. 动画实现</h3>
          <p>使用 <code>requestAnimationFrame</code> 创建流畅的动画效果。</p>
          <pre class="code-block">
// 创建内核，接受时间参数
const kernel = ti.kernel(function animate(t) {
  // 使用时间参数 t 创建动画
  const value = ti.sin(t)
  // ...
})

// 使用 requestAnimationFrame 循环
function animateFrame() {
  const time = (Date.now() - startTime) / 1000.0
  kernel(time)
  requestAnimationFrame(animateFrame)
}

// 启动动画
animateFrame()</pre>
        </div>

        <div class="concept">
          <h3>8. 什么是粒子？</h3>
          <p>粒子是一个简化的小对象，只包含位置和颜色。</p>
          <pre class="code-block">
// 粒子的核心要素：
// 1. 位置（x, y）- 在画布上的坐标
// 2. 大小（半径）- 粒子有多大
// 3. 颜色（R, G, B）- 粒子的颜色

// 绘制圆形粒子：
for (let x of range(512)) {
  for (let y of range(512)) {
    // 计算到粒子中心的距离
    let dx = x - centerX
    let dy = y - centerY
    let distance = ti.sqrt(dx * dx + dy * dy)

    // 距离小于半径的像素属于粒子
    if (distance <= radius) {
      pixels[[x, y]] = [R, G, B, 1.0]
    }
  }
}</pre>
        </div>

        <div class="concept">
          <h3>9. 粒子系统</h3>
          <p>使用 Field 存储粒子位置和速度，模拟物理效果。</p>
          <pre class="code-block">
// 创建粒子数组
const positions = ti.Vector.field(2, ti.f32, [1000])
const velocities = ti.Vector.field(2, ti.f32, [1000])
const colors = ti.Vector.field(3, ti.f32, [1000])

// 更新物理状态
vel[1] = vel[1] - 0.001  // 重力
pos[0] = pos[0] + vel[0]  // 更新位置

// 边界碰撞检测
if (pos[1] < 0.0) {
  pos[1] = 0.0
  vel[1] = -vel[1] * 0.8  // 反弹
}</pre>
        </div>

        <div class="concept">
          <h3>10. 粒子动画</h3>
          <p>让粒子运动、碰撞边界、实现渐变效果。</p>
          <pre class="code-block">
// 单个粒子的物理更新
pos[0] = pos[0] + vel[0]  // 位置更新
pos[1] = pos[1] + vel[1]

// 边界反弹
if (pos[0] < 0.0 || pos[0] > 1.0) {
  vel[0] = -vel[0]  // 反转速度
}

// 渐变颜色效果
let brightness = 1.0 - dist / radius
pixels[[x, y]] = [
  brightness,
  brightness * 0.6,
  brightness * 0.3
]</pre>
        </div>

        <div class="concept">
          <h3>11. 粒子碰撞</h3>
          <p>检测粒子之间的碰撞并模拟弹性碰撞反应。</p>
          <pre class="code-block">
// 计算两个粒子之间的距离
let dx = pos2[0] - pos1[0]
let dy = pos2[1] - pos1[1]
let dist = ti.sqrt(dx * dx + dy * dy)

// 检测碰撞
if (dist < radius1 + radius2) {
  // 计算碰撞法线
  let nx = dx / dist
  let ny = dy / dist

  // 计算相对速度
  let dvx = vel1[0] - vel2[0]
  let dvy = vel1[1] - vel2[1]
  let dvn = dvx * nx + dvy * ny

  // 弹性碰撞：交换速度
  vel1[0] = vel1[0] - dvn * nx
  vel1[1] = vel1[1] - dvn * ny
  vel2[0] = vel2[0] + dvn * nx
  vel2[1] = vel2[1] + dvn * ny
}</pre>
        </div>

        <div class="concept">
          <h3>12. 碰撞系统</h3>
          <p>多个粒子的碰撞系统，考虑质量和优化碰撞检测。</p>
          <pre class="code-block">
// 双循环检测所有粒子对
for (let i of range(PARTICLE_COUNT)) {
  for (let j of range(i + 1, PARTICLE_COUNT)) {
    // 只检查每个粒子对一次
    let dist = ti.sqrt(dx * dx + dy * dy)

    if (dist < radius1 + radius2) {
      // 考虑质量的弹性碰撞
      let m1 = masses[i]
      let m2 = masses[j]
      let mSum = m1 + m2

      let impulse = 2.0 * dvn / mSum

      // 更新速度（质量越大影响越小）
      vel1[0] = vel1[0] - impulse * m2 * nx
      vel2[0] = vel2[0] + impulse * m1 * nx
    }
  }
}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h2>🖥️ 当前演示：第十课 - 碰撞系统</h2>
        <p class="description">
          多个粒子的碰撞系统：空间优化，20个粒子互相碰撞
        </p>
        <div class="canvas-container">
          <canvas ref="canvasEl" width="512" height="512"></canvas>
        </div>
        <div class="info">{{ status }}</div>
        <div class="button-group">
          <button class="btn btn-secondary" @click="prevLesson" :disabled="currentLesson === 0">
            ← 上一课
          </button>
          <button class="btn" @click="runDemo" :disabled="isRunning || isAnimating">
            {{ isAnimating ? '动画运行中' : (isRunning ? '运行中...' : '运行代码') }}
          </button>
          <button class="btn btn-secondary" @click="stopAnimation" :disabled="!isAnimating">
            ⏹ 停止动画
          </button>
          <button class="btn btn-secondary" @click="nextLesson" :disabled="currentLesson === 9">
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
const isAnimating = ref(false)
const result = ref<string | null>(null)
const currentLesson = ref(9)
let animationId: number | null = null

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
    } else if (currentLesson.value === 4) {
      await runLesson5(ti)
    } else if (currentLesson.value === 5) {
      await runLesson6(ti)
    } else if (currentLesson.value === 6) {
      await runLesson7(ti)
    } else if (currentLesson.value === 7) {
      await runLesson8(ti)
    } else if (currentLesson.value === 8) {
      await runLesson9(ti)
    } else if (currentLesson.value === 9) {
      await runLesson10(ti)
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
  // fillKernel()

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

// 第五课：动画效果
async function runLesson5(ti: any) {
  try {
    status.value = '正在初始化...'
    isAnimating.value = true

    const IMAGE_SIZE = 512
    const pixels = ti.Vector.field(4, ti.f32, [IMAGE_SIZE, IMAGE_SIZE])
    const timeField = ti.field(ti.f32, [1])

    ti.addToKernelScope({ pixels, timeField, IMAGE_SIZE })

    const kernel = ti.kernel(function animate(t) {
      for (let i of range(IMAGE_SIZE)) {
        for (let j of range(IMAGE_SIZE)) {
          const x = i / IMAGE_SIZE
          const y = j / IMAGE_SIZE

          // 计算到中心的距离
          const dx = x - 0.5
          const dy = y - 0.5
          const dist = ti.sqrt(dx * dx + dy * dy)

          // 使用时间参数创建呼吸效果
          const breath = ti.sin(t * 2.0) * 0.1 + 0.1

          // 创建彩虹环
          const hue = (dist * 10.0 + t) % 1.0
          const saturation = 1.0 * 1.0
          const brightness = breath / (dist + 0.1) * 0.3

          // HSV 转 RGB (简化版)
          let r = brightness * 1.0
          let g = brightness * 1.0
          let b = brightness * 1.0

          if (hue < 0.33) {
            r = brightness * (1.0 - hue / 0.33)
            g = brightness * (hue / 0.33)
            b = 0.0 * 1.0
          } else if (hue < 0.66) {
            r = 0.0 * 1.0
            g = brightness * (1.0 - (hue - 0.33) / 0.33)
            b = brightness * ((hue - 0.33) / 0.33)
          } else {
            r = brightness * ((hue - 0.66) / 0.33)
            g = 0.0 * 1.0
            b = brightness * (1.0 - (hue - 0.66) / 0.33)
          }

          pixels[[i, j]] = [r, g, b, 1.0]
        }
      }
    })

    const tiCanvas = new ti.Canvas(canvasEl.value!)
    let startTime = Date.now()

    function animateFrame() {
      if (!isAnimating.value) return

      const currentTime = (Date.now() - startTime) / 1000.0

      kernel(currentTime)
      tiCanvas.setImage(pixels)
      status.value = `动画运行中: ${currentTime.toFixed(1)}s`

      animationId = requestAnimationFrame(animateFrame)
    }

    animateFrame()
    result.value = '动画已启动！'

  } catch (error) {
    console.error('运行课程5时发生错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
    isAnimating.value = false
    throw error
  }
}

// 第六课：认识粒子 - 绘制单个粒子
async function runLesson6(ti: any) {
  try {
    status.value = '正在初始化...'
    isAnimating.value = false

    const IMAGE_SIZE = 512
    const PARTICLE_RADIUS = 10  // 粒子半径：10 像素

    // 创建画布
    const pixels = ti.Vector.field(4, ti.f32, [IMAGE_SIZE, IMAGE_SIZE])

    ti.addToKernelScope({
      pixels,
      IMAGE_SIZE,
      PARTICLE_RADIUS
    })

    // 绘制单个粒子
    const kernel = ti.kernel(function drawParticle() {
      // 1. 清空画布（深色背景）
      for (let i of range(IMAGE_SIZE)) {
        for (let j of range(IMAGE_SIZE)) {
          pixels[[i, j]] = [0.05 * 1.0, 0.05 * 1.0, 0.1 * 1.0, 1.0]
        }
      }

      // 2. 粒子的中心位置（画布中心）
      let centerX = IMAGE_SIZE / 2.0
      let centerY = IMAGE_SIZE / 2.0

      // 3. 粒子的颜色（橙色）
      let colorR = 1.0 * 1.0  // 红色
      let colorG = 0.5 * 1.0  // 绿色
      let colorB = 0.2 * 1.0  // 蓝色

      // 4. 绘制粒子（圆形）
      for (let x of range(IMAGE_SIZE)) {
        for (let y of range(IMAGE_SIZE)) {
          // 计算当前像素到粒子中心的距离
          let dx = x - centerX
          let dy = y - centerY
          let distance = ti.sqrt(dx * dx * 1.0 + dy * dy * 1.0)

          // 如果距离小于半径，就是粒子内部
          if (distance <= PARTICLE_RADIUS) {
            pixels[[x * 1.0, y * 1.0]] = [colorR, colorG, colorB, 1.0]
          }
        }
      }
    })

    // 执行绘制
    status.value = 'GPU 正在绘制...'
    kernel()

    // 显示结果
    status.value = '正在显示图像...'
    const tiCanvas = new ti.Canvas(canvasEl.value!)
    await tiCanvas.setImage(pixels)

    status.value = '✅ 完成！'
    result.value = `成功绘制了一个半径为 ${PARTICLE_RADIUS} 像素的粒子`

  } catch (error) {
    console.error('运行课程6时发生错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
    throw error
  }
}

// 第七课：粒子系统 - 多个粒子和重力模拟
async function runLesson7(ti: any) {
  try {
    status.value = '正在初始化粒子系统...'
    isAnimating.value = true

    const PARTICLE_COUNT = 1000
    const IMAGE_SIZE = 512
    const PARTICLE_RADIUS = 10

    // 创建粒子位置、速度、颜色数组
    const positions = ti.Vector.field(2, ti.f32, [PARTICLE_COUNT])
    const velocities = ti.Vector.field(2, ti.f32, [PARTICLE_COUNT])
    const colors = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT])
    const pixels = ti.Vector.field(4, ti.f32, [IMAGE_SIZE, IMAGE_SIZE])

    ti.addToKernelScope({
      positions,
      velocities,
      colors,
      pixels,
      PARTICLE_COUNT,
      IMAGE_SIZE,
      PARTICLE_RADIUS
    })

    // 初始化粒子
    const initKernel = ti.kernel(function init() {
      for (let i of range(PARTICLE_COUNT)) {
        // 随机位置 (中心区域)
        positions[i] = [
          0.2 + ti.random() * 0.6,
          0.1 + ti.random() * 0.3
        ]

        // 随机速度
        velocities[i] = [
          (ti.random() - 0.5) * 0.02,
          ti.random() * 0.01
        ]

        // 随机颜色 - 彩虹色
        let hue = ti.random()
        if (hue < 0.33) {
          colors[i] = [
            (1.0 - hue / 0.33) * 1.0,
            (hue / 0.33) * 1.0,
            0.0 * 1.0
          ]
        } else if (hue < 0.66) {
          colors[i] = [
            0.0 * 1.0,
            (1.0 - (hue - 0.33) / 0.33) * 1.0,
            ((hue - 0.33) / 0.33) * 1.0
          ]
        } else {
          colors[i] = [
            ((hue - 0.66) / 0.33) * 1.0,
            0.0 * 1.0,
            (1.0 - (hue - 0.66) / 0.33) * 1.0
          ]
        }
      }
    })

    // 更新粒子（物理模拟）
    const updateKernel = ti.kernel(function update() {
      for (let i of range(PARTICLE_COUNT)) {
        let pos = positions[i]
        let vel = velocities[i]

        // 应用重力
        vel[1] = vel[1] - 0.001

        // 更新位置
        pos[0] = pos[0] + vel[0]
        pos[1] = pos[1] + vel[1]

        // 边界碰撞
        if (pos[1] < 0.0) {
          pos[1] = 0.0
          vel[1] = -vel[1] * 0.8
        }
        if (pos[0] < 0.0) {
          pos[0] = 0.0
          vel[0] = -vel[0] * 0.8
        }
        if (pos[0] > 1.0) {
          pos[0] = 1.0
          vel[0] = -vel[0] * 0.8
        }
        if (pos[1] > 1.0) {
          pos[1] = 1.0
          vel[1] = -vel[1] * 0.8
        }

        positions[i] = pos
        velocities[i] = vel
      }
    })

    // 渲染粒子
    const renderKernel = ti.kernel(function render() {
      // 清空画布（深色背景）
      for (let i of range(IMAGE_SIZE)) {
        for (let j of range(IMAGE_SIZE)) {
          pixels[[i, j]] = [0.02 * 1.0, 0.02 * 1.0, 0.05 * 1.0, 1.0]
        }
      }

      // 绘制粒子
      for (let i of range(PARTICLE_COUNT)) {
        let pos = positions[i]
        let col = colors[i]
        let cx = ti.floor(pos[0] * IMAGE_SIZE)
        let cy = ti.floor(pos[1] * IMAGE_SIZE)

        // 绘制圆形粒子（简化版：只画中心点）
        if (cx >= 0.0 && cx < IMAGE_SIZE && cy >= 0.0 && cy < IMAGE_SIZE) {
          pixels[[cx * 1.0, cy * 1.0]] = [col[0], col[1], col[2], 1.0]

          // 周围4个点
          if (cx > 0.0 && cy > 0.0) {
            pixels[[cx - 1.0, cy - 1.0]] = [col[0], col[1], col[2], 1.0]
          }
          if (cx < IMAGE_SIZE - 1.0 && cy > 0.0) {
            pixels[[cx + 1.0, cy - 1.0]] = [col[0], col[1], col[2], 1.0]
          }
          if (cx > 0.0 && cy < IMAGE_SIZE - 1.0) {
            pixels[[cx - 1.0, cy + 1.0]] = [col[0], col[1], col[2], 1.0]
          }
          if (cx < IMAGE_SIZE - 1.0 && cy < IMAGE_SIZE - 1.0) {
            pixels[[cx + 1.0, cy + 1.0]] = [col[0], col[1], col[2], 1.0]
          }
        }
      }
    })

    // 初始化
    initKernel()

    const tiCanvas = new ti.Canvas(canvasEl.value!)
    let frameCount = 0

    function animateFrame() {
      if (!isAnimating.value) return

      updateKernel()
      renderKernel()
      tiCanvas.setImage(pixels)

      frameCount++
      status.value = `粒子数量: ${PARTICLE_COUNT} | 帧: ${frameCount}`

      animationId = requestAnimationFrame(animateFrame)
    }

    animateFrame()
    result.value = `物理模拟已启动！${PARTICLE_COUNT} 个彩色粒子正在受重力影响下落`

  } catch (error) {
    console.error('运行课程7时发生错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
    isAnimating.value = false
    throw error
  }
}

// 第八课：粒子动画 - 单个粒子运动
async function runLesson8(ti: any) {
  try {
    status.value = '正在初始化粒子动画...'
    isAnimating.value = true

    const IMAGE_SIZE = 512
    const PARTICLE_RADIUS = 15  // 更大的粒子

    // 粒子位置和速度
    const position = ti.Vector.field(2, ti.f32, [1])
    const velocity = ti.Vector.field(2, ti.f32, [1])
    const pixels = ti.Vector.field(4, ti.f32, [IMAGE_SIZE, IMAGE_SIZE])

    ti.addToKernelScope({
      position,
      velocity,
      pixels,
      IMAGE_SIZE,
      PARTICLE_RADIUS
    })

    // 初始化粒子
    const initKernel = ti.kernel(function init() {
      // 初始位置：画布中心
      position[0] = [0.5, 0.5]

      // 初始速度：随机方向
      velocity[0] = [
        (ti.random() - 0.5) * 0.02,
        (ti.random() - 0.5) * 0.02
      ]
    })

    // 更新粒子物理
    const updateKernel = ti.kernel(function update() {
      let pos = position[0]
      let vel = velocity[0]

      // 更新位置
      pos[0] = pos[0] + vel[0]
      pos[1] = pos[1] + vel[1]

      // 边界碰撞检测
      if (pos[0] < 0.0 || pos[0] > 1.0) {
        vel[0] = -vel[0]  // 反转 X 速度
        // 确保粒子在边界内
        if (pos[0] < 0.0) pos[0] = 0.0
        if (pos[0] > 1.0) pos[0] = 1.0
      }

      if (pos[1] < 0.0 || pos[1] > 1.0) {
        vel[1] = -vel[1]  // 反转 Y 速度
        // 确保粒子在边界内
        if (pos[1] < 0.0) pos[1] = 0.0
        if (pos[1] > 1.0) pos[1] = 1.0
      }

      position[0] = pos
      velocity[0] = vel
    })

    // 渲染粒子
    const renderKernel = ti.kernel(function render() {
      // 清空画布
      for (let i of range(IMAGE_SIZE)) {
        for (let j of range(IMAGE_SIZE)) {
          pixels[[i, j]] = [0.03 * 1.0, 0.03 * 1.0, 0.08 * 1.0, 1.0]
        }
      }

      // 粒子位置
      let pos = position[0]
      let cx = ti.floor(pos[0] * IMAGE_SIZE)
      let cy = ti.floor(pos[1] * IMAGE_SIZE)

      // 绘制圆形粒子
      for (let x of range(IMAGE_SIZE)) {
        for (let y of range(IMAGE_SIZE)) {
          let dx = x - cx
          let dy = y - cy
          let dist = ti.sqrt(dx * dx * 1.0 + dy * dy * 1.0)

          if (dist <= PARTICLE_RADIUS) {
            // 根据距离中心的距离调整颜色（渐变效果）
            let brightness = 1.0 - dist / (PARTICLE_RADIUS * 1.0)
            pixels[[x, y]] = [
              brightness * 1.0,
              brightness * 0.6 * 1.0,
              brightness * 0.3 * 1.0,
              1.0
            ]
          }
        }
      }
    })

    // 初始化
    initKernel()

    const tiCanvas = new ti.Canvas(canvasEl.value!)
    let frameCount = 0

    function animateFrame() {
      if (!isAnimating.value) return

      updateKernel()
      renderKernel()
      tiCanvas.setImage(pixels)

      frameCount++
      status.value = `粒子动画 | 帧: ${frameCount} | 点击画布重置粒子`

      animationId = requestAnimationFrame(animateFrame)
    }

    animateFrame()
    result.value = '粒子动画已启动！点击画布可以重置粒子位置和速度'

    // 添加点击事件
    const canvas = canvasEl.value
    if (canvas) {
      const handleClick = () => {
        initKernel()
        result.value = '粒子已重置！'
      }
      canvas.addEventListener('click', handleClick)

      // 清理函数（在实际应用中需要处理）
      return () => {
        canvas.removeEventListener('click', handleClick)
      }
    }

  } catch (error) {
    console.error('运行课程8时发生错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
    isAnimating.value = false
    throw error
  }
}

// 第九课：粒子碰撞 - 弹性碰撞
async function runLesson9(ti: any) {
  try {
    status.value = '正在初始化粒子碰撞模拟...'
    isAnimating.value = true

    const IMAGE_SIZE = 512
    const PARTICLE_RADIUS = 20
    const PARTICLE_COUNT = 2  // 两个粒子

    // 两个粒子的位置、速度、颜色
    const positions = ti.Vector.field(2, ti.f32, [PARTICLE_COUNT])
    const velocities = ti.Vector.field(2, ti.f32, [PARTICLE_COUNT])
    const colors = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT])
    const radii = ti.field(ti.f32, [PARTICLE_COUNT])
    const pixels = ti.Vector.field(4, ti.f32, [IMAGE_SIZE, IMAGE_SIZE])

    ti.addToKernelScope({
      positions,
      velocities,
      colors,
      radii,
      pixels,
      IMAGE_SIZE,
      PARTICLE_COUNT,
      PARTICLE_RADIUS
    })

    // 初始化两个粒子
    const initKernel = ti.kernel(function init() {
      // 粒子1（红色）- 左侧
      positions[0] = [0.3, 0.5]
      velocities[0] = [0.01, 0.005]
      colors[0] = [1.0, 0.3, 0.3]
      radii[0] = PARTICLE_RADIUS * 1.0

      // 粒子2（蓝色）- 右侧
      positions[1] = [0.7, 0.5]
      velocities[1] = [-0.01, -0.005]
      colors[1] = [0.3, 0.3, 1.0]
      radii[1] = PARTICLE_RADIUS * 1.0
    })

    // 更新物理和碰撞检测
    const updateKernel = ti.kernel(function update() {
      // 更新每个粒子的位置
      for (let i of range(PARTICLE_COUNT)) {
        let pos = positions[i]
        let vel = velocities[i]

        pos[0] = pos[0] + vel[0]
        pos[1] = pos[1] + vel[1]

        positions[i] = pos
        velocities[i] = vel
      }

      // 检测粒子之间的碰撞
      let pos1 = positions[0]
      let pos2 = positions[1]
      let vel1 = velocities[0]
      let vel2 = velocities[1]
      let radiusSum = radii[0] + radii[1]

      // 计算距离
      let dx = pos2[0] - pos1[0]
      let dy = pos2[1] - pos1[1]
      let dist = ti.sqrt(dx * dx * 1.0 + dy * dy * 1.0)

      // 如果距离小于半径和，发生碰撞
      if (dist < radiusSum && dist > 0.001) {
        // 计算碰撞法线
        let nx = dx / dist
        let ny = dy / dist

        // 相对速度
        let dvx = vel1[0] - vel2[0]
        let dvy = vel1[1] - vel2[1]

        // 沿法线的相对速度
        let dvn = dvx * nx * 1.0 + dvy * ny * 1.0

        // 只有当粒子相互接近时才碰撞
        if (dvn > 0.0) {
          // 弹性碰撞：交换沿法线的速度分量
          vel1[0] = vel1[0] - dvn * nx * 1.0
          vel1[1] = vel1[1] - dvn * ny * 1.0
          vel2[0] = vel2[0] + dvn * nx * 1.0
          vel2[1] = vel2[1] + dvn * ny * 1.0

          velocities[0] = vel1
          velocities[1] = vel2
        }
      }

      // 边界碰撞
      for (let i of range(PARTICLE_COUNT)) {
        let pos = positions[i]
        let vel = velocities[i]
        let r = radii[i]

        // 归一化到 0-1 范围
        let posNormX = pos[0]
        let posNormY = pos[1]

        if (posNormX < r / IMAGE_SIZE) {
          pos[0] = r / IMAGE_SIZE
          vel[0] = -vel[0]
        }
        if (posNormX > 1.0 - r / IMAGE_SIZE) {
          pos[0] = 1.0 - r / IMAGE_SIZE
          vel[0] = -vel[0]
        }
        if (posNormY < r / IMAGE_SIZE) {
          pos[1] = r / IMAGE_SIZE
          vel[1] = -vel[1]
        }
        if (posNormY > 1.0 - r / IMAGE_SIZE) {
          pos[1] = 1.0 - r / IMAGE_SIZE
          vel[1] = -vel[1]
        }

        positions[i] = pos
        velocities[i] = vel
      }
    })

    // 渲染粒子
    const renderKernel = ti.kernel(function render() {
      // 清空画布
      for (let i of range(IMAGE_SIZE)) {
        for (let j of range(IMAGE_SIZE)) {
          pixels[[i, j]] = [0.02 * 1.0, 0.02 * 1.0, 0.05 * 1.0, 1.0]
        }
      }

      // 绘制每个粒子
      for (let p of range(PARTICLE_COUNT)) {
        let pos = positions[p]
        let col = colors[p]
        let radius = radii[p]
        let cx = ti.floor(pos[0] * IMAGE_SIZE)
        let cy = ti.floor(pos[1] * IMAGE_SIZE)

        // 绘制圆形
        for (let x of range(IMAGE_SIZE)) {
          for (let y of range(IMAGE_SIZE)) {
            let dx = x - cx
            let dy = y - cy
            let dist = ti.sqrt(dx * dx * 1.0 + dy * dy * 1.0)

            if (dist <= radius) {
              let brightness = 1.0 - dist / radius
              pixels[[x, y]] = [
                col[0] * brightness,
                col[1] * brightness,
                col[2] * brightness,
                1.0
              ]
            }
          }
        }
      }
    })

    // 初始化
    initKernel()

    const tiCanvas = new ti.Canvas(canvasEl.value!)
    let frameCount = 0

    function animateFrame() {
      if (!isAnimating.value) return

      updateKernel()
      renderKernel()
      tiCanvas.setImage(pixels)

      frameCount++
      status.value = `粒子碰撞 | 帧: ${frameCount} | 点击画布重置`

      animationId = requestAnimationFrame(animateFrame)
    }

    animateFrame()
    result.value = '弹性碰撞模拟已启动！两个粒子会在碰撞时交换速度'

    // 添加点击事件
    const canvas = canvasEl.value
    if (canvas) {
      const handleClick = () => {
        initKernel()
        result.value = '粒子已重置！'
      }
      canvas.addEventListener('click', handleClick)
    }

  } catch (error) {
    console.error('运行课程9时发生错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
    isAnimating.value = false
    throw error
  }
}

// 第十课：碰撞系统 - 多个粒子的碰撞
async function runLesson10(ti: any) {
  try {
    status.value = '正在初始化碰撞系统...'
    isAnimating.value = true

    const IMAGE_SIZE = 512
    const PARTICLE_COUNT = 20  // 20个粒子
    const PARTICLE_RADIUS = 15

    // 粒子属性
    const positions = ti.Vector.field(2, ti.f32, [PARTICLE_COUNT])
    const velocities = ti.Vector.field(2, ti.f32, [PARTICLE_COUNT])
    const colors = ti.Vector.field(3, ti.f32, [PARTICLE_COUNT])
    const radii = ti.field(ti.f32, [PARTICLE_COUNT])
    const masses = ti.field(ti.f32, [PARTICLE_COUNT])
    const pixels = ti.Vector.field(4, ti.f32, [IMAGE_SIZE, IMAGE_SIZE])

    ti.addToKernelScope({
      positions,
      velocities,
      colors,
      radii,
      masses,
      pixels,
      PARTICLE_COUNT,
      IMAGE_SIZE,
      PARTICLE_RADIUS
    })

    // 初始化粒子
    const initKernel = ti.kernel(function init() {
      for (let i of range(PARTICLE_COUNT)) {
        // 随机位置（确保不重叠）
        positions[i] = [
          0.2 + ti.random() * 0.6,
          0.2 + ti.random() * 0.6
        ]

        // 随机速度
        velocities[i] = [
          (ti.random() - 0.5) * 0.015,
          (ti.random() - 0.5) * 0.015
        ]

        // 随机颜色
        colors[i] = [
          ti.random(),
          ti.random(),
          ti.random()
        ]

        // 随机大小和对应质量
        let size = 10.0 + ti.random() * 10.0
        radii[i] = size
        masses[i] = size * size  // 质量与面积成正比
      }
    })

    // 更新物理和碰撞
    const updateKernel = ti.kernel(function update() {
      // 更新位置
      for (let i of range(PARTICLE_COUNT)) {
        let pos = positions[i]
        let vel = velocities[i]

        pos[0] = pos[0] + vel[0]
        pos[1] = pos[1] + vel[1]

        positions[i] = pos
        velocities[i] = vel
      }

      // 粒子间碰撞检测（简化版：只检测相邻粒子）
      for (let i of range(PARTICLE_COUNT)) {
        for (let j of range(PARTICLE_COUNT)) {
          if (i === j) continue  // 跳过自身

          let pos1 = positions[i]
          let pos2 = positions[j]
          let vel1 = velocities[i]
          let vel2 = velocities[j]
          let m1 = masses[i]
          let m2 = masses[j]
          let r1 = radii[i]
          let r2 = radii[j]

          let dx = pos2[0] - pos1[0]
          let dy = pos2[1] - pos1[1]
          let dist = ti.sqrt(dx * dx * 1.0 + dy * dy * 1.0)
          let radiusSum = r1 + r2

          if (dist < radiusSum && dist > 0.001) {
            // 碰撞法线
            let nx = dx / dist
            let ny = dy / dist

            // 相对速度
            let dvx = vel1[0] - vel2[0]
            let dvy = vel1[1] - vel2[1]
            let dvn = dvx * nx * 1.0 + dvy * ny * 1.0

            if (dvn > 0.0) {
              // 简化碰撞：只交换速度的一半
              let jx = dvn * nx * 0.5 * 1.0
              let jy = dvn * ny * 0.5 * 1.0

              vel1[0] = vel1[0] - jx
              vel1[1] = vel1[1] - jy
              vel2[0] = vel2[0] + jx
              vel2[1] = vel2[1] + jy

              velocities[i] = vel1
              velocities[j] = vel2
            }
          }
        }
      }

      // 边界碰撞
      for (let i of range(PARTICLE_COUNT)) {
        let pos = positions[i]
        let vel = velocities[i]
        let r = radii[i]

        let posNormX = pos[0]
        let posNormY = pos[1]

        if (posNormX < r / IMAGE_SIZE) {
          pos[0] = r / IMAGE_SIZE
          vel[0] = -vel[0]
        }
        if (posNormX > 1.0 - r / IMAGE_SIZE) {
          pos[0] = 1.0 - r / IMAGE_SIZE
          vel[0] = -vel[0]
        }
        if (posNormY < r / IMAGE_SIZE) {
          pos[1] = r / IMAGE_SIZE
          vel[1] = -vel[1]
        }
        if (posNormY > 1.0 - r / IMAGE_SIZE) {
          pos[1] = 1.0 - r / IMAGE_SIZE
          vel[1] = -vel[1]
        }

        positions[i] = pos
        velocities[i] = vel
      }
    })

    // 渲染粒子
    const renderKernel = ti.kernel(function render() {
      // 清空画布
      for (let i of range(IMAGE_SIZE)) {
        for (let j of range(IMAGE_SIZE)) {
          pixels[[i, j]] = [0.02 * 1.0, 0.02 * 1.0, 0.05 * 1.0, 1.0]
        }
      }

      // 绘制每个粒子
      for (let p of range(PARTICLE_COUNT)) {
        let pos = positions[p]
        let col = colors[p]
        let radius = radii[p]
        let cx = ti.floor(pos[0] * IMAGE_SIZE)
        let cy = ti.floor(pos[1] * IMAGE_SIZE)

        // 绘制圆形
        for (let x of range(IMAGE_SIZE)) {
          for (let y of range(IMAGE_SIZE)) {
            let dx = x - cx
            let dy = y - cy
            let dist = ti.sqrt(dx * dx * 1.0 + dy * dy * 1.0)

            if (dist <= radius) {
              let brightness = 1.0 - dist / radius
              pixels[[x, y]] = [
                col[0] * brightness,
                col[1] * brightness,
                col[2] * brightness,
                1.0
              ]
            }
          }
        }
      }
    })

    // 初始化
    initKernel()

    const tiCanvas = new ti.Canvas(canvasEl.value!)
    let frameCount = 0

    function animateFrame() {
      if (!isAnimating.value) return

      updateKernel()
      renderKernel()
      tiCanvas.setImage(pixels)

      frameCount++
      status.value = `碰撞系统 | 粒子: ${PARTICLE_COUNT} | 帧: ${frameCount}`

      animationId = requestAnimationFrame(animateFrame)
    }

    animateFrame()
    result.value = `碰撞系统已启动！${PARTICLE_COUNT} 个粒子互相碰撞，大质量粒子对碰撞影响更大`

    // 添加点击事件
    const canvas = canvasEl.value
    if (canvas) {
      const handleClick = () => {
        initKernel()
        result.value = '粒子已重置！'
      }
      canvas.addEventListener('click', handleClick)
    }

  } catch (error) {
    console.error('运行课程10时发生错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
    isAnimating.value = false
    throw error
  }
}




function nextLesson() {
  if (currentLesson.value < 9) {
    stopAnimation()
    currentLesson.value++
    loadLessonContent()
  }
}

function prevLesson() {
  if (currentLesson.value > 0) {
    stopAnimation()
    currentLesson.value--
    loadLessonContent()
  }
}

function stopAnimation() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
    isAnimating.value = false
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

  &:disabled {
    opacity: 0.3;
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
