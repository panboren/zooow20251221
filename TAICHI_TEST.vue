<template>
  <div class="taichi-test">
    <h2>Taichi.js 测试页面</h2>
    
    <div class="status">
      <h3>状态</h3>
      <p>Taichi初始化: {{ taichiReady ? '✅ 已就绪' : '⏳ 未就绪' }}</p>
      <p>GPU模式: {{ useGPU ? '✅ 是' : '❌ 否' }}</p>
      <p>粒子数量: {{ particleCount }}</p>
      <p>FPS: {{ fps }}</p>
    </div>

    <div class="controls">
      <button @click="runTest" :disabled="!taichiReady">
        运行Taichi测试
      </button>
      <button @click="runBenchmark" :disabled="!taichiReady">
        运行性能测试
      </button>
    </div>

    <div class="log">
      <h3>日志</h3>
      <div v-for="(log, index) in logs" :key="index" class="log-entry">
        {{ log }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const taichiReady = ref(false)
const useGPU = ref(false)
const particleCount = ref(0)
const fps = ref(0)
const logs = ref([])

function addLog(message) {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift(`[${time}] ${message}`)
}

onMounted(async () => {
  addLog('检查Taichi.js状态...')

  // 等待一小段时间，确保插件初始化
  await new Promise(resolve => setTimeout(resolve, 1000))

  if (typeof window !== 'undefined' && window.$nuxt) {
    const nuxtApp = window.$nuxt
    const taichiUtils = nuxtApp.$taichiUtils

    if (taichiUtils) {
      taichiReady.value = taichiUtils.isReady()
      useGPU.value = taichiUtils.isGPU()
      
      if (taichiReady.value) {
        addLog(`✅ Taichi.js已就绪 (GPU: ${useGPU.value ? '是' : '否'})`)
      } else {
        addLog('⚠️ Taichi.js未就绪')
      }
    } else {
      addLog('❌ Taichi Utils未找到')
    }
  } else {
    addLog('❌ Nuxt实例不可用')
  }
})

async function runTest() {
  addLog('开始Taichi测试...')

  try {
    const nuxtApp = window.$nuxt
    const taichiUtils = nuxtApp.$taichiUtils

    // 创建粒子系统
    const particleSystem = taichiUtils.createParticleSystem({
      particleCount: 10000,
      timeStep: 0.016
    })

    particleCount.value = 10000
    addLog(`✅ 创建了${particleCount.value}个粒子`)

    // 运行几帧
    const frameCount = 10
    const startTime = performance.now()

    for (let i = 0; i < frameCount; i++) {
      await particleSystem.update(0.016, i * 0.016)
    }

    const endTime = performance.now()
    const avgTime = (endTime - startTime) / frameCount
    fps.value = Math.round(1000 / avgTime)

    addLog(`✅ 完成${frameCount}帧更新`)
    addLog(`平均每帧: ${avgTime.toFixed(2)}ms`)
    addLog(`估算FPS: ${fps.value}`)

    // 清理
    particleSystem.destroy()
    addLog('✅ 测试完成')

  } catch (error) {
    addLog(`❌ 测试失败: ${error.message}`)
    console.error(error)
  }
}

async function runBenchmark() {
  addLog('开始性能测试...')

  try {
    const nuxtApp = window.$nuxt
    const taichiUtils = nuxtApp.$taichiUtils

    const particleCounts = [1000, 5000, 10000, 20000, 50000]
    const results = []

    for (const count of particleCounts) {
      addLog(`测试 ${count} 个粒子...`)

      const particleSystem = taichiUtils.createParticleSystem({
        particleCount: count,
        timeStep: 0.016
      })

      const frameCount = 10
      const startTime = performance.now()

      for (let i = 0; i < frameCount; i++) {
        await particleSystem.update(0.016, i * 0.016)
      }

      const endTime = performance.now()
      const avgTime = (endTime - startTime) / frameCount
      const fps = Math.round(1000 / avgTime)

      results.push({ count, avgTime, fps })
      addLog(`  ${count}粒子: ${avgTime.toFixed(2)}ms/frame, ${fps} FPS`)

      particleSystem.destroy()
    }

    addLog('✅ 性能测试完成')
    addLog('结果汇总:')
    results.forEach(r => {
      addLog(`  ${r.count}粒子: ${r.fps} FPS`)
    })

  } catch (error) {
    addLog(`❌ 性能测试失败: ${error.message}`)
    console.error(error)
  }
}
</script>

<style scoped>
.taichi-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.status, .controls, .log {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.status h3, .log h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.controls button {
  margin-right: 10px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
}

.controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.log {
  max-height: 400px;
  overflow-y: auto;
  background: #f5f5f5;
}

.log-entry {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  font-family: monospace;
  font-size: 13px;
}
</style>
