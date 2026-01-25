<template>
  <div class="lesson-page">
    <div class="content-area">
      <div class="lesson-info">
        <div class="lesson-header">
          <h2>第5课：GPU 计算与数据传输</h2>
          <span class="lesson-tag">核心课程</span>
        </div>

        <div class="section">
          <h3>📚 学习目标</h3>
          <ul>
            <li>理解 GPU 计算与渲染的协作流程</li>
            <li>掌握 Taichi.js 的数据读取方式（toArray()）</li>
            <li>学习如何高效地将 GPU 数据传输到 Three.js</li>
            <li>理解性能优化关键点</li>
          </ul>
        </div>

        <div class="section">
          <h3>🎯 协作流程</h3>
          <p>Taichi.js 和 Three.js 的协作遵循以下流程：</p>
          <div class="flow-diagram">
            <div class="flow-item">
              <div class="flow-icon">1</div>
              <div class="flow-content">
                <strong>初始化阶段</strong>
                <p>创建 Taichi 字段、定义内核、初始化 Three.js 场景</p>
              </div>
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item">
              <div class="flow-icon">2</div>
              <div class="flow-content">
                <strong>GPU 计算</strong>
                <p>执行 Taichi 内核，在 GPU 上并行计算</p>
              </div>
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item">
              <div class="flow-icon">3</div>
              <div class="flow-content">
                <strong>数据传输</strong>
                <p>使用 toArray() 从 GPU 读取数据到 CPU</p>
              </div>
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item">
              <div class="flow-icon">4</div>
              <div class="flow-content">
                <strong>渲染</strong>
                <p>Three.js 使用数据渲染 3D 场景</p>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>📖 toArray() 方法详解</h3>
          <p>
            <strong>toArray()</strong>
            是将 GPU 数据传输到 CPU 的关键方法：
          </p>
          <pre><code>// 1D 字段
let field1D = ti.field(ti.f32, 1000)
const data1D = await field1D.toArray()
// data1D 是普通 JavaScript 数组: [0.1, 0.2, 0.3, ...]

// 2D 字段
let field2D = ti.field(ti.f32, [100, 100])
const data2D = await field2D.toArray()
// data2D 是 2D 数组: [[0.1, 0.2, ...], [0.3, 0.4, ...], ...]

// 向量字段
let vectorField = ti.Vector.field(3, ti.f32, 1000)
const vectors = await vectorField.toArray()
// vectors 是数组，每个元素是 3D 向量: [[1,2,3], [4,5,6], ...]</code></pre>
          <div class="highlight-box">
            <strong>注意事项：</strong>
            <ul>
              <li>
                ⚠️ toArray() 是
                <strong>异步</strong>
                方法，需要使用 await
              </li>
              <li>⚠️ 数据传输从 GPU → CPU，有一定性能开销</li>
              <li>⚠️ 不要每帧都传输大量数据，影响性能</li>
              <li>💡 后续课程会学习更高效的 Texture 传输方式</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h3>💻 代码示例：粒子系统完整实现</h3>
          <div class="code-demo">
            <pre><code>// 1. 定义字段
const N = 5000
let positions = ti.Vector.field(3, ti.f32, [N])
let velocities = ti.Vector.field(3, ti.f32, [N])
let colors = ti.Vector.field(3, ti.f32, [N])

ti.addToKernelScope({ positions, velocities, colors, N })

// 2. 初始化内核
let init = ti.kernel(() => {
  for (let i of ti.range(N)) {
    positions[i] = [
      ti.random() * 6 - 3,
      ti.random() * 6 - 3,
      ti.random() * 6 - 3
    ]
    velocities[i] = [
      (ti.random() - 0.5) * 0.02,
      (ti.random() - 0.5) * 0.02,
      (ti.random() - 0.5) * 0.02
    ]
    colors[i] = [
      ti.random(),
      ti.random() * 0.5 + 0.5,
      ti.random()
    ]
  }
})

// 3. 更新内核
let update = ti.kernel(() => {
  for (let i of ti.range(N)) {
    positions[i] += velocities[i]
    
    // 边界反弹
    for (let d of ti.static(ti.range(3))) {
      if (positions[i][d] < -3 || positions[i][d] > 3) {
        velocities[i][d] *= -1
      }
    }
  }
})

// 4. 初始化
await init()

// 5. 每帧循环
async function animate() {
  // GPU 计算
  await update()
  
  // 数据传输
  const posData = await positions.toArray()
  const colData = await colors.toArray()
  
  // 更新 Three.js 几何体
  const positionsAttr = particles.geometry.attributes.position
  const colorsAttr = particles.geometry.attributes.color
  
  for (let i = 0; i < N; i++) {
    positionsAttr.setXYZ(i, posData[i][0], posData[i][1], posData[i][2])
    colorsAttr.setXYZ(i, colData[i][0], colData[i][1], colData[i][2])
  }
  
  positionsAttr.needsUpdate = true
  colorsAttr.needsUpdate = true
  
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}</code></pre>
          </div>
        </div>

        <div class="section">
          <h3>⚡ 性能优化建议</h3>
          <div class="optimization-tips">
            <div class="tip-card">
              <h4>1. 减少传输频率</h4>
              <p>不是每帧都需要传输数据，某些场景可以隔帧更新</p>
            </div>
            <div class="tip-card">
              <h4>2. 批量传输</h4>
              <p>将多个字段的读取合并，减少 GPU→CPU 传输次数</p>
            </div>
            <div class="tip-card">
              <h4>3. 使用 TypedArray</h4>
              <p>Three.js 的 BufferAttribute 使用 TypedArray，避免中间转换</p>
            </div>
            <div class="tip-card">
              <h4>4. Texture 传输（进阶）</h4>
              <p>第6课将学习 GPU-GPU 零拷贝传输，性能更佳</p>
            </div>
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
                速度: {{ speedMultiplier }}x
                <input v-model.number="speedMultiplier" type="range" min="0" max="50" step="1" />
              </label>
              <label>
                <input v-model="showTrail" type="checkbox" />
                显示轨迹
              </label>
              <label v-if="showTrail">
                轨迹长度: {{ trailLength }}
                <input v-model.number="trailLength" type="range" min="5" max="50" step="1" @change="clearTrail" />
              </label>
              <button @click="toggleAnimation">{{ isAnimating ? '暂停' : '继续' }}</button>
              <button @click="resetParticles">重置</button>
            </div>
            <div ref="canvasContainer" class="demo-canvas-container"></div>
            <div class="demo-info">
              <p>
                状态:
                <span :class="statusClass">{{ status }}</span>
              </p>
              <p>FPS: {{ fps }}</p>
              <p>GPU 计算时间: {{ gpuTime }}ms</p>
              <p>传输时间: {{ transferTime }}ms</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🚀 下一步</h3>
          <p>完成本课后，您将了解：</p>
          <ul>
            <li>✅ GPU 计算与渲染的协作流程</li>
            <li>✅ 如何使用 toArray() 传输数据</li>
            <li>✅ 性能优化的关键点</li>
          </ul>
          <p class="next-lesson">
            下一课将学习 Texture 数据传输，实现更高效的 GPU-GPU 零拷贝共享。
          </p>
        </div>
      </div>

      <div class="navigation">
        <button class="nav-btn prev" @click="goToPrev">← 第4课：Taichi.js 字段系统</button>
        <button class="nav-btn next" @click="goToNext">第6课：Texture 数据传输优化 →</button>
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
const speedMultiplier = ref(1.0)
const showTrail = ref(false)
const isAnimating = ref(true)
const status = ref('初始化中...')
const fps = ref(0)
const gpuTime = ref(0)
const transferTime = ref(0)
const trailLength = ref(20) // 轨迹长度

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
let trailPoints: THREE.Points
let trailHistory: Float32Array[] = [] // 轨迹历史数据
let trailIndex = 0

// Taichi.js 变量
let tiPositions: any = null
let tiVelocities: any = null
let tiColors: any = null
let tiSpeedMultiplier: any = null
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
  camera.position.z = 10
  camera.position.y = 3
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value!.appendChild(renderer.domElement)

  // 创建粒子系统
  createParticles()
}

// 创建粒子系统
function createParticles() {
  const geometry = new THREE.BufferGeometry()

  // 位置属性
  const positions = new Float32Array(N * 3)
  const colors = new Float32Array(N * 3)
  const sizes = new Float32Array(N)

  for (let i = 0; i < N; i++) {
    positions[i * 3] = 0
    positions[i * 3 + 1] = 0
    positions[i * 3 + 2] = 0
    colors[i * 3] = 1
    colors[i * 3 + 1] = 1
    colors[i * 3 + 2] = 1
    sizes[i] = 0.1
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  // 自定义着色器材质
  const material = new THREE.ShaderMaterial({
    uniforms: {
      pointSize: { value: 5.0 }
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float r = distance(gl_PointCoord, vec2(0.5));
        if (r > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.3, 0.5, r);
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    vertexColors: true
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // 创建轨迹点 - 使用 LineSegments 绘制轨迹线
  const trailGeometry = new THREE.BufferGeometry()
  const trailPositions = new Float32Array(N * trailLength.value * 6) // 每个点用2个顶点形成线段，所以是 * 2 * 3
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))

  const trailMaterial = new THREE.LineBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.5,
    linewidth: 1
  })

  trailPoints = new THREE.LineSegments(trailGeometry, trailMaterial)
  trailPoints.visible = false
  scene.add(trailPoints)

  // 初始化轨迹历史
  trailHistory = []
  trailIndex = 0
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
    tiSpeedMultiplier = ti.field(ti.f32, [1])

    ti.addToKernelScope({
      tiPositions,
      tiVelocities,
      tiColors,
      tiSpeedMultiplier,
      N
    })

    // 初始化内核
    tiInit = ti.kernel(() => {
      for (let i of ti.range(N)) {
        tiPositions[i] = [ti.random() * 6 - 3, ti.random() * 6 - 3, ti.random() * 6 - 3]
        // 增加基础速度，使移动更明显
        tiVelocities[i] = [
          (ti.random() - 0.5) * 0.05,
          (ti.random() - 0.5) * 0.05,
          (ti.random() - 0.5) * 0.05
        ]
        tiColors[i] = [ti.random() * 0.5 + 0.5, ti.random(), ti.random() * 0.5 + 0.5]
      }
      tiSpeedMultiplier[0] = 1.0
    })

    // 更新内核
    tiUpdate = ti.kernel(() => {
      for (let i of ti.range(N)) {
        let speed = tiSpeedMultiplier[0]
        tiPositions[i] += tiVelocities[i] * speed

        // 边界反弹
        for (let d of ti.static(ti.range(3))) {
          if (tiPositions[i][d] < -3 || tiPositions[i][d] > 3) {
            tiVelocities[i][d] *= -1
          }
        }

        // 颜色随位置变化
        let x = tiPositions[i].x / 3.0
        let y = tiPositions[i].y / 3.0
        tiColors[i] = [x * 0.5 + 0.5, y * 0.5 + 0.5, 1.0 - (x * x + y * y) * 0.25]
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
    tiSpeedMultiplier[0] = speedMultiplier.value
    await tiUpdate()

    const gpuEnd = performance.now()
    gpuTime.value = (gpuEnd - gpuStart).toFixed(2)

    // 数据传输
    const transferStart = performance.now()

    const posData = await tiPositions.toArray()
    const colData = await tiColors.toArray()

    const transferEnd = performance.now()
    transferTime.value = (transferEnd - transferStart).toFixed(2)

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

    // 更新轨迹
    if (showTrail.value) {
      // 保存当前位置到历史
      const currentPositions = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        const px = posData[i][0] !== undefined ? posData[i][0] : 0
        const py = posData[i][1] !== undefined ? posData[i][1] : 0
        const pz = posData[i][2] !== undefined ? posData[i][2] : 0
        currentPositions[i * 3] = px
        currentPositions[i * 3 + 1] = py
        currentPositions[i * 3 + 2] = pz
      }
      trailHistory.push(currentPositions)

      // 保持历史记录不超过指定长度
      while (trailHistory.length > trailLength.value) {
        trailHistory.shift()
      }

      // 更新轨迹线段
      const trailAttr = trailPoints.geometry.attributes.position
      let vertexIndex = 0

      for (let h = 0; h < trailHistory.length - 1; h++) {
        for (let i = 0; i < N; i++) {
          // 起点
          trailAttr.setXYZ(
            vertexIndex,
            trailHistory[h][i * 3],
            trailHistory[h][i * 3 + 1],
            trailHistory[h][i * 3 + 2]
          )
          vertexIndex++

          // 终点
          trailAttr.setXYZ(
            vertexIndex,
            trailHistory[h + 1][i * 3],
            trailHistory[h + 1][i * 3 + 1],
            trailHistory[h + 1][i * 3 + 2]
          )
          vertexIndex++
        }
      }

      trailAttr.needsUpdate = true
      trailPoints.visible = true
    } else {
      trailPoints.visible = false
      trailHistory = []
    }
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

// 清除轨迹
function clearTrail() {
  trailHistory = []
  trailPoints.visible = false
  trailPoints.geometry.attributes.position.needsUpdate = true
}

// 重置粒子
async function resetParticles() {
  if (particles) {
    scene.remove(particles)
    if (particles.geometry) particles.geometry.dispose()
    if (particles.material) particles.material.dispose()
  }

  if (trailPoints) {
    scene.remove(trailPoints)
    if (trailPoints.geometry) trailPoints.geometry.dispose()
    if (trailPoints.material) trailPoints.material.dispose()
  }

  N = particleCount.value

  await initTaichi()
  createParticles()
}

function goToPrev() {
  window.location.reload()
}

function goToNext() {
  alert('第6课即将推出！')
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
  if (trailPoints) {
    scene.remove(trailPoints)
    if (trailPoints.geometry) trailPoints.geometry.dispose()
    if (trailPoints.material) trailPoints.material.dispose()
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
      background: rgba(255, 100, 100, 0.2);
      border: 1px solid rgba(255, 100, 100, 0.4);
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

  .flow-diagram {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    background: rgba(0, 50, 100, 0.15);
    border-radius: 10px;
    margin: 20px 0;

    .flow-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 20px;
      background: rgba(0, 170, 255, 0.1);
      border: 2px solid rgba(0, 170, 255, 0.3);
      border-radius: 10px;
      width: 100%;
      max-width: 500px;

      .flow-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
      }

      .flow-content {
        flex: 1;

        strong {
          display: block;
          color: #00aaff;
          margin-bottom: 5px;
        }

        p {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }

    .flow-arrow {
      color: #00ff88;
      font-size: 24px;
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

  .optimization-tips {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin: 20px 0;

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
        margin: 0;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
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

        input[type='range'],
        input[type='checkbox'] {
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

        .running {
          color: #00ff88;
          font-weight: bold;
        }
        .paused {
          color: #ffaa00;
          font-weight: bold;
        }
        .error {
          color: #ff4444;
          font-weight: bold;
        }
        .idle {
          color: rgba(255, 255, 255, 0.7);
        }
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

  .optimization-tips {
    grid-template-columns: 1fr;
  }
}
</style>
