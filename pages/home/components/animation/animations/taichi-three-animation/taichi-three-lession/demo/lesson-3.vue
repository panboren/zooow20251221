<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第3课：第一个粒子系统</h2>
          <span class="lesson-tag">入门</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>理解 Taichi.js 和 Three.js 的协作模式</li>
            <li>使用 Taichi.js 在 GPU 上计算粒子位置</li>
            <li>使用 Three.js 渲染粒子场景</li>
            <li>学习数据从 GPU 传输到渲染层的方式</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 核心架构：分工与协作</h3>
          <div class="architecture-diagram">
            <div class="arch-box taichi">
              <h4>Taichi.js</h4>
              <p>⚡ GPU 通用计算</p>
              <ul>
                <li>粒子位置更新</li>
                <li>物理模拟计算</li>
                <li>并行运算</li>
              </ul>
            </div>
            <div class="arrow">→ 数据传输 →</div>
            <div class="arch-box three">
              <h4>Three.js</h4>
              <p>🎨 3D 渲染</p>
              <ul>
                <li>场景管理</li>
                <li>粒子渲染</li>
                <li>相机控制</li>
              </ul>
            </div>
          </div>
          <div class="highlight-box">
            <strong>关键优势：</strong>
            <ul>
              <li>Taichi.js 专注于计算，发挥 GPU 并行能力</li>
              <li>Three.js 专注于渲染，提供高质量 3D 效果</li>
              <li>两者各司其职，性能最大化</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h3>📖 数据流程</h3>
          <div class="flow-steps">
            <div class="step">
              <div class="step-num">1</div>
              <div class="step-content">
                <h4>创建粒子字段</h4>
                <pre><code>const positions = ti.Vector.field(3, ti.f32, [N])</code></pre>
              </div>
            </div>
            <div class="step">
              <div class="step-num">2</div>
              <div class="step-content">
                <h4>GPU 计算位置</h4>
                <pre><code>const update = ti.kernel(() => {
  for (let i of ti.range(N)) {
    positions[i] = 计算新位置
  }
})</code></pre>
              </div>
            </div>
            <div class="step">
              <div class="step-num">3</div>
              <div class="step-content">
                <h4>传输到渲染层</h4>
                <pre><code>const posArray = await positions.toArray()
particles.geometry.attributes.position.array = posArray
particles.geometry.attributes.position.needsUpdate = true</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💻 代码实现</h3>
          <div class="code-demo">
            <pre><code>// 1. 初始化
await ti.init()
const N = 10000
const positions = ti.Vector.field(3, ti.f32, [N])
const velocities = ti.Vector.field(3, ti.f32, [N])

// 2. 初始化粒子
const init = ti.kernel(() => {
  for (let i of ti.range(N)) {
    positions[i] = [Math.random()-0.5, Math.random()-0.5, Math.random()-0.5]
    velocities[i] = [0, 0.01, 0]
  }
})

// 3. 更新粒子（GPU计算）
const update = ti.kernel(() => {
  for (let i of ti.range(N)) {
    positions[i] += velocities[i]
    // 简单的边界反弹
    if (positions[i].y < -1) {
      velocities[i].y *= -1
    }
  }
})

// 4. Three.js 渲染循环
function render() {
  await update()  // GPU 计算
  const pos = await positions.toArray()  // 读取数据
  particles.geometry.attributes.position.array = new Float32Array(pos.flat())
  particles.geometry.attributes.position.needsUpdate = true
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>🧪 互动演示</h3>
          <div class="demo-container">
            <div class="demo-controls">
              <label>
                粒子数量: {{ particleCount }}
                <input type="range" v-model.number="particleCount" min="1000" max="500000" step="1000" @change="restartDemo" />
              </label>
              <label>
                粒子大小: {{ particleSize }}
                <input type="range" v-model.number="particleSize" min="1" max="10" step="0.5" />
              </label>
              <button @click="restartDemo">重新初始化</button>
              <button @click="togglePause">{{ isPaused ? '继续' : '暂停' }}</button>
            </div>
            <div class="demo-canvas-container" ref="canvasContainer"></div>
            <div class="demo-info">
              <p>状态: <span :class="statusClass">{{ status }}</span></p>
              <p>FPS: {{ fps.toFixed(1) }}</p>
              <p>计算时间: {{ computeTime.toFixed(2) }}ms</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>完成本课后，您将了解：</p>
          <ul>
            <li>✅ Taichi.js + Three.js 的协作模式</li>
            <li>✅ GPU 计算结果如何传输到渲染层</li>
            <li>✅ 基础粒子系统的实现</li>
          </ul>
          <p class="next-lesson">
            下一课将学习字段系统的高级用法，包括多维向量和矩阵字段。
          </p>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">
          ← 第2课：Three.js 基础场景搭建
        </button>
        <button class="nav-btn next" @click="goToNext">
          第4课：字段系统详解 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import * as ti from 'taichi.js'

// Demo 控制参数
const particleCount = ref(10000)
const particleSize = ref(3)
const isPaused = ref(false)
const isReinitializing = ref(false) // 添加重新初始化标记
const status = ref('初始化中...')
const fps = ref(0)
const computeTime = ref(0)

const canvasContainer = ref<HTMLElement>()
const statusClass = computed(() => {
  if (status.value === '运行中') return 'running'
  if (status.value === '已暂停') return 'paused'
  if (status.value === '错误') return 'error'
  return 'idle'
})

// Three.js 变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points

// Taichi.js 变量
let tiPositions: any = null
let tiVelocities: any = null
let tiUpdate: any = null
let tiInit: any = null
let N = 10000

// FPS 计算
let frameCount = 0
let lastFpsTime = performance.now()

// 初始化 Three.js 场景
function initThreeJS() {
  const width = canvasContainer.value!.clientWidth || 800
  const height = 400

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5 // 增加相机距离

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 限制像素比
  canvasContainer.value!.appendChild(renderer.domElement)
}

// 初始化 Taichi.js
async function initTaichi() {
  try {
    await ti.init()
    N = particleCount.value

    // 创建字段
    tiPositions = ti.Vector.field(3, ti.f32, [N])
    tiVelocities = ti.Vector.field(3, ti.f32, [N])

    ti.addToKernelScope({ tiPositions, tiVelocities, N })

    // 初始化内核
    tiInit = ti.kernel(() => {
      for (let i of ti.range(N)) {
        // 扩大初始位置范围，让粒子分布更广
        tiPositions[i] = [ti.random() * 6 - 3, ti.random() * 6 - 3, ti.random() * 6 - 3]
        tiVelocities[i] = [0, 0.01, 0]
      }
    })

    // 更新内核
    tiUpdate = ti.kernel(() => {
      for (let i of ti.range(N)) {
        tiPositions[i] += tiVelocities[i]
        // 边界反弹
        if (tiPositions[i].y < -3) {
          tiVelocities[i].y *= -1
        }
      }
    })

    console.log('初始化 Taichi.js，粒子数量:', N)
    await tiInit()
    status.value = '运行中'
  } catch (error) {
    console.error('Taichi.js 初始化失败:', error)
    status.value = 'Taichi.js 不可用，使用纯 CPU 模式'
    tiUpdate = null
  }
}

// 创建 Three.js 粒子系统
function createParticles() {
  console.log('创建粒子系统，粒子数量:', N)

  const geometry = new THREE.BufferGeometry()

  // 创建初始位置数据（空占位）
  const positions = new Float32Array(N * 3)
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0x00ff88,
    size: particleSize.value / 10, // 缩小粒子尺寸
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

// 动画循环
async function animate() {
  // 如果正在重新初始化，跳过更新但继续渲染
  if (isReinitializing.value) {
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
    requestAnimationFrame(animate)
    return
  }

  if (!isPaused.value && !isReinitializing.value) {
    try {
      // GPU 计算粒子位置
      const start = performance.now()

      if (tiUpdate && particles) {
        await tiUpdate()

        // 从 GPU 读取数据
        const positions = await tiPositions.toArray()

        // 更新 Three.js 粒子
        const posArray = new Float32Array(positions.flat())
        const bufferAttribute = new THREE.BufferAttribute(posArray, 3)
        particles.geometry.setAttribute('position', bufferAttribute)
        particles.geometry.attributes.position.needsUpdate = true

        // 更新粒子大小
        if (particles.material instanceof THREE.PointsMaterial) {
          particles.material.size = particleSize.value / 10 // 缩小粒子尺寸
        }
      } else if (particles) {
        // CPU 后备模式 - 简单的旋转动画
        particles.rotation.y += 0.005
      }

      computeTime.value = performance.now() - start
    } catch (error) {
      console.error('更新失败:', error)
      status.value = '错误'
    }
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }

  // 计算 FPS
  frameCount++
  const now = performance.now()
  if (now - lastFpsTime >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastFpsTime = now
  }

  requestAnimationFrame(animate)
}

// 重新开始演示
async function restartDemo() {
  try {
    console.log('========== 开始重新初始化 ==========')
    console.log('粒子数量:', particleCount.value)
    console.log('当前暂停状态:', isPaused.value)

    // 设置重新初始化标记，防止动画循环报错
    isReinitializing.value = true
    console.log('已设置重新初始化标记')

    // 如果是暂停状态，先恢复运行
    if (isPaused.value) {
      isPaused.value = false
      console.log('已恢复运行状态')
    }

    // 移除旧粒子
    if (particles) {
      console.log('移除旧粒子')
      scene.remove(particles)

      // 正确清理 geometry 和 material
      if (particles.geometry && typeof particles.geometry.dispose === 'function') {
        particles.geometry.dispose()
      }
      if (particles.material && typeof particles.material.dispose === 'function') {
        particles.material.dispose()
      }

      particles = null as any
      console.log('旧粒子已移除')
    }

    // 更新粒子数量 N
    N = particleCount.value
    console.log('更新粒子数量 N =', N)

    // 重新初始化 Taichi.js（会创建新的字段）
    console.log('开始初始化 Taichi.js...')
    await initTaichi()
    console.log('Taichi.js 初始化完成')

    // 创建新的粒子系统
    console.log('创建粒子系统...')
    createParticles()
    console.log('粒子系统已创建')

    // 初始化时读取一次数据并更新位置
    if (tiPositions && particles) {
      try {
        console.log('开始读取粒子位置...')
        const positions = await tiPositions.toArray()
        const posArray = new Float32Array(positions.flat())
        particles.geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
        particles.geometry.attributes.position.needsUpdate = true
        status.value = '运行中'
        console.log('✓ 粒子位置已更新，粒子数:', posArray.length / 3)
      } catch (error) {
        console.error('✗ 读取粒子位置失败:', error)
        status.value = '错误: ' + error
      }
    } else {
      console.error('✗ tiPositions 或 particles 为空')
      console.log('tiPositions:', tiPositions)
      console.log('particles:', particles)
    }

    // 清除重新初始化标记，恢复正常动画
    isReinitializing.value = false
    console.log('已清除重新初始化标记')

    console.log('========== 重新初始化完成 ==========')
  } catch (error) {
    console.error('✗ restartDemo 发生错误:', error)
    status.value = '初始化失败: ' + error
    isReinitializing.value = false // 确保出错时也清除标记
  }
}

// 暂停/继续
function togglePause() {
  isPaused.value = !isPaused.value
  status.value = isPaused.value ? '已暂停' : '运行中'
}

function goToPrev() {
  window.location.reload()
}

function goToNext() {
  alert('第4课即将推出！')
}

onMounted(async () => {
  initThreeJS()
  await initTaichi()
  createParticles()

  // 初始化时读取数据
  if (tiPositions) {
    const positions = await tiPositions.toArray()
    const posArray = new Float32Array(positions.flat())
    particles.geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  }

  animate()
})

onUnmounted(() => {
  if (particles) {
    scene.remove(particles)
    if (particles.geometry && typeof particles.geometry.dispose === 'function') {
      particles.geometry.dispose()
    }
    if (particles.material && typeof particles.material.dispose === 'function') {
      particles.material.dispose()
    }
  }
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped lang="scss">
.lesson-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%);
  padding: 80px 30px 30px 30px;
  color: white;
}

.content-area {
  max-width: 900px;
  margin: 0 auto;
}

.lesson-info {
  .lesson-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;

    h2 {
      margin: 0;
      font-size: 32px;
      color: #00ff88;
    }

    .lesson-tag {
      padding: 6px 15px;
      background: rgba(0, 255, 136, 0.2);
      border: 1px solid rgba(0, 255, 136, 0.4);
      border-radius: 20px;
      font-size: 13px;
      color: #00ff88;
    }
  }

  .section {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 25px;
    border: 1px solid rgba(255, 255, 255, 0.08);

    h3 {
      margin: 0 0 15px 0;
      font-size: 22px;
      color: #00aaff;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 8px 0 8px 25px;
        position: relative;
        font-size: 15px;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.85);

        &:before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #00ff88;
        }
      }
    }
  }

  .highlight-box {
    background: rgba(255, 200, 0, 0.1);
    border-left: 4px solid rgba(255, 200, 0, 0.6);
    padding: 15px 20px;
    border-radius: 8px;
    margin: 20px 0;

    strong {
      color: #ffc800;
      font-size: 16px;
    }

    ul li:before {
      color: #ffc800;
    }
  }

  .architecture-diagram {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 30px 0;
    flex-wrap: wrap;

    .arch-box {
      background: rgba(0, 50, 100, 0.3);
      border: 2px solid rgba(0, 170, 255, 0.3);
      border-radius: 12px;
      padding: 20px;
      width: 200px;

      &.taichi {
        border-color: rgba(255, 100, 100, 0.5);
        background: rgba(255, 100, 100, 0.1);
      }

      &.three {
        border-color: rgba(0, 255, 136, 0.5);
        background: rgba(0, 255, 136, 0.1);
      }

      h4 {
        margin: 0 0 10px 0;
        font-size: 18px;
      }

      p {
        margin: 0 0 10px 0;
        font-size: 14px;
        opacity: 0.9;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 5px 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);

          &:before {
            content: '•';
            color: currentColor;
            position: absolute;
            left: -15px;
          }
        }
      }
    }

    .arrow {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .flow-steps {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .step {
      display: flex;
      gap: 15px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      padding: 15px;

      .step-num {
        width: 35px;
        height: 35px;
        background: rgba(0, 255, 136, 0.3);
        border: 2px solid #00ff88;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 16px;
        color: #00ff88;
        flex-shrink: 0;
      }

      .step-content {
        flex: 1;

        h4 {
          margin: 0 0 10px 0;
          font-size: 16px;
          color: #88ccff;
        }

        pre {
          background: rgba(0, 0, 0, 0.5);
          padding: 10px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 0;

          code {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            color: #aaffaa;
          }
        }
      }
    }
  }

  .code-demo {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 255, 136, 0.2);
    border-radius: 12px;
    padding: 20px;

    pre {
      background: rgba(0, 0, 0, 0.6);
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;

      code {
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.6;
        color: #aaffaa;
      }
    }
  }

  .demo-container {
    background: rgba(0, 50, 100, 0.15);
    border: 1px solid rgba(0, 170, 255, 0.2);
    border-radius: 12px;
    padding: 25px;

    .demo-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
      align-items: center;

      label {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;

        input[type="range"] {
          cursor: pointer;
        }
      }

      button {
        padding: 10px 20px;
        background: rgba(0, 255, 136, 0.2);
        border: 1px solid rgba(0, 255, 136, 0.4);
        border-radius: 8px;
        color: #00ff88;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;

        &:hover {
          background: rgba(0, 255, 136, 0.3);
        }
      }
    }

    .demo-canvas-container {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      margin-bottom: 15px;
      overflow: hidden;
    }

    .demo-info {
      p {
        font-size: 14px;
        margin-bottom: 5px;

        .running { color: #00ff88; font-weight: bold; }
        .paused { color: #ffaa00; font-weight: bold; }
        .error { color: #ff4444; font-weight: bold; }
        .idle { color: rgba(255, 255, 255, 0.7); }
      }
    }
  }

  .next-lesson {
    padding: 15px;
    background: rgba(0, 255, 136, 0.1);
    border-left: 3px solid #00ff88;
    border-radius: 6px;
    font-style: italic;
    color: rgba(255, 255, 255, 0.8);
  }
}

.navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;

  .nav-btn {
    padding: 12px 25px;
    background: rgba(0, 170, 255, 0.2);
    border: 1px solid rgba(0, 170, 255, 0.3);
    border-radius: 8px;
    color: #00aaff;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
      background: rgba(0, 170, 255, 0.3);
      transform: translateX(-2px);
    }

    &.next:hover {
      transform: translateX(2px);
    }
  }
}
</style>
