<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第7课：粒子物理模拟（重力场）</h2>
          <span class="lesson-tag">物理模拟</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>理解物理模拟的基本概念</li>
            <li>学习重力场的实现方法</li>
            <li>掌握使用 Taichi.js 进行物理计算</li>
            <li>实现简单的欧拉积分方法</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 什么是物理模拟？</h3>
          <p>
            <strong>物理模拟</strong>是通过数学模型模拟现实世界中物体运动的技术。
            在粒子系统中，我们需要计算每个粒子的位置、速度和加速度。
          </p>
          <div class="highlight-box">
            <strong>核心概念：</strong>
            <ul>
              <li>📌 <strong>位置（Position）</strong>：粒子在空间中的坐标</li>
              <li>🚀 <strong>速度（Velocity）</strong>：位置变化的速率</li>
              <li>⚡ <strong>加速度（Acceleration）</strong>：速度变化的速率</li>
              <li>🌍 <strong>力（Force）</strong>：产生加速度的原因</li>
            </ul>
          </div>
          <pre><code>// 牛顿第二定律：F = m * a
// 重力加速度：a = g
// 欧拉积分法：
velocity += acceleration * dt
position += velocity * dt</code></pre>
        </div>

        <div class="section">
          <h3>📖 重力场实现</h3>
          <p>
            <strong>重力场</strong>是一个向下的恒定力场，所有粒子都受到相同的重力加速度。
          </p>
          <div class="gravity-diagram">
            <div class="particle-row">
              <div class="particle" v-for="i in 5" :key="i">
                <div class="particle-dot"></div>
                <div class="gravity-arrow">↓</div>
              </div>
            </div>
            <div class="gravity-label">重力 g = (0, -9.8, 0)</div>
          </div>
          <pre><code>// 重力场内核
let gravity = ti.Vector([0, -9.8, 0])

let updateWithGravity = ti.kernel(() => {
  for (let i of ti.range(N)) {
    // 应用重力加速度
    velocities[i] += gravity * dt
    
    // 更新位置
    positions[i] += velocities[i] * dt
    
    // 地面碰撞
    if (positions[i].y < groundLevel) {
      positions[i].y = groundLevel
      velocities[i].y *= -0.6  // 反弹系数
    }
  }
})</code></pre>
        </div>

        <div class="section">
          <h3>💻 代码示例：完整重力模拟</h3>
          <div class="code-demo">
            <pre><code>// 定义粒子数量
const N = 5000

// 创建字段
let positions = ti.Vector.field(3, ti.f32, [N])
let velocities = ti.Vector.field(3, ti.f32, [N])
let colors = ti.Vector.field(3, ti.f32, [N])

// 物理参数
let gravity = ti.Vector([0, -9.8, 0])
let dt = 0.016  // 时间步长
let groundLevel = -3.0
let damping = 0.99  // 阻尼

ti.addToKernelScope({ 
  positions, velocities, colors,
  gravity, dt, groundLevel, damping, N 
})

// 初始化
let init = ti.kernel(() => {
  for (let i of ti.range(N)) {
    positions[i] = [
      ti.random() * 6 - 3,
      ti.random() * 3 + 1,
      ti.random() * 6 - 3
    ]
    velocities[i] = [
      (ti.random() - 0.5) * 2,
      ti.random() * 2,
      (ti.random() - 0.5) * 2
    ]
    colors[i] = [
      ti.random(),
      ti.random(),
      ti.random()
    ]
  }
})

// 物理更新
let update = ti.kernel(() => {
  for (let i of ti.range(N)) {
    // 应用重力
    velocities[i] += gravity * dt
    
    // 应用阻尼（空气阻力）
    velocities[i] *= damping
    
    // 更新位置
    positions[i] += velocities[i] * dt
    
    // 地面碰撞检测
    if (positions[i].y < groundLevel) {
      positions[i].y = groundLevel
      velocities[i].y *= -0.5  // 反弹
      velocities[i].x *= 0.8    // 摩擦
      velocities[i].z *= 0.8
    }
    
    // 墙壁碰撞
    for (let d of ti.static(ti.range(3))) {
      if (ti.abs(positions[i][d]) > 3) {
        positions[i][d] = 3 * ti.sign(positions[i][d])
        velocities[i][d] *= -0.5
      }
    }
  }
})</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>🧪 互动演示</h3>
          <div class="demo-container">
            <div class="demo-controls">
              <label>
                粒子数量: {{ particleCount }}
                <input 
                  v-model.number="particleCount" 
                  type="range" 
                  min="1000" 
                  max="10000" 
                  step="1000" 
                  @change="resetParticles" 
                />
              </label>
              <label>
                重力: {{ gravityStrength }}x
                <input v-model.number="gravityStrength" type="range" min="0" max="3" step="0.1" />
              </label>
              <label>
                弹性: {{ restitution }}
                <input v-model.number="restitution" type="range" min="0" max="1" step="0.1" />
              </label>
              <label>
                阻尼: {{ damping }}
                <input v-model.number="damping" type="range" min="0.9" max="1" step="0.01" />
              </label>
              <label>
                <input type="checkbox" v-model="showGround" />
                显示地面
              </label>
              <button @click="resetParticles">重置</button>
              <button @click="toggleAnimation">{{ isAnimating ? '暂停' : '继续' }}</button>
            </div>
            <div class="demo-canvas-container" ref="canvasContainer"></div>
            <div class="demo-info">
              <p>状态: <span :class="statusClass">{{ status }}</span></p>
              <p>FPS: {{ fps }}</p>
              <p>GPU 计算时间: {{ gpuTime }}ms</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🚀 进阶：交互式重力</h3>
          <div class="highlight-box">
            <strong>提示：</strong>
            <p>点击画布可以添加新的粒子，按住拖动可以创建"力场"影响周围粒子！</p>
          </div>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>完成本课后，您将了解：</p>
          <ul>
            <li>✅ 物理模拟的基本原理</li>
            <li>✅ 重力场的实现方法</li>
            <li>✅ 碰撞检测与响应</li>
          </ul>
          <p class="next-lesson">
            下一课将学习流体粒子模拟（SPH），实现更复杂的水体效果。
          </p>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">
          ← 第6课：Texture 数据传输优化
        </button>
        <button class="nav-btn next" @click="goToNext">
          第8课：流体粒子模拟（SPH） →
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
const particleCount = ref(5000)
const gravityStrength = ref(1.0)
const restitution = ref(0.5)
const damping = ref(0.99)
const showGround = ref(true)
const isAnimating = ref(true)
const status = ref('初始化中...')
const fps = ref(0)
const gpuTime = ref(0)

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
let ground: THREE.Mesh

// Taichi.js 变量
let tiPositions: any = null
let tiVelocities: any = null
let tiColors: any = null
let tiGravity: any = null
let tiDamping: any = null
let tiRestitution: any = null
let tiInit: any = null
let tiUpdate: any = null

let N = 5000
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
  camera.position.y = 3
  camera.lookAt(0, -1, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value!.appendChild(renderer.domElement)

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // 创建地面
  createGround()

  // 创建粒子系统
  createParticles()
}

// 创建地面
function createGround() {
  const geometry = new THREE.PlaneGeometry(8, 6)
  const material = new THREE.MeshBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  })
  ground = new THREE.Mesh(geometry, material)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -3
  ground.visible = showGround.value
  scene.add(ground)
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
    colors[i * 3] = 1
    colors[i * 3 + 1] = 1
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
    
    // 创建字段
    tiPositions = ti.Vector.field(3, ti.f32, [N])
    tiVelocities = ti.Vector.field(3, ti.f32, [N])
    tiColors = ti.Vector.field(3, ti.f32, [N])
    tiGravity = ti.field(ti.f32, [3])
    tiDamping = ti.field(ti.f32, [1])
    tiRestitution = ti.field(ti.f32, [1])
    
    ti.addToKernelScope({ 
      tiPositions, 
      tiVelocities, 
      tiColors,
      tiGravity,
      tiDamping,
      tiRestitution,
      N 
    })
    
    // 初始化内核
    tiInit = ti.kernel(() => {
      for (let i of ti.range(N)) {
        tiPositions[i] = [
          ti.random() * 6 - 3,
          ti.random() * 3 + 1,
          ti.random() * 6 - 3
        ]
        tiVelocities[i] = [
          (ti.random() - 0.5) * 2,
          ti.random() * 2,
          (ti.random() - 0.5) * 2
        ]
        tiColors[i] = [
          ti.random(),
          ti.random() * 0.5 + 0.5,
          ti.random()
        ]
      }
      tiGravity[0] = 0
      tiGravity[1] = -9.8
      tiGravity[2] = 0
      tiDamping[0] = 0.99
      tiRestitution[0] = 0.5
    })
    
    // 物理更新内核
    tiUpdate = ti.kernel(() => {
      let g = tiGravity
      let d = tiDamping[0]
      let r = tiRestitution[0]
      let dt = 0.016
      
      for (let i of ti.range(N)) {
        // 应用重力
        tiVelocities[i][0] += g[0] * dt
        tiVelocities[i][1] += g[1] * dt
        tiVelocities[i][2] += g[2] * dt
        
        // 应用阻尼
        tiVelocities[i][0] *= d
        tiVelocities[i][1] *= d
        tiVelocities[i][2] *= d
        
        // 更新位置
        tiPositions[i][0] += tiVelocities[i][0] * dt
        tiPositions[i][1] += tiVelocities[i][1] * dt
        tiPositions[i][2] += tiVelocities[i][2] * dt
        
        // 地面碰撞
        let groundLevel = -3.0
        if (tiPositions[i][1] < groundLevel) {
          tiPositions[i][1] = groundLevel
          tiVelocities[i][1] *= -r
          tiVelocities[i][0] *= 0.8
          tiVelocities[i][2] *= 0.8
        }
        
        // 墙壁碰撞
        let bound = 3.0
        if (tiPositions[i][0] > bound) {
          tiPositions[i][0] = bound
          tiVelocities[i][0] *= -0.5
        }
        if (tiPositions[i][0] < -bound) {
          tiPositions[i][0] = -bound
          tiVelocities[i][0] *= -0.5
        }
        if (tiPositions[i][2] > bound) {
          tiPositions[i][2] = bound
          tiVelocities[i][2] *= -0.5
        }
        if (tiPositions[i][2] < -bound) {
          tiPositions[i][2] = -bound
          tiVelocities[i][2] *= -0.5
        }
        
        // 颜色随速度变化
        let speed = ti.sqrt(
          tiVelocities[i][0] * tiVelocities[i][0] +
          tiVelocities[i][1] * tiVelocities[i][1] +
          tiVelocities[i][2] * tiVelocities[i][2]
        )
        tiColors[i] = [
          ti.min(1.0, speed * 0.3),
          ti.max(0.0, 1.0 - speed * 0.2),
          0.5
        ]
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
    tiGravity[0] = 0
    tiGravity[1] = -9.8 * gravityStrength.value
    tiGravity[2] = 0
    tiDamping[0] = damping.value
    tiRestitution[0] = restitution.value
    
    // GPU 计算
    await tiUpdate()
    
    const gpuEnd = performance.now()
    gpuTime.value = (gpuEnd - gpuStart).toFixed(2)
    
    // 数据传输
    const posData = await tiPositions.toArray()
    const colData = await tiColors.toArray()
    
    // 更新 Three.js
    const positionsAttr = particles.geometry.attributes.position
    const colorsAttr = particles.geometry.attributes.color
    
    for (let i = 0; i < N; i++) {
      const px = posData[i][0] !== undefined ? posData[i][0] : 0
      const py = posData[i][1] !== undefined ? posData[i][1] : 0
      const pz = posData[i][2] !== undefined ? posData[i][2] : 0
      
      const cx = colData[i][0] !== undefined ? colData[i][0] : 1
      const cy = colData[i][1] !== undefined ? colData[i][1] : 1
      const cz = colData[i][2] !== undefined ? colData[i][2] : 1
      
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
  
  // 更新地面可见性
  if (ground) {
    ground.visible = showGround.value
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

// 重置粒子
async function resetParticles() {
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
  alert('第8课即将推出！')
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
  if (ground) {
    scene.remove(ground)
    if (ground.geometry) ground.geometry.dispose()
    if (ground.material) ground.material.dispose()
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
      background: rgba(255, 150, 0, 0.2);
      border: 1px solid rgba(255, 150, 0, 0.4);
      border-radius: 20px;
      font-size: 13px;
      color: #ff9933;
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

    ul li:before {
      color: #ffc800;
    }

    p {
      margin: 10px 0 0 0;
    }
  }

  .gravity-diagram {
    background: rgba(0, 50, 100, 0.15);
    border-radius: 12px;
    padding: 30px;
    margin: 20px 0;
    text-align: center;

    .particle-row {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 20px;

      .particle {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .particle-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #00ff88, #008844);
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }

        .gravity-arrow {
          font-size: 30px;
          color: #00aaff;
          font-weight: bold;
        }
      }
    }

    .gravity-label {
      font-size: 18px;
      color: #00ff88;
      margin-top: 10px;
      font-family: 'Courier New', monospace;
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
        font-size: 11px;
        line-height: 1.5;
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
        gap: 8px;
        font-size: 14px;

        input[type="range"],
        input[type="checkbox"] {
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

@media (max-width: 768px) {
  .lesson-page {
    padding: 60px 15px 20px 15px;
  }

  .gravity-diagram {
    .particle-row {
      flex-wrap: wrap;
      gap: 20px;
    }
  }
}
</style>
