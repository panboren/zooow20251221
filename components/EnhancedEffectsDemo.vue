<template>
  <div class="enhanced-effects-demo">
  </div>
</template>

<!--
<template>
  <div class="enhanced-effects-demo">
    <div ref="container" class="demo-container" />

    &lt;!&ndash; 控制面板 &ndash;&gt;
    <div class="control-panel">
      <h3>特效控制器</h3>

      <div class="control-group">
        <label>Bloom 强度: {{ bloomStrength }}</label>
        <input
          v-model.number="bloomStrength"
          type="range"
          min="0"
          max="3"
          step="0.1"
          @input="updateBloom"
        />
      </div>

      <div class="control-group">
        <label>Bloom 半径: {{ bloomRadius }}</label>
        <input
          v-model.number="bloomRadius"
          type="range"
          min="0"
          max="1"
          step="0.05"
          @input="updateBloom"
        />
      </div>

      <div class="control-group">
        <label>Bloom 阈值: {{ bloomThreshold }}</label>
        <input
          v-model.number="bloomThreshold"
          type="range"
          min="0"
          max="1"
          step="0.05"
          @input="updateBloom"
        />
      </div>

      <div class="control-group">
        <label>
          <input v-model="showStats" type="checkbox" @change="toggleStats" />
          显示性能监控
        </label>
      </div>

      <div class="control-group">
        <label>粒子数量: {{ particleCount }}</label>
        <select v-model="particleCount" @change="restartAnimation">
          <option value="1000">1000</option>
          <option value="5000">5000</option>
          <option value="8000">8000</option>
          <option value="10000">10000</option>
        </select>
      </div>

      <div class="button-group">
        <button @click="restartAnimation">重新播放</button>
        <button @click="toggleAnimation">
          {{ isPlaying ? '暂停' : '播放' }}
        </button>
      </div>

      <div class="info">
        <p>当前 FPS: {{ fps }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { createAnimationControllerEnhanced } from '~/utils/AnimationControllerEnhanced.js'

const container = ref(null)
const bloomStrength = ref(1.5)
const bloomRadius = ref(0.4)
const bloomThreshold = ref(0.85)
const showStats = ref(true)
const particleCount = ref(8000)
const isPlaying = ref(true)
const fps = ref(0)

let animationController = null
let particles = null
let animationId = null
let lastTime = 0
let frameCount = 0

onMounted(async () => {
  // 初始化动画控制器
  animationController = createAnimationControllerEnhanced()
  await animationController.init(
    container.value,
    true,  // 启用后处理
    true   // 启用性能监控
  )

  // 显示性能监控
  animationController.togglePerformanceMonitor(showStats.value)

  // 开始动画
  startAnimation()

  // 启动 FPS 计算
  updateFPS()
})

onUnmounted(() => {
  // 清理资源
  stopAnimation()
  animationController?.dispose()
})

function startAnimation() {
  // 创建粒子系统
  particles = createParticles(particleCount.value)

  // 启动动画循环
  isPlaying.value = true
  animate()
}

function stopAnimation() {
  isPlaying.value = false
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  // 清理粒子
  if (particles) {
    particles.dispose()
    particles = null
  }
}

function animate() {
  if (!isPlaying.value) return

  animationId = requestAnimationFrame(animate)

  // 更新粒子位置
  const time = performance.now() * 0.001
  particles.updatePositions((i, x, y, z) => {
    const idx = i * 3
    const radius = Math.sqrt(x * x + y * y + z * z)
    const wave = Math.sin(time * 2 + i * 0.01) * 0.5
    const scale = (radius + wave) / radius

    return {
      x: x * scale,
      y: y * scale,
      z: z * scale
    }
  })

  // 旋转粒子系统
  particles.mesh.rotation.y += 0.001
  particles.mesh.rotation.x += 0.0005

  // 更新 FPS
  frameCount++
}

function createParticles(count) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  const colorPalette = [
    new THREE.Color(0x00ffff),
    new THREE.Color(0xff00ff),
    new THREE.Color(0xffff00)
  ]

  for (let i = 0; i < count; i++) {
    // 球体分布
    const radius = 50 * Math.cbrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    // 颜色
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    // 大小
    sizes[i] = 8 * (0.5 + Math.random() * 0.5)
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 8,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  const points = new THREE.Points(geometry, material)
  animationController.scene.add(points)

  return {
    mesh: points,
    geometry,
    material,
    count,

    updatePositions(updateFn) {
      const positions = geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        const idx = i * 3
        const result = updateFn(i, positions[idx], positions[idx + 1], positions[idx + 2])
        if (result) {
          positions[idx] = result.x
          positions[idx + 1] = result.y
          positions[idx + 2] = result.z
        }
      }
      geometry.attributes.position.needsUpdate = true
    },

    dispose() {
      animationController.scene.remove(points)
      geometry.dispose()
      material.dispose()
    }
  }
}

function updateBloom() {
  animationController?.setBloom({
    strength: bloomStrength.value,
    radius: bloomRadius.value,
    threshold: bloomThreshold.value
  })
}

function toggleStats() {
  animationController?.togglePerformanceMonitor(showStats.value)
}

function restartAnimation() {
  stopAnimation()
  startAnimation()
}

function toggleAnimation() {
  if (isPlaying.value) {
    stopAnimation()
  } else {
    animate()
  }
}

function updateFPS() {
  const now = performance.now()
  if (now - lastTime >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastTime = now
  }
  requestAnimationFrame(updateFPS)
}
</script>

<style scoped>
.enhanced-effects-demo {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.demo-container {
  width: 100%;
  height: 100%;
  background: #000;
}

.control-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  color: white;
  z-index: 100;
}

.control-panel h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #00ffff;
}

.control-group {
  margin-bottom: 16px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.control-group input[type="range"] {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #00ffff;
  border-radius: 50%;
  cursor: pointer;
}

.control-group select {
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  outline: none;
}

.control-group input[type="checkbox"] {
  margin-right: 8px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.button-group button {
  flex: 1;
  padding: 10px;
  background: linear-gradient(135deg, #00ffff, #0088ff);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.button-group button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
}

.button-group button:active {
  transform: translateY(0);
}

.info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.info p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
-->
