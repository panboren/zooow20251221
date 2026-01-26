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
      // 这两个循环会并行执行！
      for (let i of range(512)) {
        for (let j of range(512)) {
          // 根据位置计算颜色
          const b = 0.5         // 蓝色通道：固定
          const a = 1.0         // Alpha 通道：不透明
          const r = 1 - j/511;  // 红色：从上到下渐变
          const g = j/511;      // 绿色：从上到下渐变

          // 设置像素颜色 - 使用向量赋值
          pixels[[i, j]] = [r, g, b, a]

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
