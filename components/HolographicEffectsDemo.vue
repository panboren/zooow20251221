<template>
  <div class="enhanced-effects-demo">
  </div>
</template>
<script setup lang="ts">
</script>
<!--
<template>
  <div class="holographic-demo">
    <div ref="container" class="demo-container" />

    &lt;!&ndash; 控制面板 &ndash;&gt;
    <div class="control-panel">
      <h3>🔮 全息特效控制器</h3>

      <div class="control-group">
        <label>特效类型</label>
        <select v-model="currentEffect" @change="switchEffect">
          <option value="holographic-data-stream">全息数据流</option>
          <option value="holographic-ring-array">全息环形阵列</option>
          <option value="holographic-spiral">全息螺旋</option>
          <option value="holographic-sphere-array">全息球体阵列</option>
          <option value="holographic-glitch">全息故障艺术</option>
        </select>
      </div>

      <div class="control-group">
        <label>主色调</label>
        <select v-model="currentColor" @change="updateColor">
          <option value="#00ffff">青色</option>
          <option value="#ff00ff">洋红色</option>
          <option value="#00ff00">绿色</option>
          <option value="#ffff00">黄色</option>
          <option value="#ffffff">白色</option>
        </select>
      </div>

      <div class="control-group">
        <label>故障强度: {{ glitchIntensity }}</label>
        <input
          v-model.number="glitchIntensity"
          type="range"
          min="0"
          max="1"
          step="0.05"
          @input="updateGlitch"
        />
      </div>

      <div class="control-group">
        <label>发光强度: {{ glowIntensity }}</label>
        <input
          v-model.number="glowIntensity"
          type="range"
          min="0"
          max="2"
          step="0.1"
          @input="updateGlow"
        />
      </div>

      <div class="control-group">
        <label>
          <input v-model="showStats" type="checkbox" @change="toggleStats" />
          显示性能监控
        </label>
      </div>

      <div class="button-group">
        <button @click="restartEffect">🔄 重新播放</button>
        <button @click="toggleEffect">
          {{ isPlaying ? '⏸️ 暂停' : '▶️ 播放' }}
        </button>
      </div>

      <div class="info">
        <p>当前 FPS: {{ fps }}</p>
        <p>对象数量: {{ objectCount }}</p>
      </div>
    </div>

    &lt;!&ndash; 标题 &ndash;&gt;
    <div class="title-overlay">
      <h1 class="holographic-title">HOLOGRAPHIC</h1>
      <p class="holographic-subtitle">INTERACTIVE EXPERIENCE</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { createAnimationControllerEnhanced } from '~/utils/AnimationControllerEnhanced.js'
import {
  animateHolographicDataStream,
  animateHolographicRingArray,
  animateHolographicSpiral,
  animateHolographicSphereArray,
  animateHolographicGlitch,
  updateHolographicObjects,
  setHolographicGlitchIntensity
} from '~/pages/home/components/animation/animations/holographic/holographic-animations-enhanced.js'

const container = ref(null)
const currentEffect = ref('holographic-data-stream')
const currentColor = ref('#00ffff')
const glitchIntensity = ref(0.3)
const glowIntensity = ref(1.0)
const showStats = ref(true)
const isPlaying = ref(true)
const fps = ref(60)
const objectCount = ref(0)

let animationController = null
let currentTimeline = null
let animationId = null
let lastTime = 0
let frameCount = 0
let holographicTime = 0

onMounted(async () => {
  // 初始化动画控制器
  animationController = createAnimationControllerEnhanced()
  await animationController.init(
    container.value,
    true,  // 启用后处理（增强全息发光效果）
    true   // 启用性能监控
  )

  // 显示性能监控
  animationController.togglePerformanceMonitor(showStats.value)

  // 开始特效
  startEffect()

  // 启动全息更新循环
  startHolographicLoop()

  // 启动 FPS 计算
  updateFPS()
})

onUnmounted(() => {
  // 清理资源
  stopEffect()
  stopHolographicLoop()
  animationController?.dispose()
})

function startEffect() {
  isPlaying.value = true
  objectCount.value = 0

  // 根据选择的特效类型播放
  switch (currentEffect.value) {
    case 'holographic-data-stream':
      currentTimeline = animateHolographicDataStream(
        animationController.scene,
        animationController.camera,
        animationController.renderer,
        animationController.controls
      )
      objectCount.value = 4000
      break
    case 'holographic-ring-array':
      currentTimeline = animateHolographicRingArray(
        animationController.scene,
        animationController.camera,
        animationController.renderer,
        animationController.controls
      )
      objectCount.value = 3000
      break
    case 'holographic-spiral':
      currentTimeline = animateHolographicSpiral(
        animationController.scene,
        animationController.camera,
        animationController.renderer,
        animationController.controls
      )
      objectCount.value = 2000
      break
    case 'holographic-sphere-array':
      currentTimeline = animateHolographicSphereArray(
        animationController.scene,
        animationController.camera,
        animationController.renderer,
        animationController.controls
      )
      objectCount.value = 64
      break
    case 'holographic-glitch':
      currentTimeline = animateHolographicGlitch(
        animationController.scene,
        animationController.camera,
        animationController.renderer,
        animationController.controls
      )
      objectCount.value = 2000
      break
  }

  // 应用当前设置
  updateGlitch()
  updateGlow()
}

function stopEffect() {
  isPlaying.value = false

  if (currentTimeline) {
    currentTimeline.kill()
    currentTimeline = null
  }

  // 清理场景中的全息对象
  if (animationController) {
    const scene = animationController.scene
    scene.traverse((object) => {
      if (object.userData.isHolographic) {
        scene.remove(object)
        if (object.geometry) object.geometry.dispose()
        if (object.material) object.material.dispose()
      }
    })
  }
}

function switchEffect() {
  stopEffect()
  setTimeout(() => {
    startEffect()
  }, 100)
}

function restartEffect() {
  switchEffect()
}

function toggleEffect() {
  if (isPlaying.value) {
    if (currentTimeline) {
      currentTimeline.pause()
    }
    isPlaying.value = false
  } else {
    if (currentTimeline) {
      currentTimeline.resume()
    }
    isPlaying.value = true
  }
}

function updateColor() {
  const color = new THREE.Color(currentColor.value)

  if (animationController) {
    const scene = animationController.scene
    scene.traverse((object) => {
      if (object.userData.isHolographic && object.material.uniforms?.uColor) {
        object.material.uniforms.uColor.value.set(color)
      }
    })
  }
}

function updateGlitch() {
  if (animationController) {
    setHolographicGlitchIntensity(animationController.scene, glitchIntensity.value)
  }
}

function updateGlow() {
  if (animationController) {
    const scene = animationController.scene
    scene.traverse((object) => {
      if (object.userData.isHolographic && object.material.uniforms?.uGlowIntensity) {
        object.material.uniforms.uGlowIntensity.value = glowIntensity.value
      }
    })
  }
}

function toggleStats() {
  animationController?.togglePerformanceMonitor(showStats.value)
}

function startHolographicLoop() {
  function animate() {
    if (isPlaying.value) {
      holographicTime += 0.016

      if (animationController) {
        updateHolographicObjects(animationController.scene, holographicTime)
      }
    }
    animationId = requestAnimationFrame(animate)
  }
  animate()
}

function stopHolographicLoop() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

function updateFPS() {
  const now = performance.now()
  if (now - lastTime >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastTime = now
  }
  frameCount++
  requestAnimationFrame(updateFPS)
}
</script>

<style scoped>
.holographic-demo {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.demo-container {
  width: 100%;
  height: 100%;
}

.control-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 280px;
  background: rgba(0, 20, 40, 0.9);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  color: #00ffff;
  font-family: 'Courier New', monospace;
  z-index: 100;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
}

.control-panel h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 0 10px #00ffff;
}

.control-group {
  margin-bottom: 16px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: rgba(0, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.control-group select {
  width: 100%;
  padding: 8px;
  background: rgba(0, 40, 60, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 6px;
  color: #00ffff;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  outline: none;
  cursor: pointer;
}

.control-group select:hover {
  border-color: #00ffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.control-group input[type="range"] {
  width: 100%;
  height: 6px;
  background: rgba(0, 40, 60, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
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
  box-shadow: 0 0 10px #00ffff;
}

.control-group input[type="checkbox"] {
  margin-right: 8px;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.button-group button {
  flex: 1;
  padding: 10px;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 100, 255, 0.2));
  border: 1px solid rgba(0, 255, 255, 0.5);
  border-radius: 6px;
  color: #00ffff;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.button-group button:hover {
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.4), rgba(0, 100, 255, 0.4));
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
  transform: translateY(-2px);
}

.button-group button:active {
  transform: translateY(0);
}

.info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 255, 255, 0.3);
}

.info p {
  margin: 8px 0;
  font-size: 11px;
  color: rgba(0, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.title-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  z-index: 50;
}

.holographic-title {
  font-size: 72px;
  font-weight: 700;
  color: transparent;
  background: linear-gradient(135deg, #00ffff, #ff00ff, #00ffff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  letter-spacing: 10px;
  margin: 0;
}

.holographic-subtitle {
  font-size: 14px;
  color: rgba(0, 255, 255, 0.7);
  letter-spacing: 8px;
  text-transform: uppercase;
  margin: 10px 0 0 0;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
-->
