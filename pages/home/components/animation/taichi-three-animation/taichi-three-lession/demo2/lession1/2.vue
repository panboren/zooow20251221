<template>
  <div class="page-content">
    <div class="demo-container">
      <h1>taichi.js 渐变演示</h1>
      <canvas ref="canvasEl" width="512" height="512"></canvas>
      <div class="info">{{ status }}</div>
      <button class="btn" @click="runDemo" :disabled="isRunning">
        {{ isRunning ? '运行中...' : '运行代码' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { $loadTaichi } = useNuxtApp()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const status = ref('点击按钮运行演示')
const isRunning = ref(false)

let ti: any = null

// 运行演示
async function runDemo() {
  if (isRunning.value) return

  isRunning.value = true
  status.value = '正在初始化 taichi.js...'

  try {
    // 加载 taichi.js
    if (!ti) {
      ti = await $loadTaichi()
    }

    // 初始化 WebGPU
    await ti.init()
    status.value = '正在计算...'

    // 创建存储颜色的字段 - 使用 Vector 类型存储 RGBA 4个分量
    const pixels = ti.Vector.field(4, ti.f32, [512, 512])
    const debugLog = ti.field(ti.i32, [10])  // 专门的调试 field

    // 将 field 添加到内核作用域 - 必须包含所有内核中使用的变量
    ti.addToKernelScope({ pixels, debugLog })

    // 创建内核
    const kernel = ti.kernel(function k() {
      // 定义三角形的三个顶点 (x, y) - 范围 0-511
      const v0 = [256, 50]   // 顶点1：顶部中心
      const v1 = [50, 400]   // 顶点2：左下
      const v2 = [462, 400]  // 顶点3：右下

      // 这两个循环会并行执行！
      for (let i of range(512)) {
        for (let j of range(512)) {
          // 像素坐标 (i, j) -> (x, y)
          const x = i
          const y = j

          // 计算三角形三边
          const ax = v1[0] - v0[0]
          const ay = v1[1] - v0[1]
          const bx = v2[0] - v1[0]
          const by = v2[1] - v1[1]
          const cx = v0[0] - v2[0]
          const cy = v0[1] - v2[1]

          // 计算点到各边的向量
          const apx = x - v0[0]
          const apy = y - v0[1]
          const bpx = x - v1[0]
          const bpy = y - v1[1]
          const cpx = x - v2[0]
          const cpy = y - v2[1]

          // 计算叉积（用于判断方向）
          const c1 = ax * apy - ay * apx
          const c2 = bx * bpy - by * bpx
          const c3 = cx * cpy - cy * cpx

          // 判断点是否在三角形内（所有叉积同号）
          const inside = (c1 >= 0 && c2 >= 0 && c3 >= 0) ||
                         (c1 <= 0 && c2 <= 0 && c3 <= 0)

          // 根据位置计算背景颜色（红绿渐变）
          const b = 0.5         // 蓝色通道：固定
          const bg_r = 1 - j/511  // 背景：红色从上到下渐变
          const bg_g = j/511      // 背景：绿色从上到下渐变

          // 判断是否在三角形内
          if (inside) {
            // 三角形内部：黄色
            pixels[[i, j]] = [1, 1, 0, 1]
          } else {
            // 三角形外部：背景渐变
            pixels[[i, j]] = [bg_r, bg_g, b, 1]
          }

          // 调试：记录一些关键点
          if (i < 10) {
            debugLog[i] = i * j
          }
        }
      }
    })

    // 执行内核
    kernel()
    status.value = '正在渲染...'

    // 执行后检查调试信息
    const logs = await debugLog.toArray1D()
    console.log('调试信息:', logs)

    // 显示到 Canvas
    if (canvasEl.value) {
      const tiCanvas = new ti.Canvas(canvasEl.value)

      console.log('Canvas 元素:', canvasEl.value)
      console.log('tiCanvas 对象:', tiCanvas)
      console.log('是否有 setImage 方法:', typeof tiCanvas.setImage)
      console.log('pixels 字段:', pixels)

      await tiCanvas.setImage(pixels)
      console.log('✅ setImage 执行完成')
      status.value = '✅ 完成！'

      // 手动用 2D context 测试 Canvas 是否可用
      const ctx = canvasEl.value.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'red'
        ctx.fillRect(10, 10, 100, 100)
        console.log('✅ Canvas 2D 测试通过')
      }
    }
  } catch (error) {
    console.error('执行错误:', error)
    status.value = '❌ 错误: ' + (error as Error).message
  } finally {
    isRunning.value = false
  }
}

// 页面挂载后自动运行
onMounted(async () => {
  await runDemo()
})
</script>

<style scoped lang="scss">
.page-content {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e1e1e;
}

.demo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: #252526;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

h1 {
  color: #4ec9b0;
  margin: 0;
  font-size: 28px;
}

canvas {
  background: #000;
  border: 2px solid #3c3c3c;
  border-radius: 8px;
}

.info {
  padding: 12px 24px;
  background: #2d2d30;
  border-radius: 6px;
  color: #d4d4d4;
  font-size: 14px;
  min-width: 200px;
  text-align: center;
}

.btn {
  padding: 12px 32px;
  background: #4ec9b0;
  color: #1e1e1e;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #3db89e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(78, 201, 176, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@media (max-width: 768px) {
  canvas {
    width: 100%;
    max-width: 512px;
    height: auto;
  }
}
</style>
