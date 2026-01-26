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

    const pixelsTest = ti.Vector.field(4, ti.f32, [512, 512])


    // 定义辅助函数：计算点到三边的叉积（用于抗锯齿）
    const triangleEdgeFunction = function edge(x, y, ax, ay, bx, by) {
      // 叉积 = (b-a) × (p-a)
      return (bx - ax) * (y - ay) - (by - ay) * (x - ax)
    }

    // 将 field 和函数添加到内核作用域
    ti.addToKernelScope({ pixels, debugLog, triangleEdgeFunction,pixelsTest })

    // 创建内核
    const kernel = ti.kernel(function k() {
      // 定义三角形的三个顶点（使用浮点数）
      const v0 = [256.0, 50.0]
      const v1 = [50.0, 400.0]
      const v2 = [462.0, 400.0]

      // 这两个循环会并行执行！
      for (let i of range(512)) {
        for (let j of range(512)) {
          // 像素坐标 (i, j) -> (x, y)，转换为浮点数
          const x = i * 1.0
          const y = j * 1.0

          // 计算点到三边的距离
          const w0 = triangleEdgeFunction(x, y, v1[0], v1[1], v2[0], v2[1])
          const w1 = triangleEdgeFunction(x, y, v2[0], v2[1], v0[0], v0[1])
          const w2 = triangleEdgeFunction(x, y, v0[0], v0[1], v1[0], v1[1])

          // 判断点是否在三角形内
          const inside = (w0 >= 0.0 && w1 >= 0.0 && w2 >= 0.0) ||
                       (w0 <= 0.0 && w1 <= 0.0 && w2 <= 0.0)

          // 背景颜色：渐变（使用浮点数）
          const bg_r = 0.3 + 0.4 * (i * 1.0 / 511.0)
          const bg_g = 0.3 + 0.4 * (j * 1.0 / 511.0)
          const bg_b = 0.5

          // 三角形颜色：黄色
          const tri_r = 1.0
          const tri_g = 1.0
          const tri_b = 0.0

          // 根据是否在内部设置颜色（简单版本，不抗锯齿）
          if (inside) {
            pixels[[i, j]] = [tri_r, tri_g, tri_b, 1.0]
          } else {
            pixels[[i, j]] = [bg_r, bg_g, bg_b, 1.0]
          }
          pixelsTest[[i, j]] = [i,j, 0.0, 0.0]
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
    console.log('调试信息:', logs[2])

    // 显示到 Canvas
    if (canvasEl.value) {
      const tiCanvas = new ti.Canvas(canvasEl.value)

      console.log('Canvas 元素:', canvasEl.value)
      console.log('tiCanvas 对象:', tiCanvas)
      console.log('是否有 setImage 方法:', typeof tiCanvas.setImage)
      console.log('pixels 字段:', pixels)
      const pixels100 = await pixelsTest.toArray1D()
      console.log('pixels 字段:', pixels100)
      console.log('pixels 字段:', pixels100[2])

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
