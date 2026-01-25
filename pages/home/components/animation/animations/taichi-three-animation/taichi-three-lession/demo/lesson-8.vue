<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第8课：流体粒子模拟（SPH）</h2>
          <span class="lesson-tag">高级物理模拟</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>理解 SPH（平滑粒子流体动力学）的基本原理</li>
            <li>学习流体粒子的相互作用力计算</li>
            <li>掌握 Taichi.js 进行大规模并行流体模拟</li>
            <li>实现压力、粘滞力和表面张力效果</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 什么是 SPH？</h3>
          <p>
            <strong>SPH（Smoothed Particle Hydrodynamics）</strong>
            是一种用于模拟流体的拉格朗日方法。它将流体离散为一系列粒子，通过计算粒子间的相互作用来模拟流体行为。
          </p>
          <div class="highlight-box">
            <strong>核心思想：</strong>
            <p>流体的物理量（密度、压力、速度等）通过粒子位置的加权平均来近似。</p>
          </div>
          <pre><code>// SPH 的基本公式
密度计算: ρ(i) = Σ m(j) * W(r(i), r(j), h)
压力计算: P(i) = k * (ρ(i) - ρ0)
压力力: Fp(i) = -Σ m(j) * (P(i) + P(j))/(2ρ(j)) * ∇W
粘滞力: Fv(i) = μ * Σ m(j) * (v(j) - v(i))/ρ(j) * ∇²W</code></pre>
        </div>

        <div class="section">
          <h3>📖 SPH 核心公式</h3>
          <div class="formula-list">
            <div class="formula-item">
              <h4>1. 核函数（Kernel Function）</h4>
              <p>用于计算粒子间的权重，常用的有 Poly6 和 Spiky 核函数：</p>
              <pre><code>// Poly6 核函数（用于密度计算）
W_poly6(r, h) = (315 / (64 * π * h^9)) * (h² - r²)³

// Spiky 核函数梯度（用于压力力计算）
∇W_spiky(r, h) = -(45 / (π * h^6)) * (h - r)² * (r/|r|)</code></pre>
            </div>
            <div class="formula-item">
              <h4>2. 状态方程（Equation of State）</h4>
              <p>将密度转换为压力：</p>
              <pre><code>P = k * (ρ - ρ0)

其中：
- k: 刚度系数
- ρ: 当前密度
- ρ0: 静态密度</code></pre>
            </div>
            <div class="formula-item">
              <h4>3. 粒子受力</h4>
              <pre><code>F_total = F_pressure + F_viscosity + F_gravity + F_boundary

其中：
- F_pressure: 压力力（密度高→低）
- F_viscosity: 粘滞力（动量传递）
- F_gravity: 重力
- F_boundary: 边界力（碰撞）</code></pre>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💻 代码示例：基础 SPH 实现</h3>
          <div class="code-demo">
            <pre><code>// SPH 参数
const N = 2000                    // 粒子数量
const h = 0.4                     // 平滑半径
const k = 200.0                   // 气体刚度
const μ = 2.5                     // 粘滞系数
const ρ0 = 1000.0                 // 静态密度
const mass = 1.0                  // 粒子质量
const dt = 0.008                  // 时间步长

// 创建字段
let positions = ti.Vector.field(3, ti.f32, [N])
let velocities = ti.Vector.field(3, ti.f32, [N])
let forces = ti.Vector.field(3, ti.f32, [N])
let densities = ti.field(ti.f32, [N])
let pressures = ti.field(ti.f32, [N])

ti.addToKernelScope({
  positions, velocities, forces,
  densities, pressures,
  h, k, μ, ρ0, mass, dt, N
})

// 密度和压力计算内核
let computeDensityPressure = ti.kernel(() => {
  for (let i of ti.range(N)) {
    let density = 0.0

    for (let j of ti.range(N)) {
      let r = positions[i] - positions[j]
      let r2 = ti.dot(r, r)

      if (r2 < h * h) {
        let r_norm = ti.sqrt(r2)
        // Poly6 核函数
        let w = (315.0 / (64.0 * 3.14159 * ti.pow(h, 9))) *
                ti.pow(h * h - r2, 3)
        density += mass * w
      }
    }

    densities[i] = density
    pressures[i] = k * (density - ρ0)
  }
})

// 力计算内核
let computeForces = ti.kernel(() => {
  for (let i of ti.range(N)) {
    let fPressure = [0.0, 0.0, 0.0]
    let fViscosity = [0.0, 0.0, 0.0]

    for (let j of ti.range(N)) {
      if (i === j) continue

      let r = positions[i] - positions[j]
      let r_norm = ti.sqrt(ti.dot(r, r))

      if (r_norm > 0 && r_norm < h) {
        // 压力力（Spiky 核函数梯度）
        let pressureTerm = (pressures[i] + pressures[j]) / (2.0 * densities[j])
        let gradW = -(45.0 / (3.14159 * ti.pow(h, 6))) *
                     ti.pow(h - r_norm, 2) / r_norm
        let fP = -mass * pressureTerm * gradW * r
        fPressure[0] += fP[0]
        fPressure[1] += fP[1]
        fPressure[2] += fP[2]

        // 粘滞力
        let viscosityTerm = μ * mass / densities[j]
        let lapW = (45.0 / (3.14159 * ti.pow(h, 6))) * (h - r_norm)
        let fV = viscosityTerm * lapW * (velocities[j] - velocities[i])
        fViscosity[0] += fV[0]
        fViscosity[1] += fV[1]
        fViscosity[2] += fV[2]
      }
    }

    // 总力 = 压力力 + 粘滞力 + 重力
    forces[i][0] = fPressure[0] + fViscosity[0]
    forces[i][1] = fPressure[1] + fViscosity[1] - 9.8
    forces[i][2] = fPressure[2] + fViscosity[2]
  }
})</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>🚀 空间哈希优化</h3>
          <p>
            SPH 的计算复杂度是 O(N²)，对于大量粒子非常慢。使用<strong>空间哈希</strong>可以优化到接近 O(N)。
          </p>
          <div class="highlight-box">
            <strong>优化思路：</strong>
            <p>将空间划分为网格，只计算同一网格及相邻网格中的粒子相互作用。</p>
          </div>
          <pre><code>// 空间哈希网格
let gridCount = ti.field(ti.i32, [])
let gridToParticle = ti.field(ti.i32, [MAX_PARTICLES])
let particleToGrid = ti.field(ti.i32, [MAX_PARTICLES])

let updateSpatialHash = ti.kernel(() => {
  // 清空网格
  for (let i of ti.range(MAX_CELLS)) {
    gridCount[i] = 0
  }

  // 分配粒子到网格
  for (let i of ti.range(N)) {
    let cellX = ti.floor(positions[i][0] / h)
    let cellY = ti.floor(positions[i][1] / h)
    let cellZ = ti.floor(positions[i][2] / h)
    let cellHash = cellX * CELL_SIZE + cellY * CELL_SIZE + cellZ

    particleToGrid[i] = cellHash
    let idx = ti.atomicAdd(gridCount[cellHash], 1)
    gridToParticle[cellHash * MAX_PARTICLES + idx] = i
  }
})</code></pre>
        </div>

        <div class="section">
          <h3>🧪 互动演示</h3>
          <div class="demo-container">
            <div class="demo-controls">
              <label>
                粒子数量: {{ particleCount }}
                <select v-model.number="particleCount" @change="resetSimulation">
                  <option :value="500">500</option>
                  <option :value="1000">1000</option>
                  <option :value="2000">2000</option>
                </select>
              </label>
              <label>
                粘滞系数: {{ viscosity }}
                <input v-model.number="viscosity" type="range" min="0" max="10" step="0.5" />
              </label>
              <label>
                压力刚度: {{ pressureStiffness }}
                <input v-model.number="pressureStiffness" type="range" min="50" max="500" step="50" />
              </label>
              <label>
                重力: {{ gravity }}x
                <input v-model.number="gravity" type="range" min="0" max="2" step="0.1" />
              </label>
              <button @click="resetSimulation">重置</button>
              <button @click="toggleAnimation">{{ isAnimating ? '暂停' : '继续' }}</button>
            </div>
            <div class="demo-canvas-container" ref="canvasContainer"></div>
            <div class="demo-info">
              <p>状态: <span :class="statusClass">{{ status }}</span></p>
              <p>FPS: {{ fps }}</p>
              <p>平均密度: {{ avgDensity }}</p>
              <p>计算时间: {{ computeTime }}ms</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🎨 可视化技巧</h3>
          <div class="tips">
            <div class="tip-card">
              <h4>1. 颜色映射</h4>
              <p>根据速度或密度着色，观察流体行为：</p>
              <pre><code>// 根据速度着色
let speed = ti.sqrt(ti.dot(velocities[i], velocities[i]))
let color = [ti.min(1.0, speed * 0.5),
              ti.max(0.0, 1.0 - speed * 0.3),
              0.5]</code></pre>
            </div>
            <div class="tip-card">
              <h4>2. 流体表面重建</h4>
              <p>使用 Marching Cubes 等算法重建流体表面</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>完成本课后，您将了解：</p>
          <ul>
            <li>✅ SPH 流体模拟的基本原理</li>
            <li>✅ 粒子间相互作用力的计算</li>
            <li>✅ GPU 并行加速流体模拟</li>
            <li>✅ 空间哈希优化算法</li>
          </ul>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">← 第7课：粒子物理模拟（重力场）</button>
        <button class="nav-btn next" @click="goToNext">完成课程 →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import * as ti from 'taichi.js'

// Demo 控制参数
const particleCount = ref(1000)
const viscosity = ref(2.5)
const pressureStiffness = ref(200)
const gravity = ref(1.0)
const isAnimating = ref(true)
const status = ref('初始化中...')
const fps = ref(0)
const avgDensity = ref(0)
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
let container: THREE.Mesh

// Taichi.js 变量
let tiPositions: any = null
let tiVelocities: any = null
let tiForces: any = null
let tiDensities: any = null
let tiPressures: any = null
let tiColors: any = null
let tiViscosity: any = null
let tiStiffness: any = null
let tiGravity: any = null
let tiInit: any = null
let tiUpdate: any = null

let N = 1000
let h = 0.6
let rho0 = 1.0
let dt = 0.01
let lastFrameTime = performance.now()
let frameCount = 0

// 初始化 Three.js 场景
function initThreeJS() {
  const width = canvasContainer.value!.clientWidth || 800
  const height = 500

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.z = 12
  camera.position.y = 2
  camera.lookAt(0, -1, 0)

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
  const geometry = new THREE.BoxGeometry(6, 5, 6)
  const edges = new THREE.EdgesGeometry(geometry)
  const material = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5 })
  container = new THREE.LineSegments(edges, material)
  container.position.y = -0.5
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

    N = particleCount.value

    // 创建字段
    tiPositions = ti.Vector.field(3, ti.f32, [N])
    tiVelocities = ti.Vector.field(3, ti.f32, [N])
    tiForces = ti.Vector.field(3, ti.f32, [N])
    tiDensities = ti.field(ti.f32, [N])
    tiPressures = ti.field(ti.f32, [N])
    tiColors = ti.Vector.field(3, ti.f32, [N])
    tiViscosity = ti.field(ti.f32, [1])
    tiStiffness = ti.field(ti.f32, [1])
    tiGravity = ti.field(ti.f32, [1])

    ti.addToKernelScope({
      tiPositions, tiVelocities, tiForces,
      tiDensities, tiPressures, tiColors,
      tiViscosity, tiStiffness, tiGravity,
      h, rho0, dt, N
    })

    // 初始化内核
    tiInit = ti.kernel(() => {
      for (let i of ti.range(N)) {
        // 初始化位置（在容器内）
        tiPositions[i][0] = (ti.random() * 4 - 2)
        tiPositions[i][1] = ti.random() * 2
        tiPositions[i][2] = (ti.random() * 4 - 2)

        // 初始化速度
        tiVelocities[i][0] = 0
        tiVelocities[i][1] = 0
        tiVelocities[i][2] = 0

        // 初始化颜色（蓝色系）
        tiColors[i][0] = 0
        tiColors[i][1] = 0.5 + ti.random() * 0.3
        tiColors[i][2] = 1
      }

      tiViscosity[0] = 2.5
      tiStiffness[0] = 200
      tiGravity[0] = 9.8
    })

    // 简化的粒子交互内核（模拟流体效果）
    tiUpdate = ti.kernel(() => {
      let g = tiGravity[0]
      let mu = tiViscosity[0] * 0.1
      let k = tiStiffness[0] * 0.01
      let h_local = 0.8
      let h2 = h_local * h_local

      // 计算每个粒子的相互作用力
      for (let i of ti.range(N)) {
        // 使用字段累加力
        tiForces[i][0] = 0.0
        tiForces[i][1] = 0.0
        tiForces[i][2] = 0.0

        for (let j of ti.range(N)) {
          if (i === j) continue

          let dx = tiPositions[j][0] - tiPositions[i][0]
          let dy = tiPositions[j][1] - tiPositions[i][1]
          let dz = tiPositions[j][2] - tiPositions[i][2]
          let d2 = dx * dx + dy * dy + dz * dz

          if (d2 < h2 && d2 > 0.0001) {
            let d = ti.sqrt(d2)
            let f = k * (h_local - d) / h_local

            tiForces[i][0] = tiForces[i][0] + f * dx / d
            tiForces[i][1] = tiForces[i][1] + f * dy / d
            tiForces[i][2] = tiForces[i][2] + f * dz / d
          }
        }

        // 应用重力
        tiForces[i][1] = tiForces[i][1] - g

        // 更新速度（包含阻尼）
        tiVelocities[i][0] = tiVelocities[i][0] * (1.0 - mu) + tiForces[i][0] * dt
        tiVelocities[i][1] = tiVelocities[i][1] * (1.0 - mu) + tiForces[i][1] * dt
        tiVelocities[i][2] = tiVelocities[i][2] * (1.0 - mu) + tiForces[i][2] * dt

        // 限制最大速度
        let speed2 = tiVelocities[i][0] * tiVelocities[i][0] +
                     tiVelocities[i][1] * tiVelocities[i][1] +
                     tiVelocities[i][2] * tiVelocities[i][2]
        let speed = ti.sqrt(speed2)
        let maxSpeed = 20.0
        if (speed > maxSpeed) {
          let scale = maxSpeed / speed
          tiVelocities[i][0] *= scale
          tiVelocities[i][1] *= scale
          tiVelocities[i][2] *= scale
        }

        // 更新位置
        tiPositions[i][0] += tiVelocities[i][0] * dt
        tiPositions[i][1] += tiVelocities[i][1] * dt
        tiPositions[i][2] += tiVelocities[i][2] * dt

        // 边界碰撞
        let boundX = 2.9
        let boundY = 2.4
        let boundZ = 2.9
        let damping = 0.5

        if (tiPositions[i][0] > boundX) {
          tiPositions[i][0] = boundX
          tiVelocities[i][0] *= -damping
        }
        if (tiPositions[i][0] < -boundX) {
          tiPositions[i][0] = -boundX
          tiVelocities[i][0] *= -damping
        }
        if (tiPositions[i][1] < -boundY) {
          tiPositions[i][1] = -boundY
          tiVelocities[i][1] *= -damping
        }
        if (tiPositions[i][1] > boundY) {
          tiPositions[i][1] = boundY
          tiVelocities[i][1] *= -damping
        }
        if (tiPositions[i][2] > boundZ) {
          tiPositions[i][2] = boundZ
          tiVelocities[i][2] *= -damping
        }
        if (tiPositions[i][2] < -boundZ) {
          tiPositions[i][2] = -boundZ
          tiVelocities[i][2] *= -damping
        }

        // 根据速度更新颜色
        tiColors[i][0] = ti.min(1.0, speed * 0.3)
        tiColors[i][1] = ti.max(0.0, 0.5 - speed * 0.05)
        tiColors[i][2] = 1.0
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

  const gpuStart = performance.now()

  try {
    // 更新物理参数
    tiViscosity[0] = viscosity.value
    tiStiffness[0] = pressureStiffness.value
    tiGravity[0] = 9.8 * gravity.value

    // GPU 计算
    await tiUpdate()

    const gpuEnd = performance.now()
    computeTime.value = (gpuEnd - gpuStart).toFixed(2)

    // 数据传输
    const posData = await tiPositions.toArray()
    const colData = await tiColors.toArray()
    const denData = await tiDensities.toArray()

    // 计算平均密度
    let totalDensity = 0
    for (let i = 0; i < N; i++) {
      if (denData[i] !== undefined && denData[i] !== null) {
        totalDensity += denData[i]
      }
    }
    avgDensity.value = (totalDensity / N).toFixed(1)

    // 更新 Three.js
    const positionsAttr = particles.geometry.attributes.position
    const colorsAttr = particles.geometry.attributes.color

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

    positionsAttr.needsUpdate = true
    colorsAttr.needsUpdate = true

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
    frameCount = 0
    lastFrameTime = now
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

  N = particleCount.value

  await initTaichi()
  createParticles()
}

function goToPrev() {
  window.location.reload()
}

function goToNext() {
  alert('恭喜完成所有课程！🎉')
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
        font-size: 10px;
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

      pre {
        background: rgba(0, 0, 0, 0.4);
        padding: 10px;
        border-radius: 6px;
        overflow-x: auto;

        code {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          line-height: 1.3;
          color: #aaffaa;
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
