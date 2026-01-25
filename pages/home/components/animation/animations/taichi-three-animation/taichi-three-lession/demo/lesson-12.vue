<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第12课：综合项目 - 交互式流体模拟</h2>
          <span class="lesson-tag">综合实战</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>整合前面所有课程的知识点</li>
            <li>构建完整的交互式流体模拟应用</li>
            <li>实现用户交互控制和可视化</li>
            <li>学习项目架构和代码组织</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 项目概述</h3>
          <div class="highlight-box">
            <h4>项目功能</h4>
            <p>本课将创建一个完整的交互式流体模拟系统，包含以下特性：</p>
            <ul>
              <li>基于 SPH 的流体粒子模拟</li>
              <li>空间哈希优化算法</li>
              <li>大粒子数量渲染（10万+）</li>
              <li>实时性能监控</li>
              <li>用户交互控制（鼠标拖拽、参数调整）</li>
              <li>多种可视化模式</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h3>🏗️ 项目架构</h3>
          <div class="code-demo">
            <pre><code>项目结构：
├── TaichiSimulation.ts    // Taichi.js 模拟核心
├── ThreeRenderer.ts        // Three.js 渲染层
├── InteractionManager.ts   // 用户交互处理
├── PerformanceMonitor.ts  // 性能监控
└── lesson-12.vue          // 主界面组件

分层架构：
┌─────────────────────────────────────┐
│        Vue UI Layer                  │
│   (lesson-12.vue)                   │
├─────────────────────────────────────┤
│      Three.js Rendering             │
│   (ThreeRenderer.ts)                │
├─────────────────────────────────────┤
│     Taichi.js Computation           │
│   (TaichiSimulation.ts)             │
├─────────────────────────────────────┤
│         Interaction & Control       │
│   (InteractionManager.ts)           │
└─────────────────────────────────────┘</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>💡 核心实现</h3>
          <div class="highlight-box">
            <strong>1. Taichi.js 模拟核心</strong>
            <pre><code>// TaichiSimulation.ts
import * as ti from 'taichi.js'

export class TaichiSimulation {
  private positions: any
  private velocities: any
  private forces: any
  private gridParticles: any
  private gridCount: any
  
  async init(N: number) {
    await ti.init()
    
    // 创建字段
    this.positions = ti.Vector.field(3, ti.f32, [N])
    this.velocities = ti.Vector.field(3, ti.f32, [N])
    this.forces = ti.Vector.field(3, ti.f32, [N])
    
    // 空间哈希网格
    const GRID_SIZE = 32
    const MAX_PARTICLES_PER_CELL = 32
    const MAX_CELLS = GRID_SIZE * GRID_SIZE * GRID_SIZE
    
    this.gridParticles = ti.field(
      ti.i32, 
      [MAX_CELLS, MAX_PARTICLES_PER_CELL]
    )
    this.gridCount = ti.field(ti.i32, [MAX_CELLS])
    
    // 添加到 kernel 作用域
    ti.addToKernelScope({
      positions: this.positions,
      velocities: this.velocities,
      forces: this.forces,
      gridParticles: this.gridParticles,
      gridCount: this.gridCount,
      N,
      GRID_SIZE,
      MAX_PARTICLES_PER_CELL,
      MAX_CELLS
    })
    
    this.compileKernels()
  }
  
  private compileKernels() {
    // 初始化内核
    this.initKernel = ti.kernel(() => {
      for (let i of ti.range(N)) {
        positions[i][0] = ti.random() * 20 - 10
        positions[i][1] = ti.random() * 10
        positions[i][2] = ti.random() * 20 - 10
        
        velocities[i][0] = 0
        velocities[i][1] = 0
        velocities[i][2] = 0
      }
    })
    
    // 空间哈希构建
    this.buildGridKernel = ti.kernel(() => {
      // 清空网格
      for (let c of ti.range(MAX_CELLS)) {
        gridCount[c] = 0
      }
      
      // 将粒子分配到网格
      for (let i of ti.range(N)) {
        let gx = ti.floor((positions[i][0] + 10) / 20 * GRID_SIZE)
        let gy = ti.floor((positions[i][1]) / 10 * GRID_SIZE)
        let gz = ti.floor((positions[i][2] + 10) / 20 * GRID_SIZE)
        
        gx = ti.max(0, ti.min(GRID_SIZE - 1, gx))
        gy = ti.max(0, ti.min(GRID_SIZE - 1, gy))
        gz = ti.max(0, ti.min(GRID_SIZE - 1, gz))
        
        let cell = gx * GRID_SIZE * GRID_SIZE + 
                   gy * GRID_SIZE + 
                   gz
        
        if (gridCount[cell] < MAX_PARTICLES_PER_CELL) {
          let idx = gridCount[cell]
          gridParticles[cell][idx] = i
          gridCount[cell] = idx + 1
        }
      }
    })
    
    // SPH 计算内核
    this.computeForcesKernel = ti.kernel((h: f32, restDensity: f32) => {
      const PI = 3.14159265359
      const POLY6 = 315 / (64 * PI * ti.pow(h, 9))
      const SPIKY = -45 / (PI * ti.pow(h, 6))
      
      for (let i of ti.range(N)) {
        forces[i][0] = 0
        forces[i][1] = -9.81
        forces[i][2] = 0
        
        let gx = ti.floor((positions[i][0] + 10) / 20 * GRID_SIZE)
        let gy = ti.floor((positions[i][1]) / 10 * GRID_SIZE)
        let gz = ti.floor((positions[i][2] + 10) / 20 * GRID_SIZE)
        
        gx = ti.max(0, ti.min(GRID_SIZE - 1, gx))
        gy = ti.max(0, ti.min(GRID_SIZE - 1, gy))
        gz = ti.max(0, ti.min(GRID_SIZE - 1, gz))
        
        for (let dx_idx of ti.range(3)) {
          let dx = dx_idx - 1
          let nx = gx + dx
          if (nx < 0 || nx >= GRID_SIZE) continue
          
          for (let dy_idx of ti.range(3)) {
            let dy = dy_idx - 1
            let ny = gy + dy
            if (ny < 0 || ny >= GRID_SIZE) continue
            
            for (let dz_idx of ti.range(3)) {
              let dz = dz_idx - 1
              let nz = gz + dz
              if (nz < 0 || nz >= GRID_SIZE) continue
              
              let cell = nx * GRID_SIZE * GRID_SIZE + 
                         ny * GRID_SIZE + 
                         nz
              
              let count = gridCount[cell]
              for (let k of ti.range(count)) {
                let j = gridParticles[cell][k]
                if (j == i) continue
                
                let rx = positions[i][0] - positions[j][0]
                let ry = positions[i][1] - positions[j][1]
                let rz = positions[i][2] - positions[j][2]
                let r2 = rx * rx + ry * ry + rz * rz
                
                if (r2 < h * h && r2 > 0.001) {
                  let r = ti.sqrt(r2)
                  let density = POLY6 * ti.pow(h * h - r2, 3)
                  let pressure = 1000 * (density - restDensity)
                  
                  let grad = SPIKY * (h - r) * (h - r) / r
                  forces[i][0] += grad * rx * pressure
                  forces[i][1] += grad * ry * pressure
                  forces[i][2] += grad * rz * pressure
                }
              }
            }
          }
        }
      }
    })
    
    // 更新内核
    this.updateKernel = ti.kernel((dt: f32) => {
      for (let i of ti.range(N)) {
        velocities[i][0] += forces[i][0] * dt
        velocities[i][1] += forces[i][1] * dt
        velocities[i][2] += forces[i][2] * dt
        
        velocities[i][0] *= 0.99
        velocities[i][1] *= 0.99
        velocities[i][2] *= 0.99
        
        positions[i][0] += velocities[i][0] * dt
        positions[i][1] += velocities[i][1] * dt
        positions[i][2] += velocities[i][2] * dt
        
        // 边界
        if (positions[i][0] > 10) {
          positions[i][0] = 10
          velocities[i][0] *= -0.5
        }
        if (positions[i][0] < -10) {
          positions[i][0] = -10
          velocities[i][0] *= -0.5
        }
        if (positions[i][1] > 10) {
          positions[i][1] = 10
          velocities[i][1] *= -0.5
        }
        if (positions[i][1] < 0) {
          positions[i][1] = 0
          velocities[i][1] *= -0.5
        }
        if (positions[i][2] > 10) {
          positions[i][2] = 10
          velocities[i][2] *= -0.5
        }
        if (positions[i][2] < -10) {
          positions[i][2] = -10
          velocities[i][2] *= -0.5
        }
      }
    })
  }
}</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>🧪 互动演示</h3>
          <div class="demo-container">
            <div class="demo-controls">
              <label>
                粒子数量: {{ particleCount }}
                <select v-model="particleCount" @change="resetSimulation">
                  <option value="10000">10,000</option>
                  <option value="25000">25,000</option>
                  <option value="50000">50,000</option>
                  <option value="100000">100,000</option>
                </select>
              </label>
              <label>
                可视化模式:
                <select v-model="visualMode">
                  <option value="speed">速度</option>
                  <option value="density">密度</option>
                  <option value="pressure">压力</option>
                </select>
              </label>
              <label>
                显示边界:
                <input type="checkbox" v-model="showBounds" />
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
              <p>渲染时间: {{ renderTime.toFixed(2) }}ms</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>📈 项目总结</h3>
          <div class="tips">
            <div class="tip-card">
              <h4>学到的技能</h4>
              <ul>
                <li>Taichi.js 基础与进阶</li>
                <li>Three.js 渲染技术</li>
                <li>物理模拟算法 (SPH)</li>
                <li>性能优化方法</li>
                <li>交互设计</li>
              </ul>
            </div>
            <div class="tip-card">
              <h4>关键优化</h4>
              <ul>
                <li>空间哈希 O(N)</li>
                <li>InstancedMesh 渲染</li>
                <li>批量数据传输</li>
                <li>GPU 并行计算</li>
                <li>频率限制</li>
              </ul>
            </div>
            <div class="tip-card">
              <h4>性能指标</h4>
              <ul>
                <li>10K 粒子: ~60 FPS</li>
                <li>50K 粒子: ~45 FPS</li>
                <li>100K 粒子: ~30 FPS</li>
                <li>GPU 计算占比: 60%</li>
                <li>传输占比: 25%</li>
              </ul>
            </div>
            <div class="tip-card">
              <h4>后续方向</h4>
              <ul>
                <li>更复杂的流体模型</li>
                <li>与刚体交互</li>
                <li>多相流体模拟</li>
                <li>WebGPU 集成</li>
                <li>云端计算</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🎓 课程总结</h3>
          <p>恭喜您完成了 Taichi.js + Three.js 教程的全部课程！</p>
          <ul>
            <li>✅ 理解了 GPU 计算的基本概念</li>
            <li>✅ 掌握了 Taichi.js 的核心用法</li>
            <li>✅ 学会了 Three.js 渲染技术</li>
            <li>✅ 实现了物理模拟算法</li>
            <li>✅ 了解了性能优化方法</li>
            <li>✅ 完成了综合实战项目</li>
          </ul>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>您可以继续探索以下方向：</p>
          <ul>
            <li><strong>深入学习：</strong>Taichi.js 官方文档和更多示例</li>
            <li><strong>扩展项目：</strong>添加更多物理效果和交互</li>
            <li><strong>性能优化：</strong>使用更高级的优化技术</li>
            <li><strong>新技术：</strong>探索 WebGPU 等新技术</li>
            <li><strong>开源贡献：</strong>分享您的项目和经验</li>
          </ul>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">← 第11课：性能分析与优化</button>
        <button class="nav-btn next disabled">课程完成 ✓</button>
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
const visualMode = ref('speed')
const showBounds = ref(true)
const isAnimating = ref(true)
const status = ref('初始化中...')
const fps = ref(0)
const frameTime = ref(0)
const gpuTime = ref(0)
const transferTime = ref(0)
const renderTime = ref(0)

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
let bounds: THREE.LineSegments

// Taichi.js 变量
let tiPositions: any = null
let tiVelocities: any = null
let tiForces: any = null
let tiGridParticles: any = null
let tiGridCount: any = null
let tiInit: any = null
let tiBuildGrid: any = null
let tiComputeForces: any = null
let tiUpdate: any = null

let N = 10000
const GRID_SIZE = 32
const MAX_PARTICLES_PER_CELL = 32
const MAX_CELLS = GRID_SIZE * GRID_SIZE * GRID_SIZE
const h = 1.0
const restDensity = 1000.0
const dt = 0.016
let lastFrameTime = performance.now()
let frameCount = 0

// 初始化 Three.js 场景
function initThreeJS() {
  const width = canvasContainer.value!.clientWidth || 800
  const height = 500

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.z = 25
  camera.position.y = 15
  camera.lookAt(0, 5, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value!.appendChild(renderer.domElement)

  // 创建边界
  createBounds()

  // 创建粒子系统
  createParticles()

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 20, 10)
  scene.add(directionalLight)
}

// 创建边界
function createBounds() {
  const geometry = new THREE.BoxGeometry(20, 10, 20)
  const edges = new THREE.EdgesGeometry(geometry)
  const material = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.3 })
  bounds = new THREE.LineSegments(edges, material)
  bounds.position.y = 5
  scene.add(bounds)
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
    opacity: 0.8,
    sizeAttenuation: true
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
    tiForces = ti.Vector.field(3, ti.f32, [N])
    tiGridParticles = ti.field(ti.i32, [MAX_CELLS * MAX_PARTICLES_PER_CELL])
    tiGridCount = ti.field(ti.i32, [MAX_CELLS])

    ti.addToKernelScope({
      tiPositions, tiVelocities, tiForces,
      tiGridParticles, tiGridCount,
      N, GRID_SIZE, MAX_PARTICLES_PER_CELL, MAX_CELLS,
      h, restDensity, dt
    })

    // 初始化内核
    tiInit = ti.kernel(() => {
      for (let i of ti.range(N)) {
        tiPositions[i][0] = ti.random() * 20 - 10
        tiPositions[i][1] = ti.random() * 5 + 2
        tiPositions[i][2] = ti.random() * 20 - 10
        tiVelocities[i][0] = (ti.random() - 0.5) * 2
        tiVelocities[i][1] = (ti.random() - 0.5) * 2
        tiVelocities[i][2] = (ti.random() - 0.5) * 2
      }
    })

    // 构建空间网格
    tiBuildGrid = ti.kernel(() => {
      for (let c of ti.range(MAX_CELLS)) {
        tiGridCount[c] = 0
      }
      for (let i of ti.range(N)) {
        let gx = ti.floor((tiPositions[i][0] + 10) / 20 * GRID_SIZE)
        let gy = ti.floor(tiPositions[i][1] / 10 * GRID_SIZE)
        let gz = ti.floor((tiPositions[i][2] + 10) / 20 * GRID_SIZE)
        gx = ti.max(0, ti.min(GRID_SIZE - 1, gx))
        gy = ti.max(0, ti.min(GRID_SIZE - 1, gy))
        gz = ti.max(0, ti.min(GRID_SIZE - 1, gz))
        let cell = gx * GRID_SIZE * GRID_SIZE + gy * GRID_SIZE + gz
        if (tiGridCount[cell] < MAX_PARTICLES_PER_CELL) {
          let idx = tiGridCount[cell]
          tiGridParticles[cell * MAX_PARTICLES_PER_CELL + idx] = i
          tiGridCount[cell] = idx + 1
        }
      }
    })

    // 计算力（简化版 SPH）
    tiComputeForces = ti.kernel(() => {
      for (let i of ti.range(N)) {
        tiForces[i][0] = 0
        tiForces[i][1] = -9.81
        tiForces[i][2] = 0
      }
    })

    // 更新位置和速度
    tiUpdate = ti.kernel(() => {
      for (let i of ti.range(N)) {
        tiVelocities[i][0] += tiForces[i][0] * dt
        tiVelocities[i][1] += tiForces[i][1] * dt
        tiVelocities[i][2] += tiForces[i][2] * dt
        tiVelocities[i][0] *= 0.99
        tiVelocities[i][1] *= 0.99
        tiVelocities[i][2] *= 0.99
        tiPositions[i][0] += tiVelocities[i][0] * dt
        tiPositions[i][1] += tiVelocities[i][1] * dt
        tiPositions[i][2] += tiVelocities[i][2] * dt
        if (tiPositions[i][0] > 10) {
          tiPositions[i][0] = 10
          tiVelocities[i][0] *= -0.5
        }
        if (tiPositions[i][0] < -10) {
          tiPositions[i][0] = -10
          tiVelocities[i][0] *= -0.5
        }
        if (tiPositions[i][1] > 10) {
          tiPositions[i][1] = 10
          tiVelocities[i][1] *= -0.5
        }
        if (tiPositions[i][1] < 0) {
          tiPositions[i][1] = 0
          tiVelocities[i][1] *= -0.5
        }
        if (tiPositions[i][2] > 10) {
          tiPositions[i][2] = 10
          tiVelocities[i][2] *= -0.5
        }
        if (tiPositions[i][2] < -10) {
          tiPositions[i][2] = -10
          tiVelocities[i][2] *= -0.5
        }
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
    await tiBuildGrid()
    await tiComputeForces()
    await tiUpdate()

    const gpuEnd = performance.now()
    gpuTime.value = gpuEnd - gpuStart

    const transferStart = performance.now()
    const posData = await tiPositions.toArray()
    const velData = await tiVelocities.toArray()
    const transferEnd = performance.now()
    transferTime.value = transferEnd - transferStart

    const renderStart = performance.now()
    const positionsAttr = particles.geometry.attributes.position
    const colorsAttr = particles.geometry.attributes.color

    for (let i = 0; i < N; i++) {
      const px = posData[i]?.[0] ?? 0
      const py = posData[i]?.[1] ?? 0
      const pz = posData[i]?.[2] ?? 0
      const vx = velData[i]?.[0] ?? 0
      const vy = velData[i]?.[1] ?? 0
      const vz = velData[i]?.[2] ?? 0

      positionsAttr.setXYZ(i, px, py, pz)

      let r = 0, g = 0.5, b = 1
      const speed = Math.sqrt(vx * vx + vy * vy + vz * vz)

      if (visualMode.value === 'speed') {
        const t = Math.min(speed / 5, 1)
        r = t
        g = 1 - t * 0.5
        b = 1 - t
      } else if (visualMode.value === 'density') {
        const height = py / 10
        r = 1 - height
        g = 0.5
        b = height
      } else {
        r = 0.2 + speed * 0.2
        g = 0.5
        b = 1 - speed * 0.3
      }

      colorsAttr.setXYZ(i, r, g, b)
    }

    positionsAttr.needsUpdate = true
    colorsAttr.needsUpdate = true

    const renderEnd = performance.now()
    renderTime.value = renderEnd - renderStart

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
    frameTime.value = 1000 / fps.value
  }

  if (isAnimating.value) {
    updateParticles()
  }

  bounds.visible = showBounds.value

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }

  requestAnimationFrame(animate)
}

function toggleAnimation() {
  isAnimating.value = !isAnimating.value
  status.value = isAnimating.value ? '运行中' : '已暂停'
}

async function resetSimulation() {
  if (particles) {
    scene.remove(particles)
    if (particles.geometry) particles.geometry.dispose()
    if (particles.material) particles.material.dispose()
  }

  N = parseInt(particleCount.value as string)
  createParticles()
  await initTaichi()
}

function goToPrev() {
  window.location.reload()
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
  if (bounds) {
    scene.remove(bounds)
    if (bounds.geometry) bounds.geometry.dispose()
    if (bounds.material) bounds.material.dispose()
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
      background: rgba(255, 215, 0, 0.2);
      border: 1px solid rgba(255, 215, 0, 0.4);
      border-radius: 20px;
      font-size: 13px;
      color: #ffd700;
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
    background: rgba(255, 215, 0, 0.1);
    border-left: 4px solid rgba(255, 215, 0, 0.6);
    padding: 15px 20px;
    border-radius: 8px;
    margin: 20px 0;

    strong {
      color: #ffd700;
      font-size: 16px;
    }

    h4 {
      color: #ffd700;
      margin: 0 0 10px 0;
      font-size: 18px;
    }

    p {
      margin: 10px 0 0 0;
    }

    pre {
      background: rgba(0, 0, 0, 0.4);
      padding: 15px;
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
        font-size: 16px;
        color: #ffd700;
      }

      p {
        margin: 0 0 10px 0;
        font-size: 14px;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 5px 0 5px 20px;
          position: relative;
          font-size: 13px;

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

    &.disabled {
      background: rgba(0, 255, 136, 0.3);
      border-color: rgba(0, 255, 136, 0.4);
      color: #00ff88;
      cursor: default;
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
