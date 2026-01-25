<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第9课：空间哈希优化</h2>
          <span class="lesson-tag">性能优化</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>理解 O(N²) 到 O(N) 的算法复杂度优化</li>
            <li>学习空间哈希（Spatial Hashing）的实现原理</li>
            <li>掌握 Taichi.js 中的网格粒子映射技术</li>
            <li>实现高效的粒子邻域查找算法</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 什么是空间哈希？</h3>
          <p>
            <strong>空间哈希（Spatial Hashing）</strong>
            是一种空间分区技术，用于加速近邻查询。它将连续空间划分为规则的网格，每个粒子根据其位置映射到对应的网格单元。
          </p>
          <div class="highlight-box">
            <strong>核心思想：</strong>
            <p>只计算同一网格及相邻网格中的粒子相互作用，避免遍历所有粒子。</p>
          </div>
          <pre><code>// 原始 O(N²) 方法
for (let i of ti.range(N)) {
  for (let j of ti.range(N)) {  // 遍历所有粒子！
    // 计算相互作用
  }
}

// 优化后的 O(N) 方法
for (let i of ti.range(N)) {
  // 只检查 3x3x3 = 27 个相邻网格
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        // 只检查相邻网格中的粒子
      }
    }
  }
}</code></pre>
        </div>

        <div class="section">
          <h3>📖 空间哈希实现步骤</h3>
          <div class="formula-list">
            <div class="formula-item">
              <h4>1. 定义网格参数</h4>
              <pre><code>// 网格大小（等于粒子相互作用半径）
let h = 0.6

// 网格单元索引计算
let gridX = ti.floor(x / h)
let gridY = ti.floor(y / h)
let gridZ = ti.floor(z / h)

// 空间哈希函数（将 3D 索引映射到 1D）
let hash = gridX * GRID_SIZE * GRID_SIZE +
           gridY * GRID_SIZE +
           gridZ</code></pre>
            </div>
            <div class="formula-item">
              <h4>2. 数据结构</h4>
              <pre><code>// 每个网格的粒子计数
let gridCount = ti.field(ti.i32, [MAX_CELLS])

// 每个网格中的粒子列表
let gridParticles = ti.field(ti.i32, [MAX_CELLS, MAX_PARTICLES_PER_CELL])

// 每个粒子所属的网格
let particleGrid = ti.field(ti.i32, [N])</code></pre>
            </div>
            <div class="formula-item">
              <h4>3. 构建空间哈希</h4>
              <pre><code>let buildGrid = ti.kernel(() => {
  // 清空网格
  for (let i of ti.range(MAX_CELLS)) {
    gridCount[i] = 0
  }

  // 将粒子分配到网格
  for (let i of ti.range(N)) {
    let gridX = ti.floor((positions[i][0] + offset) / h)
    let gridY = ti.floor((positions[i][1] + offset) / h)
    let gridZ = ti.floor((positions[i][2] + offset) / h)

    let cellHash = gridX * GRID_SIZE_SQ +
                   gridY * GRID_SIZE +
                   gridZ

    particleGrid[i] = cellHash
    let idx = ti.atomicAdd(gridCount[cellHash], 1)
    gridParticles[cellHash][idx] = i
  }
})</code></pre>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💻 完整代码示例</h3>
          <div class="code-demo">
            <pre><code>// 空间哈希优化的粒子相互作用计算
let computeForcesWithHash = ti.kernel(() => {
  // 先构建空间哈希
  buildGrid()

  // 计算相互作用
  for (let i of ti.range(N)) {
    let fx = 0.0, fy = 0.0, fz = 0.0
    let pos_i = positions[i]

    // 获取粒子所在网格
    let gridX = ti.floor((pos_i[0] + offset) / h)
    let gridY = ti.floor((pos_i[1] + offset) / h)
    let gridZ = ti.floor((pos_i[2] + offset) / h)

    // 检查 3x3x3 邻域（27 个网格）
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          let neighborX = gridX + dx
          let neighborY = gridY + dy
          let neighborZ = gridZ + dz

          let cellHash = neighborX * GRID_SIZE_SQ +
                         neighborY * GRID_SIZE +
                         neighborZ

          // 遍历该网格中的所有粒子
          let count = gridCount[cellHash]
          for (let k of ti.range(count)) {
            let j = gridParticles[cellHash][k]

            if (i === j) continue

            let dx_p = positions[j][0] - pos_i[0]
            let dy_p = positions[j][1] - pos_i[1]
            let dz_p = positions[j][2] - pos_i[2]
            let d2 = dx_p*dx_p + dy_p*dy_p + dz_p*dz_p

            if (d2 < h*h && d2 > 0.0001) {
              let d = ti.sqrt(d2)
              let f = k * (h - d) / h
              fx += f * dx_p / d
              fy += f * dy_p / d
              fz += f * dz_p / d
            }
          }
        }
      }
    }

    forces[i][0] = fx
    forces[i][1] = fy - g
    forces[i][2] = fz
  }
})</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>📊 性能对比</h3>
          <div class="highlight-box">
            <strong>优化效果：</strong>
            <ul>
              <li><strong>原始方法：</strong> O(N²) - 对于 2000 粒子，需要 4,000,000 次计算</li>
              <li><strong>空间哈希：</strong> O(N × 27) - 对于 2000 粒子，只需要约 54,000 次计算</li>
              <li><strong>加速比：</strong> 约为 N / 27 ≈ 74 倍（理论值）</li>
            </ul>
          </div>
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
                  <option :value="5000">5000</option>
                </select>
              </label>
              <label>
                <input type="checkbox" v-model="useSpatialHash" @change="resetSimulation" />
                使用空间哈希优化
              </label>
              <label>
                相互作用半径: {{ interactionRadius }}
                <input v-model.number="interactionRadius" type="range" min="0.3" max="1.0" step="0.1" />
              </label>
              <button @click="resetSimulation">重置</button>
              <button @click="toggleAnimation">{{ isAnimating ? '暂停' : '继续' }}</button>
            </div>
            <div class="demo-canvas-container" ref="canvasContainer"></div>
            <div class="demo-info">
              <p>状态: <span :class="statusClass">{{ status }}</span></p>
              <p>FPS: {{ fps }}</p>
              <p>计算时间: {{ computeTime }}ms</p>
              <p>网格数量: {{ gridCells }}</p>
              <p v-if="useSpatialHash">优化倍数: ~{{ Math.floor(particleCount / 27) }}x</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💡 优化技巧</h3>
          <div class="tips">
            <div class="tip-card">
              <h4>1. 网格大小选择</h4>
              <p>网格大小应等于或略大于粒子的相互作用半径，确保所有可能的邻居都在相邻网格中。</p>
            </div>
            <div class="tip-card">
              <h4>2. 边界处理</h4>
              <p>对于边界外的网格，需要跳过或进行特殊处理，避免数组越界访问。</p>
            </div>
            <div class="tip-card">
              <h4>3. 粒子密度平衡</h4>
              <p>如果某些网格粒子过多，可以考虑使用更高维度的空间分区（如八叉树）。</p>
            </div>
            <div class="tip-card">
              <h4>4. GPU 并行优势</h4>
              <p>Taichi.js 的原子操作（ti.atomicAdd）确保了多线程安全，使得构建哈希表可以完全并行化。</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>完成本课后，您将了解：</p>
          <ul>
            <li>✅ 空间哈希的基本原理和实现</li>
            <li>✅ 如何将 O(N²) 算法优化到接近 O(N)</li>
            <li>✅ Taichi.js 中的网格粒子映射技术</li>
            <li>✅ 粒子邻域查找的高效实现</li>
          </ul>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">← 第8课：流体粒子模拟（SPH）</button>
        <button class="nav-btn next" @click="goToNext">第10课：大规模粒子系统 →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import * as ti from 'taichi.js'

// Demo 控制参数
const particleCount = ref(2000)
const useSpatialHash = ref(true)
const interactionRadius = ref(0.6)
const isAnimating = ref(true)
const status = ref('初始化中...')
const fps = ref(0)
const computeTime = ref(0)
const gridCells = ref(0)

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
let tiColors: any = null
let tiViscosity: any = null
let tiStiffness: any = null
let tiGravity: any = null

// 空间哈希相关
let gridCount: any = null
let gridParticles: any = null
let particleGrid: any = null

let tiInit: any = null
let tiBuildGrid: any = null
let tiUpdate: any = null

let N = 2000
let h = 0.6
let dt = 0.01
let GRID_SIZE = 32
let MAX_PARTICLES_PER_CELL = 64
let MAX_CELLS = GRID_SIZE * GRID_SIZE * GRID_SIZE
let MAX_GRID_PARTICLES = MAX_CELLS * MAX_PARTICLES_PER_CELL
let offset = 3.0
let GRID_SIZE_SQ = GRID_SIZE * GRID_SIZE
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
    size: 0.08,
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
    h = interactionRadius.value

    // 创建字段
    tiPositions = ti.Vector.field(3, ti.f32, [N])
    tiVelocities = ti.Vector.field(3, ti.f32, [N])
    tiForces = ti.Vector.field(3, ti.f32, [N])
    tiColors = ti.Vector.field(3, ti.f32, [N])
    tiViscosity = ti.field(ti.f32, [1])
    tiStiffness = ti.field(ti.f32, [1])
    tiGravity = ti.field(ti.f32, [1])

    // 空间哈希字段
    gridCount = ti.field(ti.i32, [MAX_CELLS])
    gridParticles = ti.field(ti.i32, [MAX_GRID_PARTICLES])
    particleGrid = ti.field(ti.i32, [N])

    ti.addToKernelScope({
      tiPositions, tiVelocities, tiForces, tiColors,
      tiViscosity, tiStiffness, tiGravity,
      gridCount, gridParticles, particleGrid,
      h, dt, N, GRID_SIZE, MAX_PARTICLES_PER_CELL, MAX_CELLS, MAX_GRID_PARTICLES,
      offset, GRID_SIZE_SQ
    })

    // 初始化内核
    tiInit = ti.kernel(() => {
      for (let i of ti.range(N)) {
        tiPositions[i][0] = ti.random() * 4 - 2
        tiPositions[i][1] = ti.random() * 2
        tiPositions[i][2] = ti.random() * 4 - 2

        tiVelocities[i][0] = 0
        tiVelocities[i][1] = 0
        tiVelocities[i][2] = 0

        tiColors[i][0] = 0
        tiColors[i][1] = 0.5 + ti.random() * 0.3
        tiColors[i][2] = 1
      }

      tiViscosity[0] = 2.5
      tiStiffness[0] = 200
      tiGravity[0] = 9.8
    })

    // 构建空间哈希内核
    tiBuildGrid = ti.kernel(() => {
      // 清空网格
      for (let i of ti.range(MAX_CELLS)) {
        gridCount[i] = 0
      }

      // 将粒子分配到网格
      for (let i of ti.range(N)) {
        let gridX = ti.floor((tiPositions[i][0] + offset) / h)
        let gridY = ti.floor((tiPositions[i][1] + offset) / h)
        let gridZ = ti.floor((tiPositions[i][2] + offset) / h)

        let cellHash = gridX * GRID_SIZE_SQ + gridY * GRID_SIZE + gridZ

        if (cellHash >= 0 && cellHash < MAX_CELLS) {
          particleGrid[i] = cellHash
          let idx = ti.atomicAdd(gridCount[cellHash], 1)
          if (idx < MAX_PARTICLES_PER_CELL) {
            let linearIdx = cellHash * MAX_PARTICLES_PER_CELL + idx
            gridParticles[linearIdx] = i
          }
        }
      }
    })

    // 使用空间哈希优化的更新内核
    tiUpdate = ti.kernel(() => {
      let g = tiGravity[0]
      let mu = tiViscosity[0] * 0.1
      let k = tiStiffness[0] * 0.01

      // 先构建空间哈希
      for (let i of ti.range(MAX_CELLS)) {
        gridCount[i] = 0
      }

      for (let i of ti.range(N)) {
        let gridX = ti.floor((tiPositions[i][0] + offset) / h)
        let gridY = ti.floor((tiPositions[i][1] + offset) / h)
        let gridZ = ti.floor((tiPositions[i][2] + offset) / h)

        let cellHash = gridX * GRID_SIZE_SQ + gridY * GRID_SIZE + gridZ

        if (cellHash >= 0 && cellHash < MAX_CELLS) {
          particleGrid[i] = cellHash
          let idx = ti.atomicAdd(gridCount[cellHash], 1)
          if (idx < MAX_PARTICLES_PER_CELL) {
            let linearIdx = cellHash * MAX_PARTICLES_PER_CELL + idx
            gridParticles[linearIdx] = i
          }
        }
      }

      // 计算相互作用
      for (let i of ti.range(N)) {
        tiForces[i][0] = 0.0
        tiForces[i][1] = 0.0
        tiForces[i][2] = 0.0

        let gridX = ti.floor((tiPositions[i][0] + offset) / h)
        let gridY = ti.floor((tiPositions[i][1] + offset) / h)
        let gridZ = ti.floor((tiPositions[i][2] + offset) / h)

        let h2 = h * h

        // 检查 3x3x3 邻域
        for (let dx_idx of ti.range(3)) {
          let dx = dx_idx - 1
          for (let dy_idx of ti.range(3)) {
            let dy = dy_idx - 1
            for (let dz_idx of ti.range(3)) {
              let dz = dz_idx - 1

              let neighborX = gridX + dx
              let neighborY = gridY + dy
              let neighborZ = gridZ + dz

              let cellHash = neighborX * GRID_SIZE_SQ +
                             neighborY * GRID_SIZE +
                             neighborZ

              if (cellHash >= 0 && cellHash < MAX_CELLS) {
                let count = gridCount[cellHash]
                for (let k of ti.range(count)) {
                  let linearIdx = cellHash * MAX_PARTICLES_PER_CELL + k
                  let j = gridParticles[linearIdx]

                  if (i === j) continue

                  let dx_p = tiPositions[j][0] - tiPositions[i][0]
                  let dy_p = tiPositions[j][1] - tiPositions[i][1]
                  let dz_p = tiPositions[j][2] - tiPositions[i][2]
                  let d2 = dx_p * dx_p + dy_p * dy_p + dz_p * dz_p

                  if (d2 < h2 && d2 > 0.0001) {
                    let d = ti.sqrt(d2)
                    let f = k * (h - d) / h
                    tiForces[i][0] = tiForces[i][0] + f * dx_p / d
                    tiForces[i][1] = tiForces[i][1] + f * dy_p / d
                    tiForces[i][2] = tiForces[i][2] + f * dz_p / d
                  }
                }
              }
            }
          }
        }

        // 应用重力
        tiForces[i][1] = tiForces[i][1] - g

        // 更新速度
        tiVelocities[i][0] = tiVelocities[i][0] * (1.0 - mu) + tiForces[i][0] * dt
        tiVelocities[i][1] = tiVelocities[i][1] * (1.0 - mu) + tiForces[i][1] * dt
        tiVelocities[i][2] = tiVelocities[i][2] * (1.0 - mu) + tiForces[i][2] * dt

        // 限制速度
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

        // 更新颜色
        tiColors[i][0] = ti.min(1.0, speed * 0.3)
        tiColors[i][1] = ti.max(0.0, 0.5 - speed * 0.05)
        tiColors[i][2] = 1.0
      }
    })

    await tiInit()
    gridCells.value = MAX_CELLS
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
    // GPU 计算
    await tiUpdate()

    const gpuEnd = performance.now()
    computeTime.value = (gpuEnd - gpuStart).toFixed(2)

    // 数据传输
    const posData = await tiPositions.toArray()
    const colData = await tiColors.toArray()

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
  h = interactionRadius.value

  await initTaichi()
  createParticles()
}

function goToPrev() {
  window.location.reload()
}

function goToNext() {
  alert('第10课即将推出！')
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

    ul {
      margin-top: 10px;
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
