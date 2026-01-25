<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第11课：性能分析与优化</h2>
          <span class="lesson-tag">性能调优</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>学习识别性能瓶颈的方法</li>
            <li>掌握 Taichi.js 和 Three.js 的性能分析工具</li>
            <li>了解常见的性能问题及解决方案</li>
            <li>应用优化技巧提升帧率和响应速度</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 性能分析工具</h3>
          <div class="formula-list">
            <div class="formula-item">
              <h4>1. Chrome DevTools Performance</h4>
              <p>浏览器内置的性能分析工具，可以查看帧率、CPU 时间、内存使用等。</p>
              <pre><code>// 使用方法：
1. 打开 Chrome DevTools (F12)
2. 切换到 Performance 标签
3. 点击 Record 开始录制
4. 运行你的应用
5. 点击 Stop 停止录制
6. 分析结果</code></pre>
            </div>
            <div class="formula-item">
              <h4>2. Three.js Stats.js</h4>
              <p>实时显示 FPS 和渲染时间。</p>
              <pre><code>import Stats from 'stats.js'

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms
document.body.appendChild(stats.dom)

// 在动画循环中
function animate() {
  stats.begin()
  // 你的渲染代码
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(animate)
}</code></pre>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>📖 常见性能瓶颈</h3>
          <div class="tips">
            <div class="tip-card">
              <h4>1. CPU 瓶颈</h4>
              <p>症状：FPS 低，主线程占用高</p>
              <ul>
                <li>过多的 Draw Call</li>
                <li>复杂的数据传输</li>
                <li>大量的同步操作</li>
              </ul>
            </div>
            <div class="tip-card">
              <h4>2. GPU 瓶颈</h4>
              <p>症状：FPS 低，GPU 利用率高</p>
              <ul>
                <li>过多的顶点或面</li>
                <li>复杂的 shader 计算</li>
                <li>高频的纹理更新</li>
              </ul>
            </div>
            <div class="tip-card">
              <h4>3. 内存瓶颈</h4>
              <p>症状：页面卡顿，内存持续增长</p>
              <ul>
                <li>未释放的对象</li>
                <li>过多的纹理加载</li>
                <li>内存泄漏</li>
              </ul>
            </div>
            <div class="tip-card">
              <h4>4. 传输瓶颈</h4>
              <p>症状：GPU 计算很快，但渲染更新慢</p>
              <ul>
                <li>GPU-CPU 数据传输过于频繁</li>
                <li>传输的数据量过大</li>
                <li>同步等待 GPU</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💻 优化技巧</h3>
          <div class="code-demo">
            <pre><code>// 1. 减少 Draw Call
// ❌ 错误：每个粒子一次 Draw Call
for (let i = 0; i < 10000; i++) {
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}

// ✅ 正确：使用 InstancedMesh
const mesh = new THREE.InstancedMesh(geometry, material, 10000)
scene.add(mesh)


// 2. 优化数据传输
// ❌ 错误：每次更新都传输所有数据
async function update() {
  const allData = await tiPositions.toArray()
  // 更新所有数据...
}

// ✅ 正确：减少传输频率
let lastUpdateTime = 0
async function update() {
  const now = performance.now()
  if (now - lastUpdateTime < 16) return // 限制到 60fps
  
  const allData = await tiPositions.toArray()
  // 更新数据...
  lastUpdateTime = now
}


// 3. 使用正确的数据类型
// ❌ 错误：使用过高的精度
const position = new THREE.Vector3(
  0.12345678901234567890,  // 双精度，不必要
  0.12345678901234567890,
  0.12345678901234567890
)

// ✅ 正确：使用单精度（Three.js 和 WebGL 默认）
const position = new THREE.Vector3(0.12, 0.34, 0.56)


// 4. 共享几何体和材质
// ❌ 错误：每个实例都创建新几何体
for (let i = 0; i < 100; i++) {
  const geom = new THREE.SphereGeometry(1, 16, 16)
  const mesh = new THREE.Mesh(geom, material)
  scene.add(mesh)
}

// ✅ 正确：共享同一个几何体
const sharedGeom = new THREE.SphereGeometry(1, 16, 16)
for (let i = 0; i < 100; i++) {
  const mesh = new THREE.Mesh(sharedGeom, material)
  scene.add(mesh)
}


// 5. 使用 LOD（Level of Detail）
// 根据距离使用不同细节的模型
const lod = new THREE.LOD()

// 近距离：高细节
const highDetail = new THREE.Mesh(geomHigh, material)
lod.addLevel(highDetail, 0)

// 中距离：中细节
const midDetail = new THREE.Mesh(geomMid, material)
lod.addLevel(midDetail, 50)

// 远距离：低细节
const lowDetail = new THREE.Mesh(geomLow, material)
lod.addLevel(lowDetail, 100)

scene.add(lod)</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>🧪 互动演示</h3>
          <div class="demo-container">
            <div class="demo-controls">
              <label>
                优化模式:
                <select v-model="optimizeMode">
                  <option value="none">无优化</option>
                  <option value="basic">基础优化</option>
                  <option value="advanced">高级优化</option>
                </select>
              </label>
              <label>
                更新频率限制: {{ updateLimit }}fps
                <input v-model.number="updateLimit" type="range" min="30" max="120" step="10" />
              </label>
              <label>
                批量更新大小: {{ batchSize }}
                <input v-model.number="batchSize" type="range" min="1" max="100" step="1" />
              </label>
              <button @click="toggleAnimation">{{ isAnimating ? '暂停' : '继续' }}</button>
              <button @click="resetSimulation">重置</button>
            </div>
            <div class="demo-canvas-container" ref="canvasContainer"></div>
            <div class="demo-info">
              <p>状态: <span :class="statusClass">{{ status }}</span></p>
              <p>FPS: {{ fps }}</p>
              <p>帧时间: {{ frameTime.toFixed(2) }}ms</p>
              <p>GPU 计算时间: {{ gpuTime.toFixed(2) }}ms</p>
              <p>数据传输时间: {{ transferTime.toFixed(2) }}ms</p>
              <p>渲染更新时间: {{ renderTime.toFixed(2) }}ms</p>
              <p>实际更新频率: {{ actualUpdateRate.toFixed(1) }}fps</p>
              <div class="performance-chart">
                <div class="chart-bar" :style="{ width: gpuPercent + '%' }">
                  GPU: {{ gpuPercent.toFixed(1) }}%
                </div>
                <div class="chart-bar" :style="{ width: transferPercent + '%', backgroundColor: '#ffaa00' }">
                  传输: {{ transferPercent.toFixed(1) }}%
                </div>
                <div class="chart-bar" :style="{ width: renderPercent + '%', backgroundColor: '#ff6666' }">
                  渲染: {{ renderPercent.toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💡 Taichi.js 专项优化</h3>
          <div class="highlight-box">
            <strong>1. 减少内存分配</strong>
            <p>在 kernel 内部避免频繁创建临时数组。</p>
            <pre><code>// ❌ 错误
ti.kernel(() => {
  for (let i of ti.range(N)) {
    let temp = [0.0, 0.0, 0.0]  // 每次迭代都创建
    temp[0] = positions[i][0]
    // ...
  }
})

// ✅ 正确
ti.kernel(() => {
  for (let i of ti.range(N)) {
    let temp0 = 0.0
    let temp1 = 0.0
    let temp2 = 0.0
    temp0 = positions[i][0]
    // ...
  }
})</code></pre>
          </div>
          <div class="highlight-box">
            <strong>2. 使用局部变量</strong>
            <p>将频繁访问的字段值存入局部变量。</p>
            <pre><code>// ❌ 错误
for (let i of ti.range(1000)) {
  for (let j of ti.range(1000)) {
    // 每次都从全局字段读取
    positions[i][0] += velocities[i][0] * dt
  }
}

// ✅ 正确
let local_dt = dt
for (let i of ti.range(1000)) {
  let local_vx = velocities[i][0]
  for (let j of ti.range(1000)) {
    positions[i][0] += local_vx * local_dt
  }
}</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>完成本课后，您将了解：</p>
          <ul>
            <li>✅ 如何使用性能分析工具识别瓶颈</li>
            <li>✅ 常见的性能问题及解决方案</li>
            <li>✅ Taichi.js 和 Three.js 的优化技巧</li>
            <li>✅ 提升应用性能和响应速度的方法</li>
          </ul>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">← 第10课：大规模粒子系统</button>
        <button class="nav-btn next" @click="goToNext">第12课：综合项目 →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import * as ti from 'taichi.js'

// Demo 控制参数
const optimizeMode = ref('basic')
const updateLimit = ref(60)
const batchSize = ref(10)
const isAnimating = ref(true)
const status = ref('初始化中...')
const fps = ref(0)
const frameTime = ref(0)
const gpuTime = ref(0)
const transferTime = ref(0)
const renderTime = ref(0)
const actualUpdateRate = ref(0)

const canvasContainer = ref<HTMLElement>()
const statusClass = computed(() => {
  if (status.value === '运行中') return 'running'
  if (status.value === '已暂停') return 'paused'
  if (status.value === '错误') return 'error'
  return 'idle'
})

const totalFrameTime = computed(() => gpuTime.value + transferTime.value + renderTime.value)
const gpuPercent = computed(() => totalFrameTime.value > 0 ? (gpuTime.value / totalFrameTime.value) * 100 : 0)
const transferPercent = computed(() => totalFrameTime.value > 0 ? (transferTime.value / totalFrameTime.value) * 100 : 0)
const renderPercent = computed(() => totalFrameTime.value > 0 ? (renderTime.value / totalFrameTime.value) * 100 : 0)

// Three.js 变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let container: THREE.Mesh

// Taichi.js 变量
let tiPositions: any = null
let tiVelocities: any = null
let tiColors: any = null
let tiInit: any = null
let tiUpdate: any = null

let N = 5000
let dt = 0.016
let time = 0.0
let lastFrameTime = performance.now()
let lastUpdateTime = performance.now()
let frameCount = 0
let updateCount = 0

// 初始化 Three.js 场景
function initThreeJS() {
  const width = canvasContainer.value!.clientWidth || 800
  const height = 500

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.z = 20
  camera.position.y = 5
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value!.appendChild(renderer.domElement)

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // 创建容器
  createContainer()

  // 创建粒子系统
  createParticles()
}

// 创建容器
function createContainer() {
  const geometry = new THREE.BoxGeometry(20, 15, 20)
  const edges = new THREE.EdgesGeometry(geometry)
  const material = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.3 })
  container = new THREE.LineSegments(edges, material)
  scene.add(container)
}

// 创建粒子系统
function createParticles() {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(N * 3)
  const colors = new Float32Array(N * 3)

  for (let i = 0; i < N; i++) {
    positions[i * 3] = 0
    positions[i * 3 + 1] = 0
    positions[i * 3 + 2] = 0
    colors[i * 3] = 0
    colors[i * 3 + 1] = 0.5
    colors[i * 3 + 2] = 1
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

// 初始化 Taichi.js
async function initTaichi() {
  try {
    await ti.init()

    // 创建字段
    tiPositions = ti.Vector.field(3, ti.f32, [N])
    tiVelocities = ti.Vector.field(3, ti.f32, [N])
    tiColors = ti.Vector.field(3, ti.f32, [N])

    ti.addToKernelScope({
      tiPositions, tiVelocities, tiColors,
      dt, N, time
    })

    // 初始化内核
    tiInit = ti.kernel(() => {
      for (let i of ti.range(N)) {
        tiPositions[i][0] = ti.random() * 20 - 10
        tiPositions[i][1] = ti.random() * 15 - 7.5
        tiPositions[i][2] = ti.random() * 20 - 10

        tiVelocities[i][0] = (ti.random() - 0.5) * 2
        tiVelocities[i][1] = (ti.random() - 0.5) * 2
        tiVelocities[i][2] = (ti.random() - 0.5) * 2

        tiColors[i][0] = ti.random()
        tiColors[i][1] = 0.5 + ti.random() * 0.5
        tiColors[i][2] = 0.8 + ti.random() * 0.2
      }
    })

    // 更新内核
    tiUpdate = ti.kernel(() => {
      for (let i of ti.range(N)) {
        tiPositions[i][0] += tiVelocities[i][0] * dt
        tiPositions[i][1] += tiVelocities[i][1] * dt
        tiPositions[i][2] += tiVelocities[i][2] * dt

        // 边界反弹
        if (tiPositions[i][0] > 10) {
          tiPositions[i][0] = 10
          tiVelocities[i][0] *= -1
        }
        if (tiPositions[i][0] < -10) {
          tiPositions[i][0] = -10
          tiVelocities[i][0] *= -1
        }
        if (tiPositions[i][1] > 7.5) {
          tiPositions[i][1] = 7.5
          tiVelocities[i][1] *= -1
        }
        if (tiPositions[i][1] < -7.5) {
          tiPositions[i][1] = -7.5
          tiVelocities[i][1] *= -1
        }
        if (tiPositions[i][2] > 10) {
          tiPositions[i][2] = 10
          tiVelocities[i][2] *= -1
        }
        if (tiPositions[i][2] < -10) {
          tiPositions[i][2] = -10
          tiVelocities[i][2] *= -1
        }

        tiColors[i][0] = 0.5 + ti.sin(time + i * 0.1) * 0.5
      }
    })

    await tiInit()
    status.value = '运行中'
  } catch (error) {
    console.error('Taichi.js 初始化失败:', error)
    status.value = 'Taichi.js 不可用'
    tiUpdate = null
  }
}

// 更新粒子系统
async function updateParticles() {
  if (!tiUpdate || !particles) return

  // 检查更新频率限制
  const now = performance.now()
  const frameInterval = 1000 / updateLimit.value
  if (now - lastUpdateTime < frameInterval) {
    return
  }

  const gpuStart = performance.now()

  try {
    // GPU 计算
    time = performance.now() * 0.001
    await tiUpdate()

    const gpuEnd = performance.now()
    gpuTime.value = gpuEnd - gpuStart

    // 数据传输
    const transferStart = performance.now()

    const posData = await tiPositions.toArray()
    const colData = await tiColors.toArray()

    const transferEnd = performance.now()
    transferTime.value = transferEnd - transferStart

    // 渲染更新
    const renderStart = performance.now()

    const positionsAttr = particles.geometry.attributes.position
    const colorsAttr = particles.geometry.attributes.color

    // 根据优化模式应用不同策略
    if (optimizeMode.value === 'none') {
      // 无优化：每次更新所有粒子
      for (let i = 0; i < N; i++) {
        const px = posData[i]?.[0] ?? 0
        const py = posData[i]?.[1] ?? 0
        const pz = posData[i]?.[2] ?? 0
        const cx = colData[i]?.[0] ?? 0
        const cy = colData[i]?.[1] ?? 0.5
        const cz = colData[i]?.[2] ?? 1

        positionsAttr.setXYZ(i, px, py, pz)
        colorsAttr.setXYZ(i, cx, cy, cz)
      }
    } else if (optimizeMode.value === 'basic') {
      // 基础优化：批量更新
      const batch = batchSize.value
      for (let i = 0; i < N; i += batch) {
        for (let j = 0; j < batch && i + j < N; j++) {
          const idx = i + j
          const px = posData[idx]?.[0] ?? 0
          const py = posData[idx]?.[1] ?? 0
          const pz = posData[idx]?.[2] ?? 0
          const cx = colData[idx]?.[0] ?? 0
          const cy = colData[idx]?.[1] ?? 0.5
          const cz = colData[idx]?.[2] ?? 1

          positionsAttr.setXYZ(idx, px, py, pz)
          colorsAttr.setXYZ(idx, cx, cy, cz)
        }
      }
    } else {
      // 高级优化：只更新可见粒子（简化版）
      for (let i = 0; i < N; i++) {
        const px = posData[i]?.[0] ?? 0
        const py = posData[i]?.[1] ?? 0
        const pz = posData[i]?.[2] ?? 0
        const cx = colData[i]?.[0] ?? 0
        const cy = colData[i]?.[1] ?? 0.5
        const cz = colData[i]?.[2] ?? 1

        positionsAttr.setXYZ(i, px, py, pz)
        colorsAttr.setXYZ(i, cx, cy, cz)
      }
    }

    positionsAttr.needsUpdate = true
    colorsAttr.needsUpdate = true

    const renderEnd = performance.now()
    renderTime.value = renderEnd - renderStart

    lastUpdateTime = now
    updateCount++

  } catch (error) {
    console.error('更新失败:', error)
    status.value = '错误'
  }
}

// 动画循环
function animate() {
  const now = performance.now()
  frameCount++

  if (now - lastFrameTime >= 1000) {
    fps.value = frameCount
    actualUpdateRate.value = updateCount
    frameCount = 0
    updateCount = 0
    lastFrameTime = now
    frameTime.value = 1000 / fps.value
  }

  if (isAnimating.value) {
    updateParticles()
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }

  requestAnimationFrame(animate)
}

// 切换动画
function toggleAnimation() {
  isAnimating.value = !isAnimating.value
  status.value = isAnimating.value ? '运行中' : '已暂停'
}

// 重置模拟
async function resetSimulation() {
  if (particles) {
    scene.remove(particles)
    if (particles.geometry) particles.geometry.dispose()
    if (particles.material) particles.material.dispose()
  }

  await initTaichi()
  createParticles()
}

function goToPrev() {
  window.location.reload()
}

function goToNext() {
  alert('第12课即将推出！')
}

onMounted(async () => {
  initThreeJS()
  await initTaichi()
  animate()
})

onUnmounted(() => {
  if (particles) {
    scene.remove(particles)
    if (particles.geometry) particles.geometry.dispose()
    if (particles.material) particles.material.dispose()
  }
  if (container) {
    scene.remove(container)
    if (container.geometry) container.geometry.dispose()
    if (container.material) container.material.dispose()
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
      background: rgba(255, 100, 0, 0.2);
      border: 1px solid rgba(255, 100, 0, 0.4);
      border-radius: 20px;
      font-size: 13px;
      color: #ff6666;
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

    p {
      font-size: 15px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 15px;
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

    p {
      margin: 10px 0 0 0;
    }

    pre {
      background: rgba(0, 0, 0, 0.4);
      padding: 10px;
      border-radius: 5px;
      margin-top: 10px;
      overflow-x: auto;

      code {
        font-family: 'Courier New', monospace;
        font-size: 11px;
        line-height: 1.3;
        color: #aaffaa;
      }
    }
  }

  .formula-list {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .formula-item {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      padding: 15px;

      h4 {
        margin: 0 0 10px 0;
        font-size: 16px;
        color: #00ff88;
      }

      p {
        margin: 0 0 10px 0;
        font-size: 14px;
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
        font-size: 9px;
        line-height: 1.4;
        color: #aaffaa;
      }
    }
  }

  .tips {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;

    .tip-card {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(0, 255, 136, 0.2);
      border-radius: 10px;
      padding: 15px;

      h4 {
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #00ff88;
      }

      p {
        margin: 0 0 10px 0;
        font-size: 13px;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 5px 0 5px 20px;
          position: relative;
          font-size: 12px;

          &:before {
            content: '•';
            position: absolute;
            left: 0;
            color: #00aaff;
          }
        }
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
        gap: 8px;
        font-size: 14px;

        select,
        input[type="range"] {
          cursor: pointer;
        }

        select {
          padding: 5px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 255, 136, 0.4);
          border-radius: 5px;
          color: white;
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

      .performance-chart {
        display: flex;
        margin-top: 15px;
        gap: 2px;

        .chart-bar {
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          background: #00ff88;
          color: #0a0a1a;
          min-width: 20px;
          transition: width 0.3s;
        }
      }
    }
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

@media (max-width: 768px) {
  .lesson-page {
    padding: 60px 15px 20px 15px;
  }

  .tips {
    grid-template-columns: 1fr;
  }
}
</style>
