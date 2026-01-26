<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第10课：大规模粒子系统（10万+）</h2>
          <span class="lesson-tag">高级渲染</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>理解 GPU 实例化渲染（Instanced Rendering）的原理</li>
            <li>掌握 Three.js InstancedMesh 的使用方法</li>
            <li>学习 LOD（Level of Detail）优化技术</li>
            <li>实现视锥体剔除（Frustum Culling）</li>
            <li>掌握 10 万+ 粒子的高效渲染方案</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 为什么需要实例化渲染？</h3>
          <p>
            传统的粒子系统使用 <code>THREE.Points</code>，在粒子数量达到 10 万+ 时会遇到瓶颈：
          </p>
          <pre><code>// 传统方法：每个粒子一次 Draw Call
100,000 个粒子 = 100,000 次 Draw Call
性能瓶颈：CPU 无法处理如此多的 Draw Call</code></pre>
          <div class="highlight-box">
            <strong>实例化渲染（Instanced Rendering）：</strong>
            <p>一次 Draw Call 渲染多个相同几何体的副本，大幅减少 CPU 开销。</p>
            <code>100,000 个实例 = 1 次 Draw Call</code>
          </div>
        </div>

        <div class="section">
          <h3>📖 Three.js InstancedMesh</h3>
          <div class="formula-list">
            <div class="formula-item">
              <h4>1. 创建 InstancedMesh</h4>
              <pre><code>// 创建基础几何体
const geometry = new THREE.SphereGeometry(1, 16, 16)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 })

// 创建实例化网格
const count = 100000
const instancedMesh = new THREE.InstancedMesh(
  geometry,    // 基础几何体
  material,     // 共享材质
  count         // 实例数量
)

scene.add(instancedMesh)</code></pre>
            </div>
            <div class="formula-item">
              <h4>2. 更新实例变换矩阵</h4>
              <pre><code>// 为每个实例设置位置、旋转、缩放
const dummy = new THREE.Object3D()
const matrix = new THREE.Matrix4()

for (let i = 0; i < count; i++) {
  dummy.position.set(positions[i][0], positions[i][1], positions[i][2])
  dummy.scale.set(scale[i], scale[i], scale[i])
  dummy.updateMatrix()

  instancedMesh.setMatrixAt(i, dummy.matrix)
  instancedMesh.setColorAt(i, colors[i])
}

// 标记需要更新
instancedMesh.instanceMatrix.needsUpdate = true
instancedMesh.instanceColor.needsUpdate = true</code></pre>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💻 完整代码示例</h3>
          <div class="code-demo">
            <pre><code>// Taichi.js 计算粒子位置
let tiPositions = ti.Vector.field(3, ti.f32, [N])
let tiVelocities = ti.Vector.field(3, ti.f32, [N])
let tiColors = ti.Vector.field(3, ti.f32, [N])

let tiUpdate = ti.kernel(() => {
  for (let i of ti.range(N)) {
    // GPU 并行计算所有粒子的物理
    tiPositions[i][0] += tiVelocities[i][0] * dt
    tiPositions[i][1] += tiVelocities[i][1] * dt
    tiPositions[i][2] += tiVelocities[i][2] * dt

    // 边界处理
    // ...
  }
})

// Three.js 更新实例矩阵
const dummy = new THREE.Object3D()
const matrix = new THREE.Matrix4()

async function updateRendering() {
  // 获取 GPU 计算结果
  const posData = await tiPositions.toArray()
  const colData = await tiColors.toArray()

  // 更新所有实例
  for (let i = 0; i < N; i++) {
    dummy.position.set(posData[i][0], posData[i][1], posData[i][2])
    dummy.scale.set(0.05, 0.05, 0.05)
    dummy.updateMatrix()

    instancedMesh.setMatrixAt(i, dummy.matrix)
    instancedMesh.setColorAt(i, new THREE.Color(
      colData[i][0],
      colData[i][1],
      colData[i][2]
    ))
  }

  instancedMesh.instanceMatrix.needsUpdate = true
  instancedMesh.instanceColor.needsUpdate = true
}</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>📊 性能优化技巧</h3>
          <div class="tips">
            <div class="tip-card">
              <h4>1. 减少数据传输</h4>
              <p>使用 <code>toFloat32Array()</code> 替代 <code>toArray()</code>，避免中间数组转换。</p>
            </div>
            <div class="tip-card">
              <h4>2. 视锥体剔除</h4>
              <p>只更新和渲染相机视野内的粒子，远离相机的粒子可以跳过更新。</p>
            </div>
            <div class="tip-card">
              <h4>3. LOD（细节层次）</h4>
              <p>远处的粒子使用简单的点，近处的粒子使用完整几何体。</p>
            </div>
            <div class="tip-card">
              <h4>4. 降采样</h4>
              <p>对于超大规模（100万+），可以对远距离粒子进行降采样显示。</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🧪 互动演示</h3>
          <div class="demo-container">
            <div class="demo-controls">
              <label>
                粒子数量: {{ particleCount.toLocaleString() }}
                <select v-model.number="particleCount" @change="resetSimulation">
                  <option :value="10000">10,000</option>
                  <option :value="50000">50,000</option>
                  <option :value="100000">100,000</option>
                </select>
              </label>
              <label>
                <input type="checkbox" v-model="useInstancing" @change="resetSimulation" />
                使用实例化渲染
              </label>
              <label>
                粒子大小: {{ particleSize }}
                <input v-model.number="particleSize" type="range" min="0.02" max="0.2" step="0.01" />
              </label>
              <label>
                速度范围: {{ velocityRange }}
                <input v-model.number="velocityRange" type="range" min="1" max="10" step="0.5" />
              </label>
              <button @click="resetSimulation">重置</button>
              <button @click="toggleAnimation">{{ isAnimating ? '暂停' : '继续' }}</button>
            </div>
            <div class="demo-canvas-container" ref="canvasContainer"></div>
            <div class="demo-info">
              <p>状态: <span :class="statusClass">{{ status }}</span></p>
              <p>FPS: {{ fps }}</p>
              <p>GPU 计算时间: {{ gpuTime }}ms</p>
              <p>渲染更新时间: {{ renderTime }}ms</p>
              <p v-if="useInstancing">Draw Calls: 1 (Instanced Mesh)</p>
              <p v-else>Draw Calls: {{ particleCount.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💡 进阶：视锥体剔除</h3>
          <div class="highlight-box">
            <strong>优化思路：</strong>
            <p>使用相机的视锥体来判断粒子是否可见，只更新可见的粒子。</p>
          </div>
          <pre><code>// 获取相机视锥体
const frustum = new THREE.Frustum()
const projScreenMatrix = new THREE.Matrix4()

projScreenMatrix.multiplyMatrices(
  camera.projectionMatrix,
  camera.matrixWorldInverse
)
frustum.setFromProjectionMatrix(projScreenMatrix)

// 检查粒子是否在视锥体内
function isVisible(position) {
  return frustum.containsPoint(position)
}</code></pre>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>完成本课后，您将了解：</p>
          <ul>
            <li>✅ InstancedMesh 实例化渲染的使用</li>
            <li>✅ 大规模粒子系统的性能优化方案</li>
            <li>✅ LOD 和视锥体剔除技术</li>
            <li>✅ 10 万+ 粒子的高效渲染实现</li>
          </ul>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">← 第9课：空间哈希优化</button>
        <button class="nav-btn next" @click="goToNext">第11课：性能分析与优化 →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import * as ti from 'taichi.js'

// Demo 控制参数
const particleCount = ref(50000)
const useInstancing = ref(true)
const particleSize = ref(0.05)
const velocityRange = ref(3)
const isAnimating = ref(true)
const status = ref('初始化中...')
const fps = ref(0)
const gpuTime = ref(0)
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
let particles: THREE.Points | THREE.InstancedMesh
let container: THREE.Mesh

// Taichi.js 变量
let tiPositions: any = null
let tiVelocities: any = null
let tiColors: any = null
let tiInit: any = null
let tiUpdate: any = null

let N = 50000
let dt = 0.016
let velocityRangeValue = 3
let lastFrameTime = performance.now()
let frameCount = 0

const dummy = new THREE.Object3D()
const matrix = new THREE.Matrix4()

// 初始化 Three.js 场景
function initThreeJS() {
  const width = canvasContainer.value!.clientWidth || 800
  const height = 500

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.z = 30
  camera.position.y = 10
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value!.appendChild(renderer.domElement)

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 20, 10)
  scene.add(directionalLight)

  // 创建容器
  createContainer()

  // 创建粒子系统
  createParticles()
}

// 创建容器
function createContainer() {
  const geometry = new THREE.BoxGeometry(40, 30, 40)
  const edges = new THREE.EdgesGeometry(geometry)
  const material = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.3 })
  container = new THREE.LineSegments(edges, material)
  scene.add(container)
}

// 创建粒子系统
function createParticles() {
  if (useInstancing.value) {
    // 使用 InstancedMesh
    const geometry = new THREE.SphereGeometry(1, 8, 8)
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true
    })

    particles = new THREE.InstancedMesh(geometry, material, N)
    scene.add(particles)
  } else {
    // 使用传统的 Points
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
}

// 初始化 Taichi.js
async function initTaichi() {
  try {
    await ti.init()

    N = particleCount.value
    velocityRangeValue = velocityRange.value

    // 创建字段
    tiPositions = ti.Vector.field(3, ti.f32, [N])
    tiVelocities = ti.Vector.field(3, ti.f32, [N])
    tiColors = ti.Vector.field(3, ti.f32, [N])

    ti.addToKernelScope({
      tiPositions, tiVelocities, tiColors,
      dt, N, velocityRangeValue
    })

    // 初始化内核
    tiInit = ti.kernel(() => {
      let vRange = velocityRangeValue

      for (let i of ti.range(N)) {
        tiPositions[i][0] = ti.random() * 40 - 20
        tiPositions[i][1] = ti.random() * 30 - 15
        tiPositions[i][2] = ti.random() * 40 - 20

        tiVelocities[i][0] = (ti.random() - 0.5) * vRange
        tiVelocities[i][1] = (ti.random() - 0.5) * vRange
        tiVelocities[i][2] = (ti.random() - 0.5) * vRange

        tiColors[i][0] = ti.random()
        tiColors[i][1] = 0.5 + ti.random() * 0.5
        tiColors[i][2] = 0.8 + ti.random() * 0.2
      }
    })

    // 更新内核
    tiUpdate = ti.kernel(() => {
      let vRange = velocityRangeValue

      for (let i of ti.range(N)) {
        tiPositions[i][0] += tiVelocities[i][0] * dt
        tiPositions[i][1] += tiVelocities[i][1] * dt
        tiPositions[i][2] += tiVelocities[i][2] * dt

        // 边界反弹
        if (tiPositions[i][0] > 20) {
          tiPositions[i][0] = 20
          tiVelocities[i][0] *= -1
        }
        if (tiPositions[i][0] < -20) {
          tiPositions[i][0] = -20
          tiVelocities[i][0] *= -1
        }
        if (tiPositions[i][1] > 15) {
          tiPositions[i][1] = 15
          tiVelocities[i][1] *= -1
        }
        if (tiPositions[i][1] < -15) {
          tiPositions[i][1] = -15
          tiVelocities[i][1] *= -1
        }
        if (tiPositions[i][2] > 20) {
          tiPositions[i][2] = 20
          tiVelocities[i][2] *= -1
        }
        if (tiPositions[i][2] < -20) {
          tiPositions[i][2] = -20
          tiVelocities[i][2] *= -1
        }

        // 根据速度更新颜色
        let speed2 = tiVelocities[i][0] * tiVelocities[i][0] +
                     tiVelocities[i][1] * tiVelocities[i][1] +
                     tiVelocities[i][2] * tiVelocities[i][2]
        let speed = ti.sqrt(speed2)
        tiColors[i][0] = ti.min(1.0, speed / vRange)
        tiColors[i][1] = ti.max(0.3, 1.0 - speed / vRange)
        tiColors[i][2] = 0.8
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
    // GPU 计算
    await tiUpdate()

    const gpuEnd = performance.now()
    gpuTime.value = (gpuEnd - gpuStart).toFixed(2)

    // 数据传输
    const renderStart = performance.now()

    const posData = await tiPositions.toArray()
    const colData = await tiColors.toArray()

    if (useInstancing.value && particles instanceof THREE.InstancedMesh) {
      // 使用 InstancedMesh 更新
      for (let i = 0; i < N; i++) {
        const px = posData[i]?.[0] ?? 0
        const py = posData[i]?.[1] ?? 0
        const pz = posData[i]?.[2] ?? 0

        dummy.position.set(px, py, pz)
        dummy.scale.set(particleSize.value, particleSize.value, particleSize.value)
        dummy.updateMatrix()

        particles.setMatrixAt(i, dummy.matrix)
        particles.setColorAt(i, new THREE.Color(
          colData[i]?.[0] ?? 0,
          colData[i]?.[1] ?? 0.5,
          colData[i]?.[2] ?? 1
        ))
      }

      particles.instanceMatrix.needsUpdate = true
      if (particles.instanceColor) {
        particles.instanceColor.needsUpdate = true
      }
    } else if (particles instanceof THREE.Points) {
      // 使用传统 Points 更新
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
    }

    const renderEnd = performance.now()
    renderTime.value = (renderEnd - renderStart).toFixed(2)

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
  velocityRangeValue = velocityRange.value

  await initTaichi()
  createParticles()
}

function goToPrev() {
  window.location.reload()
}

function goToNext() {
  alert('第11课即将推出！')
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
      background: rgba(0, 100, 255, 0.2);
      border: 1px solid rgba(0, 100, 255, 0.4);
      border-radius: 20px;
      font-size: 13px;
      color: #00aaff;
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

    code {
      display: block;
      background: rgba(0, 0, 0, 0.4);
      padding: 10px;
      border-radius: 5px;
      margin-top: 10px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #00ff88;
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
